# flake8: noqa
# Django settings for polarexplorer project.
import os.path
from ccnmtlsettings.shared import common

project = 'polarexplorer'
base = os.path.dirname(__file__)
locals().update(common(project=project, base=base))

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

MIDDLEWARE = MIDDLEWARE_CLASSES
MIDDLEWARE += ['django.middleware.csrf.CsrfViewMiddleware']

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.flatpages',
    'django.contrib.staticfiles',
    'django.contrib.messages',
    'django.contrib.admin',
    'django_statsd',
    'smoketest',
    'debug_toolbar',
    'django_jenkins',
    'gunicorn',
    'compressor',
    'impersonate',
    'waffle',
    'django_markwhat',
]

PROJECT_APPS = [
    'polarexplorer.main',
]

USE_TZ = True

INSTALLED_APPS += [  # noqa
    'typogrify',
    'bootstrapform',
    'django_extensions',
    'polarexplorer.main',
]

THUMBNAIL_SUBDIR = "thumbs"

LOGIN_REDIRECT_URL = "/"
