# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2017-02-24 14:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_link_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='link',
            name='description',
            field=models.TextField(blank=True, default=b''),
        ),
    ]
