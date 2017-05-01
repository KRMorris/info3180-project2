from app import app
import os
from flask import Flask,request,jsonify, render_template ,_request_ctx_stack, send_file,redirect,g,url_for,session
import models
import requests
from models import Users, WishList
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
#from image_getter import image_dem
import flask.views
import json
import jwt
import base64
from jwt import DecodeError, ExpiredSignature
from datetime import datetime, timedelta
from functools import wraps
from werkzeug.local import LocalProxy
from flask.ext.cors import cross_origin
from sendemail import sendMail
import random
from sqlalchemy.sql import *

app.config['SECRET_KEY'] = 'secret'#'asercret key is akeyof unknownsercret that isa secret'
#app.config['TOKEN_SECRET']= 'very secret'
from app import db
import logging
# extensions
auth = HTTPBasicAuth()


# Authentication annotation
current_user = LocalProxy(lambda: _request_ctx_stack.top.current_user)

# Authentication attribute/annotation
def authenticate(error):
  resp = jsonify(error)

  resp.status_code = 401

  return resp



@app.route('/',methods=['GET'])
def home():
    return render_template('main.html')

#-------------------------------------------------------------------
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return authenticate({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'})

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return {'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}
    elif len(parts) == 1:
      return {'code': 'invalid_header', 'description': 'Token not found'}
    elif len(parts) > 2:
      return {'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}

    token = parts[1]
    if token.startswith('"') and token.endswith('"'):
      token=token[1:-1]
    try:
         payload = jwt.decode(token, 'secret',algorithm='HS256')#app.config['TOKEN_SECRET'])
         #print"yes pl{}".format(payload)
    except jwt.ExpiredSignature:
        return authenticate({'code': 'token_expired', 'description': 'token is expired'})
    except jwt.DecodeError:
        return authenticate({'code': 'token_invalid_signature', 'description': 'token signature is invalid'})
    
    _request_ctx_stack.top.current_user = user = payload
    return f(*args, **kwargs)

  return decorated
#--------------------------------------------------------



#@app.route('/api/user/register', methods=['POST'])
class AddUser(flask.views.MethodView):
    def post(self):
    

        args = json.loads(request.data)
        
        username = args['username']
        inemail=args['email']
        password=args['password']
        qry = Users.query.filter_by(email=inemail).first()
        if qry is None:
            while True:
                    uid = random.randint(620000000,729999999)
                    if not db.session.query(exists().where(Users.uid == uid)).scalar():
                            break
      
        user=models.Users(uid=uid,uname=username,email=inemail)#,password_hash=password
        user.hash_password(password)
        db.session.add(user)
        db.session.commit()
        
        

        return (jsonify({'success':True}))
    
@auth.verify_password
def verify_password(username, password):
    user = Users.query.filter_by(email = username).first()
    if not user or not user.verify_password(password):
        return False
    g.user = user
    return True
def create_token(user):
    payload = {
        'sub': user.id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(days=14)
    }
    token = jwt.encode(payload, 'secret',algorithm='HS256')#app.config['TOKEN_SECRET'])
    return token.decode('unicode_escape')

def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return jsonify({'expt':400})    # valid token, but expired
        except BadSignature:
            return jsonify({'badt':401})    # None    # invalid token
        idn=data['id']
        print 'ID:{}'.format(data)
        user = Users.query.filter_by(id=idn).first()
        print user.uname
        return user.uname


@app.route('/api/user/login',methods=['POST'])
def login():
    args = request.json#json.loads(request.data)#Sargs=
    #print args
    ''''emailL=request.json.get('emailL')
    passwdL=request.json.get('passwordL')'''
    email = args.get("email")
    #email=email1['email']
    #print 'Email{}'.format(email)
    #password=email1['password']
    password=args.get("password")
    
    #print password,email
    user= Users.query.filter_by(email=email).first()
    #email=args['email']
    if not user:
        return jsonify({'success':False,'error':"User does not exist"}),404
    if not user.verify_password(password):
        return jsonify({'success':False,'error':"Incorrect password"}),404
    if user and verify_password(email,password):
        '''user = User(email)
        user.verify_password(passwdL)
        session['logged_in'] = True
        status = True'''
        # print user.token()
        token=user.token()#generate_auth_token()#create_token(user)
        #print jwt.verify(token,app.config['TOKEN_SECRET']),'id':user.id,'email':user.email
       
        return jsonify({'success':True,'token':token}),200#(token=user.token()),200
    else:
        jsonify(error="Wrong email or password"), 404
        
        '''status = False#implement token later
    return jsonify({'result':status,'userID':user.id,'username': user.uname})#,201,'''
    
            

@app.route('/api/user/logout')
def logout():
    session.pop('logged_in', None)
    return jsonify({'result': 'success'})


@app.route('/api/user/home',methods=['GET'])
def h1():
    return send_file("static/home1.html")


def verify_token(token):
    if token in tokens:
        g.current_user = tokens[token]
        return True
    return False

def parse_token():
  
    req = request.headers.get('Authorization').split()[1]
    if req.startswith('"') and req.endswith('"'):
      token=req[1:-1]
      #print "TK{}".format(token)
      #token = req.headers.get('Authorization').split()[1]
      return jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
  



@app.route('/api/status')
def status():
    if session.get('logged_in'):
        if session['logged_in']:
            return jsonify({'status': True})
    else:
        return jsonify({'status': False})


'''@app.route('/api/username')
def username():
    return jsonify({'username':user.uname})'''





@app.route('/user/<int:id>')
def getUser(id):#nn
    user = Users.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.uname})


@app.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})
    
    '''args = json.loads(request.data)
    TodoModel.add_item(args['name','email','password'])
    return jsonify({ 'success': True })'''

@app.route('/api/user/<token>/wishlist', methods=['POST'])
@requires_auth
def saveWL(token):
    payload=parse_token()
    id=payload['sub']
    
    args = json.loads(request.data)
    #print args
    descrp=args["description"]
    thumbUrl=args["thumbUrl"]
    title=args["title"]
    #uid=args['id']
    uid=id
    url=args['url']
    #print 'ID:{} title:{} desc:{} url:{} thumb{}'.format(id,title, descrp,url,thumbUrl)
    priority=3

    user= Users.query.filter_by(uid=uid).first()#user = User.query.get(id)
    if not user:
        abort(400)
    if descrp != None and thumbUrl != None and title != None:
        wishL=models.WishList(title=title,description=descrp,url=url,thumbnail=thumbUrl,uid=uid,priority=priority)
        db.session.add(wishL)
        db.session.commit()
        return jsonify({'success':True})
    return jsonify({'success':False})

@app.route('/api/user/<token>/wishlist', methods=['GET'])
@requires_auth
def retrieveWishL(token):
    #token = request.headers.get('Authorization').split()[1]
    '''if token.startswith('"') and token.endswith('"'):
     token=token[1:-1]
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')'''#parse_token(token)#User.verify_auth_token(token)#jwt.decode(token, 'secret',algorithm='HS256')#app.config['TOKEN_SECRET'])
    payload=parse_token()
    id=payload['sub']
    
    wish=[]
    user= Users.query.filter_by(uid=id).first()
    if not user:
        return jsonify({'success':False})
    wl= models.WishList.query.filter_by(uid=id).all()
    for i in wl:
        wList=({'title':i.title,'descrp':i.description,'url':i.url,'thumb':i.thumbnail})
        wish.append(wList)
    return jsonify({'success':True,'wishes':wish,'username':user.uname,'email':user.email})


@app.route('/api/user/share/email',methods=['POST'])
@requires_auth
def sendEmail():
  args = json.loads(request.data)
  recp=args['recp']
  subject=args['subject']
  uname=args['username']
  message=args['message']
  s=sendMail(recp,subject,uname,message)
  
  return jsonify({'success':True})

@app.route('/api/user/<token>/remove', methods=['POST'])
@cross_origin(headers=['Content-Type', 'Authorization'])
@requires_auth
def removeItem(token):
    payload=parse_token()
    id=payload['sub']

    args= json.loads(request.data)
    delete= args["urldel"]
    user= Users.query.filter_by(uid=id).first()#user = User.query.get(id)
    if not user:
        abort(400)   
    wishlist = db.session.query(WishList).filter_by(thumbnail=delete).first()
    if wishlist is None:
        return jsonify({"error":"1","message":"No such wish exists"})
    else:
        db.session.delete(wishlist)
        db.session.commit()
        return jsonify({"error":"null","message":"Success"})


@app.route('/api/user/<token>/sharedwishlist', methods=['GET'])
#@requires_auth
def getShareWishL(token):
    #token = request.headers.get('Authorization').split()[1]
    '''if token.startswith('"') and token.endswith('"'):
     token=token[1:-1]
    payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')'''#parse_token(token)#User.verify_auth_token(token)#jwt.decode(token, 'secret',algorithm='HS256')#app.config['TOKEN_SECRET'])
    payload=parse_stoken(token)
    id=payload['sub']
    
    wish=[]
    user= Users.query.filter_by(uid=id).first()
    if not user:
        return jsonify({'success':False})
    wl= models.WishList.query.filter_by(uid=id).all()
    for i in wl:
        wList=({'title':i.title,'descrp':i.description,'url':i.url,'thumb':i.thumbnail})
        wish.append(wList)
    return jsonify({'success':True,'wishes':wish,'username':user.uname,'email':user.email})

def parse_stoken(token):  
    return jwt.decode(token, app.config['SECRET_KEY'], algorithms='HS256')
    

