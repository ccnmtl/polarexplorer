import django.views.static

from django.conf.urls import include, url
from django.conf import settings
from django.views.generic import TemplateView
from polarexplorer.main.views import (
    index, glacier, water, isostatic_rebound, gallery,
)

urlpatterns = [
    url(r'^$', index),
    url(r'^glacier/$', glacier),
    url(r'^water/$', water),
    url(r'^isostatic_rebound/$', isostatic_rebound),
    url(r'^gallery/(?P<title>\w[^/]*)/$', gallery),
    url(r'^stats/', TemplateView.as_view(template_name="stats.html")),
    url(r'smoketest/', include('smoketest.urls')),
    url(r'^uploads/(?P<path>.*)$', django.views.static.serve,
        {'document_root': settings.MEDIA_ROOT}),
]
