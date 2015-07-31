"""
Provides partition support to the user service.
"""

import logging

from course_modes.models import CourseMode
from student.models import CourseEnrollment
from verify_student.models import SkippedReverification, VerificationStatus


log = logging.getLogger(__name__)


class VerificationPartitionScheme(object):
    """
    This scheme randomly assigns users into the partition's groups.
    """
    NON_VERIFIED = 'non_verified'
    VERIFIED_ALLOW = 'verified_allow'
    VERIFIED_DENY = 'verified_deny'

    @classmethod
    def get_group_for_user(cls, course_key, user, user_partition):
        """
        Return the user's group depending their enrollment and verification
        status.

        Arguments:
            user(User): user object
            course_id(CourseKey): CourseKey

        Returns:
            Boolean
        """
        checkpoint = user_partition.parameters["location"]

        if (
            not cls._is_enrolled_in_verified_mode(user, course_key) or cls._was_denied_at_any_checkpoint(user, course_key)
        ):
            return cls.NON_VERIFIED
        elif (
            cls._has_skipped_any_checkpoint(user, course_key) or cls._has_completed_checkpoint(user, course_key, checkpoint)
        ):
            return cls.VERIFIED_ALLOW
        else:
            return cls.VERIFIED_DENY

    @classmethod
    def key_for_partition(cls, xblock_location_id):
        """
        Returns the key to use to look up and save the user's group for a given user partition.
        """
        return 'verification:{0}'.format(xblock_location_id)

    @classmethod
    def _is_enrolled_in_verified_mode(cls, user, course_key):
        """
        Returns the Boolean value if given user for the given course is enrolled in
        verified modes.
        Arguments:
            user(User): user object
            course_id(CourseKey): CourseKey

        Returns:
            Boolean
        """
        enrollment_mode, __ = CourseEnrollment.enrollment_mode_for_user(user, course_key)
        return enrollment_mode in CourseMode.VERIFIED_MODES

    @classmethod
    def _was_denied_at_any_checkpoint(cls, user, course_key):
        """Returns the Boolean value if given user with given course was denied for any
        incourse verification checkpoint.
        Arguments:
            user(User): user object
            course_id(CourseKey): CourseKey

        Returns:
            Boolean
        """
        return VerificationStatus.objects.filter(
            user=user,
            checkpoint__course_id=course_key,
            status='denied'
        ).exists()

    @classmethod
    def _has_skipped_any_checkpoint(cls, user, course_key):
        """Check existence of a user's skipped re-verification attempt for a
        specific course.

        Arguments:
            user(User): user object
            course_id(CourseKey): CourseKey

        Returns:
            Boolean
        """
        return SkippedReverification.check_user_skipped_reverification_exists(user, course_key)

    @classmethod
    def _has_completed_checkpoint(cls, user, course_key, checkpoint):
        """Get the user's status ( approved or submitted) at the checkpoint.
        Arguments:
            user (User): The user whose status we are retrieving.
            course_key (CourseKey): The identifier for the course.
            checkpoint (UsageKey): The location of the checkpoint in the course.

        Returns:
            unicode or None
        """
        return VerificationStatus.check_user_has_completed_checkpoint(user, course_key, checkpoint)
