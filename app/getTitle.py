
from bs4 import BeautifulSoup
import re
import urllib2
from flask import Flask,request,jsonify
import flask.views
import json

class TitleGet(flask.views.MethodView):
    def post(self):
        args= json.loads(request.data)
        url = args['url']#"http://www.ebay.com/itm/NEW-Pioneer-AVH-X4800BS-Double-2-DIN-DVD-CD-Player-7-Bluetooth-Spotify-Pandora-/20149408220?hash=item2ee9fb2ddc:g:hjEAAOSwbdpWXMSb&vxp=mtr"
        page = urllib2.urlopen(url)
        soup = BeautifulSoup(page.read())

        title=soup.title.string.partition('|')[0].strip()
        return jsonify({'title':title})
