"""HTTP endpoints for the Online consultation API."""

from django.shortcuts import render_to_response
from courseware.courses import get_course_with_access, has_access
from django.http import Http404
from django.conf import settings
from django.core.paginator import Paginator
from django.views.generic.base import View
import newrelic.agent

from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView
from rest_framework.authentication import (
    SessionAuthentication,
    OAuth2Authentication
)
from rest_framework import status
from rest_framework import permissions

from django.db.models import Count
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_noop

from student.models import CourseEnrollment, CourseAccessRole
from student.roles import CourseStaffRole

from openedx.core.lib.api.parsers import MergePatchParser
from openedx.core.lib.api.permissions import IsStaffOrReadOnly
from openedx.core.lib.api.view_utils import (
    RetrievePatchAPIView,
    add_serializer_errors,
    build_api_error,
    ExpandableFieldViewMixin
)
from openedx.core.lib.api.serializers import PaginationSerializer

from xmodule.modulestore.django import modulestore

from opaque_keys import InvalidKeyError
from opaque_keys.edx.keys import CourseKey

# Create your views here.
class OnlineConsultationHomeView(View):
    """
    View methods related to the Online Consultation dashboard.
    """

    def get(self, request, course_id):
        """
        Renders the online consultation home page, which is shown on the "consultations" tab.

        Raises a 404 if the course specified by course_id does not exist, or the
        user is not registered for the course
        """
        course_key = CourseKey.from_string(course_id)
        course = get_course_with_access(request.user, "load", course_key)

        if not CourseEnrollment.is_enrolled(request.user, course.id) and \
                not has_access(request.user, 'staff', course, course.id):
            raise Http404

        context = {
            "course": course,
        }

        return render_to_response("online_consultation/online_consultation.html", context)
