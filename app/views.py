from django.shortcuts import render
from django.http import JsonResponse
from django.db import connections
from .serializers import IGWDP_serializer
from .models import IGWDP
import json

# Create your views here.


def index(request):
    rows = IGWDP.objects.all()
    serializer = IGWDP_serializer(rows, many=True)
    igwdp = json.loads(json.dumps(serializer.data))
    districtscovered = 0
    total_igwdp = {
        "districtscovered": 0,
        "watershedscount": 0,
        "geographicalarea": 0,
        "treatablearea": 0,
        "householdscovered": 0,
        "pfacount": 0,
        "ongoingprojects": 0,
        "completedprojects": 0,
        "sanctionedamount": 0,
        "disbursedamount": 0,
        "utilizedamount": 0,
    }
    for row in rows:
        total_igwdp["districtscovered"] = total_igwdp["districtscovered"] + \
            row.districtscovered
        total_igwdp["watershedscount"] = total_igwdp["watershedscount"] + \
            row.watershedscount
        total_igwdp["geographicalarea"] = total_igwdp["geographicalarea"] + \
            row.geographicalarea
        total_igwdp["treatablearea"] = total_igwdp["treatablearea"] + \
            row.treatablearea
        total_igwdp["householdscovered"] = total_igwdp["householdscovered"] + \
            row.householdscovered
        total_igwdp["pfacount"] = total_igwdp["pfacount"] + \
            row.pfacount
        total_igwdp["ongoingprojects"] = total_igwdp["ongoingprojects"] + \
            row.ongoingprojects
        total_igwdp["completedprojects"] = total_igwdp["completedprojects"] + \
            row.completedprojects
        total_igwdp["sanctionedamount"] = total_igwdp["sanctionedamount"] + \
            row.sanctionedamount
        total_igwdp["disbursedamount"] = total_igwdp["disbursedamount"] + \
            row.disbursedamount
        total_igwdp["utilizedamount"] = total_igwdp["utilizedamount"] + \
            row.utilizedamount
    context = {
        'IGWDP': igwdp,
        'total_igwdp': total_igwdp
    }
    return render(request, 'map.html', context=context)


def getNearestLocations(request):
    sql = request.GET.get('sql', None)
    cursor = connections["geoserver"].cursor()
    cursor.execute(sql)
    rows = cursor.fetchall()
    return JsonResponse(rows, safe=False)
