from rest_framework import serializers
from django.contrib.auth.models import User
from student.models import UserProfile
from .models import ConsultationSchedule

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ("name", "bio", "country", "goals")

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    class Meta:
        model = User
        fields = ("username", "email", "first_name", "last_name", "profile")

class ConsultationScheduleSerializer(serializers.ModelSerializer):
	class Meta:
		model = ConsultationSchedule