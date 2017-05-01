from app import app
from flask import Flask
#from flaskext.mail import Message
import smtplib
from config import MAIL_USERNAME,MAIL_PASSWORD
#from views import contact

#app.secret_key = 'asercretkeyisakeyofunknownsercretthatisasecret'



def sendMail(recp,subject,username,message1):
    fromaddr = MAIL_USERNAME#

    toaddr  = recp#

    message = """From: {} <{}>

    To: {} <{}>

    Subject: {}

    You recieved a Wish list from {}

    {}"""
    fromname='WishList.edu'
    toname=''
    subject= subject
    msg=message1

    messagetosend = message.format(

                                 fromname,

                                 fromaddr,

                                 toname,

                                 toaddr,

                                 subject,

                                 username,

                                 msg)

    # Credentials (if needed)

    username = MAIL_USERNAME#'info3180lab3@gmail.com'

    password = MAIL_PASSWORD#'143625lab3'

    # The actual mail send

    server = smtplib.SMTP('smtp.gmail.com:587')

    server.starttls()

    server.login(username,password)

    server.sendmail(fromaddr, toaddr, messagetosend)

    server.quit()
    
#sendMail('rossmorris18@gmail.com','Wish LisT','rossmorris18@gmail.com','Description Title Image url')
