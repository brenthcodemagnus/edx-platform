from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from validators import validate_course_id

# Create your models here.
class ConsultationSchedule(models.Model):
	"""docstring for ConsultationSchedule"""
	student = models.ForeignKey(User, blank=True, null=True, related_name="student")
	instructor = models.ForeignKey(User, blank=False, null=False, related_name="instructor")
	course = models.CharField(max_length=256, blank=False, null=False, validators=[validate_course_id])
	start_date = models.DateTimeField(blank=False, null=False,)
	end_date = models.DateTimeField(blank=False, null=False,)
	session_id = models.CharField(max_length=128, blank=True, null=True,)

	def is_available(self):
		if self.student:
			return False
		else:
			return True

