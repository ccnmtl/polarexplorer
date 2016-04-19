# Django settings for polarexplorer project.
import os.path
from ccnmtlsettings.shared import common

project = 'polarexplorer'
base = os.path.dirname(__file__)
locals().update(common(project=project, base=base))

PROJECT_APPS = [
    'polarexplorer.main',
]

USE_TZ = True

INSTALLED_APPS += [  # noqa
    'sorl.thumbnail',
    'typogrify',
    'bootstrapform',
    'django_extensions',
    'polarexplorer.main',
]

LETTUCE_APPS = (
    'polarexplorer.main',
)

THUMBNAIL_SUBDIR = "thumbs"

LOGIN_REDIRECT_URL = "/"
