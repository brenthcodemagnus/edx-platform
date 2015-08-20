from django.core.exceptions import ValidationError
from opaque_keys import InvalidKeyError
from opaque_keys.edx.keys import CourseKey
from xmodule.modulestore.django import modulestore

# Checks only for key validity
# not for existence of course in database
def validate_course_id(course_id):
    # Ensure valid course_id
    if course_id_string is None:
        raise ValidationError('%s should not be None' % course_id)

    try:
        course_id = CourseKey.from_string(course_id)
    except InvalidKeyError:
        raise ValidationError('%s is an invalid course key' % course_id)

    # Ensure the course exists
    # course_module = modulestore().get_course(course_id)
    # if course_module is None:  # course is None if not found
    #     raise ValidationError('there is no such course with id: %s' % course_id)