"""Defines the URL routes for the Online consultation API."""

from django.conf import settings
from django.conf.urls import patterns, url

from .views import (
    InstructorListView
)

urlpatterns = patterns(
    '',
    url(
        r'^v0/instructors/{}$'.format(settings.COURSE_ID_PATTERN),
        InstructorListView.as_view(),
        name="instructors_list"
    ),
)
