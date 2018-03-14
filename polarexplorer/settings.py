# flake8: noqa
from polarexplorer.settings_shared import *

try:
    from polarexplorer.local_settings import *
except ImportError:
    pass
