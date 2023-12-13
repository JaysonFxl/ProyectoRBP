# Generated by Django 4.2.6 on 2023-12-13 22:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('futbolito', '0002_cancha_imagen'),
    ]

    operations = [
        migrations.CreateModel(
            name='PrecioCancha',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('duracion', models.IntegerField()),
                ('precio', models.DecimalField(decimal_places=2, max_digits=6)),
                ('cancha', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='futbolito.cancha')),
            ],
        ),
    ]