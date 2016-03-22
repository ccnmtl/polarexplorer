from django.shortcuts import render
import os
from operator import itemgetter


def index(request):
    return render(request, 'main/index.html', dict())


def isostatic_rebound(request):
    return render(request, 'main/isostatic_rebound.html', dict())


def glacier(request):
    return render(request, 'main/glacier.html', dict())


def water(request):
    return render(request, 'main/water.html', dict())


def gallery(request, title):
    path = os.path.dirname(os.path.abspath(__file__))
    directory = os.path.join(path, '../../media/img/%s' % title)

    photos = []
    try:
        for image in os.listdir(directory):
            base, extension = os.path.splitext(image)
            if extension in [".png", ".jpg"]:
                photo = {
                    "year": int(base),
                    "extension": extension
                }
                photos.append(photo)
    except:
        pass

    return render(request, 'main/gallery.html', {
        "section": title,
        "photos": sorted(photos, key=itemgetter('year'))
    })
