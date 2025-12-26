#!/usr/bin/env python
"""
Cleanup script to fix duplicate invoices in the database.
This handles invoices created by the bug in create_snap_transaction().
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chipkost.settings')
django.setup()

from billing.models import Invoice
from django.db.models import Count, Q
from datetime import datetime

print("=" * 70)
print("DUPLICATE INVOICE CLEANUP SCRIPT")
print("=" * 70)

# Find invoices with duplicate invoice_numbers
duplicate_invoices = Invoice.objects.values('invoice_number').annotate(
    count=Count('id')
).filter(count__gt=1)

deleted_count = 0

if not duplicate_invoices:
    print("\n✅ No duplicate invoices found!")
else:
    print(f"\n⚠️  Found {duplicate_invoices.count()} invoice numbers with duplicates\n")
    
    for dup in duplicate_invoices:
        invoice_number = dup['invoice_number']
        count = dup['count']
        
        # Get all invoices with this number, sorted by creation date
        invoices = Invoice.objects.filter(invoice_number=invoice_number).order_by('created_at')
        
        print(f"Invoice #{invoice_number}: {count} copies found")
        
        # Keep the first one, delete the rest
        keep_invoice = invoices.first()
        delete_invoices = invoices[1:]
        
        for inv in delete_invoices:
            print(f"  ❌ Deleting duplicate invoice ID {inv.id} (Status: {inv.status})")
            inv.delete()
            deleted_count += 1

print(f"\n" + "=" * 70)
print(f"✅ Cleanup complete! Deleted {deleted_count} duplicate invoices")
print("=" * 70)
