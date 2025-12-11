# Generated manually for RFID AccessLog updates

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rfid', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accesslog',
            name='rfid_card',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.CASCADE, related_name='access_logs', to='rfid.rfidcard'),
        ),
        migrations.AddField(
            model_name='accesslog',
            name='denied_reason',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='accesslog',
            name='attempted_card_id',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
