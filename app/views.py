from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections
from .serializers import IGWDP_serializer
from .models import IGWDP
import json , requests

# Create your views here.


def index(request):
    # requests to get json

    res = requests.get('https://geonode.communitygis.in/api/v2/resources?filter{keywords.name}=amrutvahini&format=json')
    resp = res.json()
    context = {
        'layers' : resp['resources']
    }
    return render(request, 'map.html', context=context)


def getNearestLocations(request):
    sql = request.GET.get('sql', None)
    cursor = connections["geoserver"].cursor()
    cursor.execute(sql)
    rows = cursor.fetchall()
    return JsonResponse(rows, safe=False)
