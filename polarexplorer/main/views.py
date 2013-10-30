from annoying.decorators import render_to
import os
from operator import itemgetter


@render_to('main/index.html')
def index(request):
    return dict()


@render_to('main/glacier.html')
def glacier(request):
    return dict()


@render_to('main/water.html')
def water(request):
    return dict()


@render_to('main/gallery.html')
def gallery(request, title):
    path = os.path.dirname(os.path.abspath(__file__))
    directory = os.path.join(path, '../../media/img/%s' % title)

    photos = []
    try:
        os.chdir(directory)
        for image in os.listdir("."):
            base, extension = os.path.splitext(image)
            if extension in [".png", ".jpg"]:
                photo = {
                    "year": int(base),
                    "extension": extension
                }
                photos.append(photo)
    except:
        pass

    return dict({
        "section": title,
        "photos": sorted(photos, key=itemgetter('year'))
    })
