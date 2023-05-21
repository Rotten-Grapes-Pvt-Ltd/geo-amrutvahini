from rest_framework import serializers
from .models import IGWDP


class IGWDP_serializer(serializers.ModelSerializer):
    class Meta:
        model = IGWDP
        fields = '__all__'
