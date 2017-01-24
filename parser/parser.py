import riffle
import time
import os
import sys
import random
import argparse
import json
import math
import struct
import binascii
import re

parser = argparse.ArgumentParser(description="A script for converting raw can messages to correct values")
parser.add_argument('-p','--parser',default='../app/parser.json',help="Location of parser json file",metavar="parser")
parser.add_argument('-b','--batch_size',default=5, help="Size of CAN message batches. Defaults to 5",metavar="batch_size")
parser.add_argument('-l','--backend_location',default="ws://localhost:8000", help="Location of backend.  Defaults to ws://localhost:9000",metavar="backend")
args = vars(parser.parse_args())

with open(args['parser']) as parser_file:    
    parser = json.load(parser_file)



class spammer(riffle.Domain):

    def can_parser(self,data):
        converted_batch = []
        # msg in format [timestamp,sid,msg_type,data]
        for msg in data:
            
            ts = float(msg[0])
            sid = msg[1]
            msg_type = int(msg[2],16)
            data_str = msg[3]

            converted_data = [ts,sid,msg_type]
            message_spec = parser['messages'][msg_type]
            bytes = re.findall('..',data_str )
            for val in message_spec['values']:
                data_value = bytes[:val['byte_size']]
                bytes = bytes[val['byte_size']:]
                formatted_val  = round(int(data_value,16)*val['scalar'],val['precision'])
                print(formatted_val)
                converted_data.append(formatted_val)
            converted_batch.append(converted_data)
        #print(converted_batch)
        self.publish("data",converted_batch)

    def onJoin(self):
        print("Connected to Exis Node @ %s" % args['backend_location'])
        self.subscribe("can", self.can_parser)



if __name__ == '__main__':
    print("Starting parser")
    print(args['backend_location'])
    riffle.SetFabric(args['backend_location'])
    spammer('xs.node').join()