# Generated by Django 3.2.9 on 2022-02-23 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('app', '0003_auto_20211110_2250'),
    ]

    operations = [
        migrations.CreateModel(
            name='IGWDP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('state', models.CharField(blank=True, max_length=500, verbose_name='State')),
                ('districtscovered', models.CharField(blank=True, max_length=500, verbose_name='Districts Covered')),
                ('watershedscount', models.CharField(blank=True, max_length=500, verbose_name='No of Watersheds')),
                ('geographicalarea', models.CharField(blank=True, max_length=500, verbose_name='Geographical Area (Ha)')),
                ('treatablearea', models.CharField(blank=True, max_length=500, verbose_name='Treatable Area (Ha)')),
                ('householdscovered', models.CharField(blank=True, max_length=500, verbose_name='Households Covered')),
                ('pfacount', models.CharField(blank=True, max_length=500, verbose_name='Total PFAs')),
                ('ongoingprojects', models.CharField(blank=True, max_length=500, verbose_name='OnGoing Projects')),
                ('completedprojects', models.CharField(blank=True, max_length=500, verbose_name='Completed Projects')),
                ('sanctionedamount', models.CharField(blank=True, max_length=500, verbose_name='Amount Sanctioned (In Lakhs)')),
                ('disbursedamount', models.CharField(blank=True, max_length=500, verbose_name='Amount Disbursed (In Lakhs)')),
                ('utilizedamount', models.CharField(blank=True, max_length=500, verbose_name='Amount Utilized (In Lakhs)')),
            ],
        ),
    ]
