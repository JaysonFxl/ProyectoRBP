# Generated by Django 4.2.6 on 2023-12-22 01:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('futbolito', '0006_rename_horarios_disponibles_cancha_horarios_detalles'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cancha',
            old_name='horarios_detalles',
            new_name='horarios_disponibles',
        ),
    ]