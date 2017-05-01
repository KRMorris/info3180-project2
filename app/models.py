#from app import app
from flask import Flask,app
import sqlite3
import os
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from app import db,app
from datetime import datetime, timedelta
import jwt
from flask import jsonify
from jwt import DecodeError, ExpiredSignature

# extensions
#db = SQLAlchemy(app)

auth = HTTPBasicAuth()
app.config['SECRET_KEY'] = 'secret'
#app.config['TOKEN_SECRET']= 'asercret key is akeyof unknownsercret that isa secret'

class Users(db.Model):
    #__tablename__ = 'users'
    uid = db.Column(db.Integer,autoincrement=True, primary_key=True)
    uname = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(124))
    wishlist = db.relationship('WishList', backref=db.backref('user'))#'uname', lazy='dynamic')
    
    def __init(self,uid,uname,email,password_hash):
        self.uid=uid
        self.uname=uname
        self.email=email
        self.password_hash=password_hash
    
    def __repr__(self):
        return '<User %r>' % (self.uname)
    
    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.uid})
    def token(self):
        payload = {
            'sub': self.uid,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(days=10)
        }
        #print payload
        token = jwt.encode(payload, 'secret')
        return token.decode('unicode_escape')
    '''def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['TOKEN_SECRET'], expires_in=expiration)
        return s.dumps({'id': self.id})'''



    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user
    

class WishList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title=db.Column(db.String(225), index=True)
    description = db.Column(db.String(225), index=True)
    url = db.Column(db.String(225), index=True)
    thumbnail = db.Column(db.String(225), index= True)
    uid = db.Column(db.Integer, db.ForeignKey('user.uid'))
    priority= db.Column(db.Integer, index=True)

    def __init__(self,title,description,url,thumbnail,uid,priority):
        self.title=title
        self.description=description
        self.url=url
        self.thumbnail=thumbnail
        self.uid=uid
        self.priority=priority


    def __repr__(self):
        return '<Post %r>' % (self.title)

#wishL=models.WishList(title=title,url=url,descr=description,uid=id)
