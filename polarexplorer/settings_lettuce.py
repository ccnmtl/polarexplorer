# flake8: noqa
from settings_shared import *

LETTUCE_DJANGO_APP = ['lettuce.django']
INSTALLED_APPS = INSTALLED_APPS + LETTUCE_DJANGO_APP

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'lettuce.db',
        'HOST': '',
        'PORT': '',
        'USER': '',
        'PASSWORD': '',
        }
    }
