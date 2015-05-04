from django.conf.urls import patterns, include
from django.conf import settings
from django.views.generic import TemplateView

urlpatterns = patterns(
    '',
    (r'^$', 'polarexplorer.main.views.index'),
    (r'^glacier/$', 'polarexplorer.main.views.glacier'),
    (r'^water/$', 'polarexplorer.main.views.water'),
    (r'^isostatic_rebound/$', 'polarexplorer.main.views.isostatic_rebound'),
    (r'^gallery/(?P<title>\w[^/]*)/$', 'polarexplorer.main.views.gallery'),
    (r'^stats/', TemplateView.as_view(template_name="stats.html")),
    (r'smoketest/', include('smoketest.urls')),
    (r'^uploads/(?P<path>.*)$',
     'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
)
