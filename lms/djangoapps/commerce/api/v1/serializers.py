""" API v1 serializers. """
from opaque_keys.edx.keys import CourseKey
from rest_framework import serializers

from commerce.api.v1.models import Course
from course_modes.models import CourseMode
from verify_student.models import VerificationDeadline


class CourseModeSerializer(serializers.ModelSerializer):
    """ CourseMode serializer. """
    name = serializers.CharField(source='mode_slug')
    price = serializers.IntegerField(source='min_price')
    expires = serializers.DateTimeField(source='expiration_datetime', required=False, blank=True)
    verification_deadline = serializers.SerializerMethodField(method_name='get_verification_deadline')

    def get_identity(self, data):
        try:
            return data.get('name', None)
        except AttributeError:
            return None

    def get_verification_deadline(self, obj):
        if obj.mode_slug in CourseMode.VERIFIED_MODES:
            return VerificationDeadline.deadline_for_course(obj.course_id)

        return None

    class Meta(object):  # pylint: disable=missing-docstring
        model = CourseMode
        fields = ('name', 'currency', 'price', 'sku', 'expires', 'verification_deadline')


class CourseSerializer(serializers.Serializer):
    """ Course serializer. """
    # Note (CCB): This is a temporary placeholder. It is simpler to hold this data on the serializer than
    # find a way to update the model(s) to do it for us.
    verification_deadline = None

    id = serializers.CharField()  # pylint: disable=invalid-name
    # name = serializers.CharField(read_only=True)
    modes = CourseModeSerializer(many=True, allow_add_remove=True)

    def __init__(self, *args, **kwargs):
        if kwargs.get('data', None):
            for mode in kwargs['data'].get('modes', []):
                if mode['name'] in CourseMode.VERIFIED_MODES:
                    self.verification_deadline = mode.get('verification_deadline', self.verification_deadline)

            self.verification_deadline = serializers.DateTimeField().from_native(self.verification_deadline)

        super(CourseSerializer, self).__init__(*args, **kwargs)

    def restore_object(self, attrs, instance=None):
        if instance is None:
            return Course(attrs['id'], attrs['modes'])

        instance.update(attrs)
        return instance

    def save(self, **kwargs):
        course = super(CourseSerializer, self).save(**kwargs)
        VerificationDeadline.set_deadline(CourseKey.from_string(unicode(course.id)), self.verification_deadline)
        return course
