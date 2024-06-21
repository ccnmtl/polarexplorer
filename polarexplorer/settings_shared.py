# flake8: noqa
# Django settings for polarexplorer project.
import os.path
from ctlsettings.shared import common

project = 'polarexplorer'
base = os.path.dirname(__file__)
locals().update(common(project=project, base=base))

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

MIDDLEWARE.remove('django_cas_ng.middleware.CASMiddleware')
MIDDLEWARE += [
    'django.middleware.csrf.CsrfViewMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware'
]

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
    'gunicorn',
    'impersonate',
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

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
