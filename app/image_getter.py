import requests
import BeautifulSoup
import urlparse
import flask.views
import json
from flask import Flask,request,jsonify

class ImageGetter(flask.views.MethodView):
    def post(self):
        #replace url with self
        args = json.loads(request.data)
        url = args['url']
        
        imglst=[]
        jimg=[]
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
           #image = """<li><"%s"></li>"""#.format(img)
           if "sprite" not in img["src"]:
               imglst.append(urlparse.urljoin(url, img["src"]))
        for img in imglst:
            i={'img':img}
            jimg.append(i)
        return jsonify({'success':True,'imgl':jimg})
               #print image % urlparse.urljoin(url, img["src"])
           #a=jsonify({ 'imagelist' :imglst})
        #return a
        #return jsonify({ 'imgl': imglst })#imglst,jsonify({ 'success': True })





        

        ##imglst
        #image_dem()
        '''def main(url):
             imglst=[]
             result = requests.get(url)
             soup = BeautifulSoup.BeautifulSoup(result.text)
             og_image = (soup.find('meta', property='og:image') or
                                 soup.find('meta', attrs={'name': 'og:image'}))
             if og_image and og_image['content']:
                 print og_image['content']
             thumbnail_spec = soup.find('link', rel='image_src')
             if thumbnail_spec and thumbnail_spec['href']:
             print thumbnail_spec['href']
             for img in soup.findAll("img", src=True):
                image = """<li><img src="%s"></li>""".format(img)
                if "sprite" not in img["src"]:
                  imglst.append(image % urlparse.urljoin(url, img["src"]))
             return imglst'''
