from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class ConsultationSchedule(models.Model):
	"""docstring for ConsultationSchedule"""
	student = models.ForeignKey(User, related_name="student")
	instructor = models.ForeignKey(User, blank=False, null=False, related_name="instructor")
	course = models.CharField(max_length=256)
	start_date = models.DateTimeField(default=datetime.now)
	end_date = models.DateTimeField(default=datetime.now)
	session_id = models.CharField(max_length=128)

	def is_available(self):
		if self.student:
			return False
		else:
			return True

