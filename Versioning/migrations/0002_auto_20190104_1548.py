# Generated by Django 2.1.3 on 2019-01-04 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Versioning', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='kegiatan',
            name='deskripsi',
            field=models.CharField(default='ada', max_length=255),
        ),
        migrations.AddField(
            model_name='kegiatan',
            name='seksi',
            field=models.CharField(default='ipds', max_length=20),
        ),
    ]
