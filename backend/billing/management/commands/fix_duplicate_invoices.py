from django.core.management.base import BaseCommand
from django.utils import timezone
from billing.models import Invoice
from django.db.models import Q


class Command(BaseCommand):
    help = 'Fix duplicate invoices - cancel invoices that are superseded by larger payments'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting invoice cleanup...'))
        
        # Get all paid invoices
        paid_invoices = Invoice.objects.filter(status='paid').order_by('rental', 'invoice_start_date')
        
        rentals_processed = set()
        cancelled_count = 0
        
        for invoice in paid_invoices:
            if not invoice.rental_id or invoice.rental_id in rentals_processed:
                continue
                
            # Get all invoices for this rental
            rental_invoices = Invoice.objects.filter(
                rental=invoice.rental
            ).exclude(status='cancelled').order_by('invoice_start_date')
            
            if rental_invoices.count() <= 1:
                continue
            
            self.stdout.write(f'\n🔍 Checking rental {invoice.rental_id} with {rental_invoices.count()} invoices')
            
            # Find overlapping invoices
            for inv1 in rental_invoices:
                if inv1.status == 'cancelled' or not inv1.invoice_start_date or not inv1.invoice_end_date:
                    continue
                    
                for inv2 in rental_invoices:
                    if (inv2.id == inv1.id or 
                        inv2.status == 'cancelled' or 
                        not inv2.invoice_start_date or 
                        not inv2.invoice_end_date):
                        continue
                    
                    # Check if inv2 is completely covered by inv1
                    if (inv2.invoice_start_date >= inv1.invoice_start_date and
                        inv2.invoice_end_date <= inv1.invoice_end_date and
                        inv1.amount >= inv2.amount):
                        
                        self.stdout.write(
                            f'  ✗ Invoice {inv2.invoice_number} (Rp {int(inv2.amount):,}) '
                            f'is covered by {inv1.invoice_number} (Rp {int(inv1.amount):,})'
                        )
                        self.stdout.write(
                            f'    Period {inv2.invoice_start_date} to {inv2.invoice_end_date} '
                            f'within {inv1.invoice_start_date} to {inv1.invoice_end_date}'
                        )
                        
                        # Cancel the smaller/redundant invoice
                        inv2.status = 'cancelled'
                        inv2.notes = f"{inv2.notes or ''}\n[Fixed {timezone.now().date()}] Duplikat - sudah tercakup dalam pembayaran {inv1.invoice_number} senilai Rp {int(inv1.amount):,}".strip().replace(',', '.')
                        inv2.save()
                        cancelled_count += 1
                        self.stdout.write(self.style.SUCCESS(f'  ✓ Cancelled invoice {inv2.invoice_number}'))
            
            rentals_processed.add(invoice.rental_id)
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Done! Cancelled {cancelled_count} duplicate invoices'))
