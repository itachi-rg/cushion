rom flask import Flask
from flask import request
import ssl
import base64
import urllib
from flask import send_from_directory
import os
from time import gmtime, strftime

#app = Flask(__name__)

app = Flask(__name__, static_folder='build')

user_count = 0
user_list = []
WRITE_THRESHOLD = 5

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    global user_count
    global user_list
    global WRITE_THRESHOLD
    timestamp = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    ip = request.remote_addr
    print("User_count ", user_count, "Request IP ", ip, " Time ", timestamp)
    user_list.append(str(user_count)+','+ip+','+timestamp)
    user_count += 1
    if user_count%WRITE_THRESHOLD==0:
        try:
            print("writing user data")
            with open("user_log.csv","a") as f:
                f.write("\n"+"\n".join(user_list))
                user_list = []
        except Exception as e:
            print("type error: " + str(e))
    if path != "" and os.path.exists("build/" + path):
        return send_from_directory('build/', path)
    else:
        return send_from_directory('build/', 'index.html')

if __name__ == "__main__":
  app.run(host='0.0.0.0',port=80,use_reloader=True,  threaded=True)