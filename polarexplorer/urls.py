import django.views.static
import debug_toolbar

from django.conf.urls import include
from django.urls import re_path
from django.conf import settings
from django.views.generic import TemplateView
from polarexplorer.main.views import (
    index, glacier, water, isostatic_rebound, gallery,
)

urlpatterns = [
    re_path(r'^$', index),
    re_path(r'^glacier/$', glacier),
    re_path(r'^water/$', water),
    re_path(r'^isostatic_rebound/$', isostatic_rebound),
    re_path(r'^gallery/(?P<title>\w[^/]*)/$', gallery),
    re_path(r'^stats/', TemplateView.as_view(template_name="stats.html")),
    re_path(r'smoketest/', include('smoketest.urls')),
    re_path(r'^uploads/(?P<path>.*)$', django.views.static.serve,
            {'document_root': settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    urlpatterns += [re_path(r'^__debug__/', include(debug_toolbar.urls))]
