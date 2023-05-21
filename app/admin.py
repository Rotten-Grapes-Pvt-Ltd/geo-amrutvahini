from django.contrib import admin
from .models import IGWDP

# Register your models here.


class IGWDPadmin(admin.ModelAdmin):
    list_display = ("state", "districtscovered",
                    "watershedscount", "geographicalarea", "treatablearea", "householdscovered", "pfacount", "ongoingprojects", "completedprojects", "sanctionedamount", "disbursedamount", "utilizedamount")


admin.site.register(IGWDP, IGWDPadmin)
