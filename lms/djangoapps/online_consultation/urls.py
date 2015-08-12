"""Defines the URL routes for this app."""

from django.conf.urls import patterns, url
from django.contrib.auth.decorators import login_required

from .views import (
	OnlineConsultationHomeView,
	InstructorListView
)

urlpatterns = patterns(
    'online_consultation.views',
    url(r"^/$", login_required(OnlineConsultationHomeView.as_view()), name="online_consultation_home")
)
