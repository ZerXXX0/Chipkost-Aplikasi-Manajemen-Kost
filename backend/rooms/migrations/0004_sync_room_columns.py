# Generated manually to sync room columns

from django.db import migrations, models
from django.conf import settings
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('rooms', '0003_cctvcamera'),
    ]

    operations = [
        # Rename nomor_kamar to room_number
        migrations.RenameField(
            model_name='room',
            old_name='nomor_kamar',
            new_name='room_number',
        ),
        # Rename harga to price
        migrations.RenameField(
            model_name='room',
            old_name='harga',
            new_name='price',
        ),
        # Add missing fields to Room
        migrations.AddField(
            model_name='room',
            name='floor',
            field=models.IntegerField(default=1, verbose_name='Lantai'),
        ),
        migrations.AddField(
            model_name='room',
            name='description',
            field=models.TextField(blank=True, null=True, verbose_name='Deskripsi'),
        ),
        migrations.AddField(
            model_name='room',
            name='capacity',
            field=models.IntegerField(default=1, verbose_name='Kapasitas'),
        ),
        migrations.AddField(
            model_name='room',
            name='facilities',
            field=models.TextField(blank=True, null=True, verbose_name='Fasilitas'),
        ),
        # Update unique_together
        migrations.AlterUniqueTogether(
            name='room',
            unique_together={('kos', 'room_number')},
        ),
        # Add notes to Rental
        migrations.AddField(
            model_name='rental',
            name='notes',
            field=models.TextField(blank=True, null=True, verbose_name='Catatan'),
        ),
        # Rename harga_bulanan column in Rental
        migrations.AlterField(
            model_name='rental',
            name='harga_bulanan',
            field=models.DecimalField(db_column='monthly_price', decimal_places=2, max_digits=10, verbose_name='Harga Bulanan'),
        ),
        # Alter owner field on Kos
        migrations.AlterField(
            model_name='kos',
            name='owner',
            field=models.ForeignKey(blank=True, limit_choices_to={'role': 'admin'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='owned_kos', to=settings.AUTH_USER_MODEL, verbose_name='Pemilik'),
        ),
        # Alter penyewa field on Rental
        migrations.AlterField(
            model_name='rental',
            name='penyewa',
            field=models.ForeignKey(blank=True, limit_choices_to={'role': 'penyewa'}, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='rentals', to=settings.AUTH_USER_MODEL, verbose_name='Penyewa'),
        ),
    ]
