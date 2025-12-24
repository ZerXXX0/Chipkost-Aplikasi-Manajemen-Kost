from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='kos',
            name='cctv_url',
            field=models.URLField(blank=True, max_length=500, null=True, verbose_name='URL CCTV (MP4)'),
        ),
    ]
