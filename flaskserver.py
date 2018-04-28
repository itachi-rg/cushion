from flask import Flask
from flask import request
import ssl
import base64
import urllib
from flask import send_from_directory
import os
from time import gmtime, strftime

#app = Flask(__name__)

app = Flask(__name__, static_folder='build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    timestamp = strftime("%Y-%m-%d %H:%M:%S", gmtime())
    ip = request.remote_addr
    print("Request IP ", ip, " Time ", timestamp)
    try:
        with open("user_log.csv","a") as f:
            f.write(ip+','+timestamp+'\n')
    except Exception as e:
        print("type error: " + str(e))
    if path != "" and os.path.exists("build/" + path):
        return send_from_directory('build/', path)
    else:
        return send_from_directory('build/', 'index.html')

if __name__ == "__main__":
  app.run(host='0.0.0.0',port=80,use_reloader=True,  threaded=True)