import requests
import BeautifulSoup
import urlparse
from flask import Flask,jsonify
#url='http://www.amazon.com/gp/product/1783551623'
'''app = Flask(__name__)
with app.app_context():'''
def image_dem(url):
    imglst=[]
    #url = "http://www.amazon.com/gp/product/1783551623"
    result = requests.get(url)
    soup = BeautifulSoup.BeautifulSoup(result.text)
    og_image = (soup.find('meta', property='og:image') or
                        soup.find('meta', attrs={'name': 'og:image'}))
    if og_image and og_image['content']:
        print og_image['content']
    thumbnail_spec = soup.find('link', rel='image_src')
    if thumbnail_spec and thumbnail_spec['href']:
        print thumbnail_spec['href']  
    #def image_dem2():   
    for img in soup.findAll("img", src=True):
       image = """<img src="%s">"""#.format(img)
       if "sprite" not in img["src"]:
           imglst.append(image % urlparse.urljoin(url, img["src"]))
           #print image % urlparse.urljoin(url, img["src"])
       #a=jsonify({ 'imagelist' :imglst})
    #return a
    return jsonify({ 'success': True }) #imglst#jsonify({'imglist':[{'imglst':img} for img in imglst]})
    #return image_dem2()


#image_dem('http://www.amazon.com/gp/product/1783551623')

