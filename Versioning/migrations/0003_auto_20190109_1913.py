# Generated by Django 2.1.3 on 2019-01-09 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Versioning', '0002_auto_20190104_1548'),
    ]

    operations = [
        migrations.AddField(
            model_name='aplikasi',
            name='uuid_ext',
            field=models.CharField(default='_', max_length=90),
        ),
        migrations.AddField(
            model_name='basis_data',
            name='uuid_ext',
            field=models.CharField(default='_', max_length=90),
        ),
    ]