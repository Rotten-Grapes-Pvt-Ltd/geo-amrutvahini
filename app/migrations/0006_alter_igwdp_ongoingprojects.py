# Generated by Django 3.2.9 on 2022-02-23 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_auto_20220223_2253'),
    ]

    operations = [
        migrations.AlterField(
            model_name='igwdp',
            name='ongoingprojects',
            field=models.IntegerField(blank=True, verbose_name='OnGoing Projects'),
        ),
    ]
