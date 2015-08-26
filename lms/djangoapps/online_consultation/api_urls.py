"""Defines the URL routes for the Online consultation API."""

from django.conf import settings
from django.conf.urls import patterns, url
#from django.views.decorators.csrf import csrf_exempt

from .views import (
    InstructorListView,
    ScheduleView,
    ScheduleListView,
)

USERNAME_PATTERN = r'(?P<username>[\w.+-]+)'

urlpatterns = patterns(
    '',
    url(
        r'^v0/instructors/{}$'.format(settings.COURSE_ID_PATTERN),
        InstructorListView.as_view(),
        name="instructors_list"
    ),
    url(
        r'^v0/schedules/$',
        ScheduleView.as_view(),
        name="schedules_list"
    ),
    url(
        r'^v0/{}/schedules/{}$'.format(settings.COURSE_ID_PATTERN, USERNAME_PATTERN),
        ScheduleListView.as_view(),
        name="schedules"
    ),
)
