from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0002_kos_cctv_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='CctvCamera',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Nama Kamera')),
                ('stream_url', models.URLField(max_length=500, verbose_name='URL Stream (MP4)')),
                ('order', models.PositiveIntegerField(default=1, verbose_name='Urutan Tampil')),
                ('is_active', models.BooleanField(default=True, verbose_name='Aktif')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Dibuat pada')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Diperbarui pada')),
                ('kos', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cctv_cameras', to='rooms.kos', verbose_name='Kos')),
            ],
            options={
                'verbose_name': 'CCTV Kamera',
                'verbose_name_plural': 'CCTV Kamera',
                'db_table': 'cctv_cameras',
                'ordering': ['order', 'id'],
                'unique_together': {('kos', 'order')},
            },
        ),
    ]
