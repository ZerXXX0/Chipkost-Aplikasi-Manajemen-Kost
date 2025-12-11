from django.db import models
from django.contrib.auth import get_user_model
from rooms.models import Room

User = get_user_model()

class RFIDCard(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('blocked', 'Blocked'),
    )
    
    card_id = models.CharField(max_length=50, unique=True)
    penyewa = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rfid_cards', limit_choices_to={'role': 'penyewa'}, null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='rfid_cards')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    registered_at = models.DateTimeField(auto_now_add=True)
    registered_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='registered_cards', limit_choices_to={'role': 'admin'})
    last_used = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'rfid_cards'
    
    def __str__(self):
        return f"{self.card_id} - {self.penyewa.username}"

class AccessLog(models.Model):
    STATUS_CHOICES = (
        ('granted', 'Granted'),
        ('denied', 'Denied'),
    )
    
    rfid_card = models.ForeignKey(RFIDCard, on_delete=models.CASCADE, related_name='access_logs', null=True, blank=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='access_logs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    access_time = models.DateTimeField(auto_now_add=True)
    denied_reason = models.CharField(max_length=200, blank=True, null=True)
    attempted_card_id = models.CharField(max_length=50, blank=True, null=True)
    
    class Meta:
        db_table = 'access_logs'
        ordering = ['-access_time']
    
    def __str__(self):
        card_info = self.rfid_card.card_id if self.rfid_card else self.attempted_card_id or 'Unknown'
        return f"{card_info} - {self.status} at {self.access_time}"
