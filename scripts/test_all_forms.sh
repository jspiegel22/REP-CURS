#!/bin/bash

# Run all form tests to verify webhook integrations are working correctly

echo "============================"
echo "RUNNING ALL FORM TESTS"
echo "============================"
echo ""

# 1. Test family trip form
echo "============================"
echo "1. TESTING FAMILY TRIP FORM"
echo "============================"
bash scripts/test_family_form.sh
echo ""

# 2. Test guide download form
echo "============================"
echo "2. TESTING GUIDE DOWNLOAD FORM"
echo "============================"
bash scripts/test_guide_download.sh
echo ""

# 3. Test luxury concierge form
echo "============================"
echo "3. TESTING LUXURY CONCIERGE FORM"
echo "============================"
bash scripts/test_concierge_form.sh
echo ""

# 4. Test villa booking form
echo "============================"
echo "4. TESTING VILLA BOOKING FORM"
echo "============================"
bash scripts/test_villa_booking.sh
echo ""

# 5. Test resort booking form
echo "============================"
echo "5. TESTING RESORT BOOKING FORM"
echo "============================"
bash scripts/test_resort_booking.sh
echo ""

echo "============================"
echo "ALL FORM TESTS COMPLETED"
echo "============================"
echo ""
echo "Check Make.com and Airtable to verify that all form data has been received correctly."
echo "If any test failed, check the server logs for more details."