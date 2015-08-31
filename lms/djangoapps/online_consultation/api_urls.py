"""Defines the URL routes for the Online consultation API."""

from django.conf import settings
from django.conf.urls import patterns, url
#from django.views.decorators.csrf import csrf_exempt

from .views import (
    InstructorListView,
    ScheduleView,
    ScheduleListView,
    ScheduleReserveView,
    ChatView,
)

USERNAME_PATTERN = r'(?P<username>[\w.+-]+)'
SCHEDULE_ID_PATTERN = r'(?P<schedule_id>[a-z\d_-]+)'

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
    url(
        r'^v0/schedules/{}/reserve$'.format(SCHEDULE_ID_PATTERN),
        ScheduleReserveView.as_view(),
        name="schedules_reserve"
    ),
    url(
        r'^v0/schedules/{}/start$'.format(SCHEDULE_ID_PATTERN),
        ChatView.as_view(),
        name="schedules_start"
    ),
)
