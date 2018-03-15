# flake8: noqa
from polarexplorer.settings_shared import *
from ccnmtlsettings.production import common

locals().update(
    common(
        project=project,
        base=base,
        STATIC_ROOT=STATIC_ROOT,
        INSTALLED_APPS=INSTALLED_APPS,
    ))

try:
    from polarexplorer.local_settings import *
except ImportError:
    pass
