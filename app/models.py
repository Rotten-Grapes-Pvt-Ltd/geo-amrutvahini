from django.db import models

# Create your models here.


class IGWDP(models.Model):
    state = models.CharField(max_length=500, blank=True, verbose_name='State')
    districtscovered = models.IntegerField(
        blank=True, verbose_name='Districts Covered')
    watershedscount = models.IntegerField(
        blank=True, verbose_name='No of Watersheds')
    geographicalarea = models.DecimalField(
        decimal_places=2, max_digits=10, blank=True, verbose_name='Geographical Area (Ha)')
    treatablearea = models.DecimalField(
        decimal_places=2, max_digits=10, blank=True, verbose_name='Treatable Area (Ha)')
    householdscovered = models.IntegerField(
        blank=True, verbose_name='Households Covered')
    pfacount = models.IntegerField(blank=True, verbose_name='Total PFAs')
    ongoingprojects = models.IntegerField(
        blank=True, verbose_name='OnGoing Projects')
    completedprojects = models.IntegerField(
        blank=True, verbose_name='Completed Projects')
    sanctionedamount = models.DecimalField(
        decimal_places=2, max_digits=10, blank=True, verbose_name='Amount Sanctioned (In Lakhs)')
    disbursedamount = models.DecimalField(
        decimal_places=2, max_digits=10, blank=True, verbose_name='Amount Disbursed (In Lakhs)')
    utilizedamount = models.DecimalField(
        decimal_places=2, max_digits=10, blank=True, verbose_name='Amount Utilized (In Lakhs)')

    def __str__(self):
        return self.state

    class Meta:
        managed = True
        verbose_name = 'IGWDP'
        verbose_name_plural = 'IGWDP'
