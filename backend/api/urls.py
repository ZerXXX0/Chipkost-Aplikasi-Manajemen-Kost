from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rooms.views import KosViewSet, RoomViewSet, RentalViewSet
from billing.views import InvoiceViewSet, PembayaranViewSet, LaporanKeuanganViewSet
from complaints.views import KerusakanViewSet
from notifications.views import NotifViewSet
from rfid.views import RFIDCardViewSet, AccessLogViewSet

router = DefaultRouter()
router.register(r'kos', KosViewSet)
router.register(r'kamar', RoomViewSet)
router.register(r'rental', RentalViewSet)
router.register(r'invoice', InvoiceViewSet)
router.register(r'pembayaran', PembayaranViewSet)
router.register(r'laporan-keuangan', LaporanKeuanganViewSet)
router.register(r'kerusakan', KerusakanViewSet)
router.register(r'notifikasi', NotifViewSet)
router.register(r'rfid', RFIDCardViewSet)
router.register(r'access-logs', AccessLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('accounts.urls')),
]
