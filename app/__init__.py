from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(__name__)

db = SQLAlchemy(app)
from app import views,models
from views import AddUser#, imgList
from image_getter import ImageGetter
from getTitle import TitleGet

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://info3180proj1:info3180@localhost:5433/info3180"

app.add_url_rule('/api/user/register', view_func=AddUser.as_view('addUser'),
    methods=['POST'])

app.add_url_rule('/imagelist',view_func=ImageGetter.as_view('getImg'),methods=['POST'])

app.add_url_rule('/api/title', view_func=TitleGet.as_view('titleget'),methods=['POST'])

