import riffle
import time
import os
import sys
import random
import argparse
import json

parser = argparse.ArgumentParser(description="A script for spamming the Exis node backend with random data")
parser.add_argument('-p','--parser',default='../app/parser.json',help="Location of parser json file",metavar="parser")
parser.add_argument('-f','--frequency_hz',default=1, help="Frequency in hertz of messages sent over the network. Defaults to 10",metavar="frequency_hz")
parser.add_argument('-b','--batch_size',default=5, help="Size of CAN message batches. Defaults to 5",metavar="batch_size")
parser.add_argument('-i','--can_interface',default="can1", help="can interface used to read message from the bus",metavar="can_interface")
parser.add_argument('-l','--backend_location',default="ws://192.168.1.99:9000", help="Location of backend.  Defaults to ws://192.168.1.99:9000",metavar="backend")
parser.add_argument('-sb','--spam_bus',default=True, help="Boolean: spam CAN bus on the WCM. Defaults to True",metavar="spam_bus")
args = vars(parser.parse_args())

with open(args['parser']) as parser_file:    
    parser = json.load(parser_file)

def generate_message():
    print("Generating random message")
    data_hex = ""
    msg_type = random.choice(parser['msg_type'].keys())
    msg_spec = parser['msg_type'][msg_type]
    module = msg_spec['module']
    print(msg_spec['module'])
    for val in msg_spec['values']:
        spec = val[val.keys()[0]]
        print(val.keys()[0])
        if 'nominal_high' in spec and 'nominal_low' in spec and 'scalar' in spec and 'byte_size' in spec and str(spec['units']) != 'str':
                print(spec['units'])
                off = spec['nominal_high'] * .1
                high = spec['nominal_high'] + off
                low = spec['nominal_low'] - off
                byte_size = spec['byte_size']
                scalar = spec['scalar']
                data = int(random.uniform(low,high)/scalar)
                data = format(data, 'x')
                data = data.replace("-","")

                print(data)
                data_hex = data_hex + data
        else:
            data_hex = "00"
    print(module)
    if module is not 'ALL' and 'from' in parser['SID'][module]:
        int_sid = parser['SID'][module]['from']
        sid = "{0:0{1}X}".format(int_sid,3)
        print(sid)
    else:
        sid = '000'
    print("SID: %s Type: %s Data: %s " %(sid,msg_type,data_hex))
    return sid, msg_type, data_hex

class spammer(riffle.Domain):

    def onJoin(self):
        print("Connected to Exis Node at %s" % args['backend_location'])
        while True:
            if args['spam_bus']:
                sid, msg_type, data = generate_message()
                #subprocess.call('cansend %s %s#%s%s'%(args['can_interface'],sid,msg_type,data) , shell=True)
            else:
                batch = []
                for i in range(0,args['batch_size']):
                    sid, msg_type, data  = generate_message()
                    batch.append(mock_msg)
            #self.publish("can",[[str(current_milli_time()),"100","00","00 00"],[str(current_milli_time()),"100","00","00 00"]]) # Using for tests
            time.sleep(1/args['frequency_hz'])

if __name__ == '__main__':
    print("Starting exis node spammer")
    print(args['backend_location'])
    riffle.SetFabric(args['backend_location'])
    spammer('xs.node').join()