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

from .serializers import (
    UserSerializer,
    UserProfileSerializer
)

from django.core import serializers
import json

from student.models import UserProfile

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

class InstructorListView(APIView):
    """
        **Use Cases**

            Retrieve a list of instructors associated with a single course.

        **Example Requests**

            GET /api/consultation/v0/instructors/{course_id}/

        **Response Values for GET**

            If the user is not logged in, a 401 error is returned.

            If the course_id is not given or an unsupported value is passed for
            order_by, returns a 400 error.

            If the user is not logged in, is not enrolled in the course, or is
            not course or global staff, returns a 403 error.

            If the course does not exist, returns a 404 error.

            Otherwise, a 200 response is returned containing the following
            fields:

            * results: A list of the instructors matching the request.

                * id: The instructor's unique identifier.

                * username: The username of the instructor.
    """

    def get(self, request, course_id):
        """GET /api/consultation/v0/instructors/{course_id}/"""
        course_id_string = self.kwargs['course_id']
        
        # Ensure valid course_id
        if course_id_string is None:
            return Response({
                'field_errors': {
                    'course_id': build_api_error(
                        ugettext_noop("The supplied course id {course_id} is not valid."),
                        course_id=course_id_string
                    )
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            course_id = CourseKey.from_string(course_id_string)
        except InvalidKeyError:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Ensure the course exists
        course_module = modulestore().get_course(course_id)
        if course_module is None:  # course is None if not found
            return Response(status=status.HTTP_404_NOT_FOUND)

        # if not has_team_api_access(request.user, course_id):
        #     return Response(status=status.HTTP_403_FORBIDDEN)

        # Get all instructors of course
        # instructors = CourseAccessRole.objects.filter(role="staff", course_id=course_id).prefetch_related('user')
        #instructors = User.objects.filter(courseaccessrole__role='staff', courseaccessrole__course_id=course_id).select_related("user__userprofile").values("username", "email", "first_name", "last_name", "userprofile__name")
        instructors = User.objects.filter(courseaccessrole__role='staff', courseaccessrole__course_id=course_id).select_related("userprofile").all();

        serializer = UserSerializer(instructors, many=True)

        print serializer.fields
        
        #serialized_data = serializers.serialize("json", instructors)

        #serialized_json = json.loads(serialized_data)
        
        return Response(serializer.data)

