from flask import Flask
from flask import request
import ssl
import base64
import urllib 
from flask import send_from_directory
import os
from time import gmtime, strftime
import requests
from bs4 import BeautifulSoup
from bs4.element import Comment
import requests

app = Flask(__name__, static_folder='build')

user_count = 0
user_list = []
WRITE_THRESHOLD = 5

# Source : https://stackoverflow.com/questions/1936466/beautifulsoup-grab-visible-webpage-text
def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True

def text_from_html(body):
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    visible_texts = filter(tag_visible, texts)  
    return u" ".join(t.strip() for t in visible_texts)

# Get request to fetch a webpage contents
@app.route('/proxyrequest')
def data():
    url = request.args.get('p')
    header = {'X-Requested-With':'XMLHttpRequest'}
    result = requests.get(url, headers=header)
    html = result.content

    if result.status_code==200:
        return text_from_html(html)
    else:
        return "ERROR_FETCH"

# Serve the React JS webpages
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
