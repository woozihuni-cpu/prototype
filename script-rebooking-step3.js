/* ===== REBOOKING STEP 3: CONFIRMATION & SUBMISSION ===== */

let rebookingData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadRebookingData();
    populateComparison();
    setupEventListeners();
});

/* ===== DATA LOADING ===== */
function loadRebookingData() {
    // Load data from sessionStorage
    rebookingData = {
        // Original booking data
        originalBookingId: sessionStorage.getItem('originalBookingId') || '1006',
        originalGuestName: sessionStorage.getItem('originalGuestName') || 'Pearl Roxas',
        originalCheckin: sessionStorage.getItem('originalCheckin') || '2025-10-26',
        originalCheckout: sessionStorage.getItem('originalCheckout') || '2025-10-27',
        originalDuration: sessionStorage.getItem('originalDuration') || 'daytour',
        originalPackage: sessionStorage.getItem('originalPackage') || 'Lower Pool (40 PAX)',
        originalPrice: parseInt(sessionStorage.getItem('originalPrice') || '10500'),
        
        // New booking data from previous steps
        newDurationType: sessionStorage.getItem('newDurationType') || 'daytour',
        newSelectedDates: JSON.parse(sessionStorage.getItem('newSelectedDates') || '["2025-10-28"]'),
        newSelectedItems: JSON.parse(sessionStorage.getItem('newSelectedItems') || '["lower-40"]'),
        newRoomCounts: JSON.parse(sessionStorage.getItem('newRoomCounts') || '{"lower-40": 1}'),
        newTotalPrice: parseInt(sessionStorage.getItem('newTotalPrice') || '10500')
    };
}

/* ===== POPULATE COMPARISON ===== */
function populateComparison() {
    // Duration mapping
    const durationMap = {
        'daytour': 'Day Tour (8:00 AM - 6:00 PM)',
        'overnight': 'Overnight (8:00 PM - 6:00 AM)',
        'fullday': '22 Hours (Full Day)'
    };
    
    // Populate header
    document.getElementById('header-booking-id').textContent = rebookingData.originalBookingId;
    document.getElementById('header-guest-name').textContent = rebookingData.originalGuestName;
    
    // === ORIGINAL BOOKING ===
    const originalCheckin = new Date(rebookingData.originalCheckin);
    const originalCheckout = new Date(rebookingData.originalCheckout);
    
    document.getElementById('original-checkin').textContent = formatDate(originalCheckin);
    document.getElementById('original-checkout').textContent = formatDate(originalCheckout);
    document.getElementById('original-duration').textContent = durationMap[rebookingData.originalDuration] || 'Day Tour';
    document.getElementById('original-package').textContent = rebookingData.originalPackage;
    
    // === NEW BOOKING ===
    const newBookingId = 'RB006';
    document.getElementById('new-booking-id').textContent = newBookingId;
    
    // Handle dates
    if (rebookingData.newSelectedDates.length > 0) {
        const newCheckin = new Date(rebookingData.newSelectedDates[0]);
        document.getElementById('new-checkin').textContent = formatDate(newCheckin);
        
        if (rebookingData.newDurationType === 'fullday' && rebookingData.newSelectedDates.length > 1) {
            const newCheckout = new Date(rebookingData.newSelectedDates[1]);
            document.getElementById('new-checkout').textContent = formatDate(newCheckout);
        } else {
            // Calculate checkout based on duration
            const checkoutDate = new Date(newCheckin);
            checkoutDate.setDate(checkoutDate.getDate() + 1);
            document.getElementById('new-checkout').textContent = formatDate(checkoutDate);
        }
    }
    
    document.getElementById('new-duration').textContent = durationMap[rebookingData.newDurationType] || 'Day Tour';
    
    // Build new package/room description
    const newPackageText = buildPackageDescription();
    document.getElementById('new-package').textContent = newPackageText;
}

/* ===== BUILD PACKAGE DESCRIPTION ===== */
function buildPackageDescription() {
    if (rebookingData.newSelectedItems.length === 0) {
        return 'Not specified';
    }
    
    // Package and room definitions
    const packages = [
        { id: 'lower-25', name: 'Lower Pool', capacity: '25 PAX' },
        { id: 'lower-40', name: 'Lower Pool', capacity: '40 PAX' },
        { id: 'sampaguita-20', name: 'Sampaguita Pool', capacity: '20 PAX' },
        { id: 'sampaguita-30', name: 'Sampaguita Pool', capacity: '30 PAX' },
        { id: 'upper-40', name: 'Upper Pool', capacity: '40 PAX' },
        { id: 'all-pools', name: 'All 3 Pools', capacity: '100 PAX' }
    ];
    
    const rooms = [
        { id: 'couple-room', name: 'Couple Room' },
        { id: 'family-room', name: 'Family Room' }
    ];
    
    return rebookingData.newSelectedItems.map(itemId => {
        const pkg = packages.find(p => p.id === itemId);
        const room = rooms.find(r => r.id === itemId);
        const count = rebookingData.newRoomCounts[itemId] || 1;
        
        if (pkg) {
            return `${pkg.name} (${pkg.capacity})`;
        } else if (room) {
            return `${room.name} (${count}x)`;
        }
        return itemId;
    }).join(', ');
}

/* ===== EVENT LISTENERS ===== */
function setupEventListeners() {
    // Terms checkbox
    const termsCheckbox = document.getElementById('terms-agree');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', updateConfirmButton);
    }
    
    // Reason dropdown
    const reasonSelect = document.getElementById('rebooking-reason');
    if (reasonSelect) {
        reasonSelect.addEventListener('change', function() {
            toggleOtherReason();
            updateConfirmButton();
        });
    }
    
    // Other reason text
    const otherReasonText = document.getElementById('other-reason-text');
    if (otherReasonText) {
        otherReasonText.addEventListener('input', updateConfirmButton);
    }
}

/* ===== TOGGLE OTHER REASON FIELD ===== */
function toggleOtherReason() {
    const reason = document.getElementById('rebooking-reason').value;
    const otherContainer = document.getElementById('other-reason-container');
    const otherText = document.getElementById('other-reason-text');
    
    if (reason === 'other') {
        otherContainer.style.display = 'block';
        otherText.required = true;
    } else {
        otherContainer.style.display = 'none';
        otherText.required = false;
        otherText.value = '';
    }
}

/* ===== UPDATE CONFIRM BUTTON STATE ===== */
function updateConfirmButton() {
    const confirmBtn = document.getElementById('confirm-btn');
    const termsChecked = document.getElementById('terms-agree').checked;
    const reason = document.getElementById('rebooking-reason').value;
    const otherReasonText = document.getElementById('other-reason-text').value.trim();
    
    let isValid = termsChecked && reason;
    
    // If "other" is selected, require text input
    if (reason === 'other') {
        isValid = isValid && otherReasonText.length > 0;
    }
    
    confirmBtn.disabled = !isValid;
}

/* ===== SUBMIT REBOOKING REQUEST ===== */
function submitRebookingRequest() {
    // Get form data
    const reason = document.getElementById('rebooking-reason').value;
    const additionalNotes = document.getElementById('additional-notes').value.trim();
    
    // Map reason codes to full text
    const reasonMap = {
        'conflict': 'Conflict of Schedule',
        'change-mind': 'Change of Mind',
        'better-package': 'Better Package Available',
        'guest-count': 'Change in Number of Guests',
        'other': document.getElementById('other-reason-text').value.trim()
    };
    
    const reasonText = reasonMap[reason] || reason;
    
    // Generate new booking reference
    const rebookingRequestId = rebookingData.originalBookingId + '-R1';
    
    // Save rebooking request data to sessionStorage
    sessionStorage.setItem('rebookingRequestId', rebookingRequestId);
    sessionStorage.setItem('rebookingReason', reasonText);
    sessionStorage.setItem('rebookingAdditionalNotes', additionalNotes);
    sessionStorage.setItem('rebookingStatus', 'Pending Staff Approval');
    sessionStorage.setItem('rebookingSubmittedDate', new Date().toISOString());
    
    // Store complete rebooking data for confirmation page
    const completeRebookingData = {
        ...rebookingData,
        rebookingRequestId: rebookingRequestId,
        reason: reasonText,
        additionalNotes: additionalNotes,
        status: 'Pending Staff Approval',
        submittedDate: new Date().toISOString()
    };
    
    sessionStorage.setItem('completeRebookingData', JSON.stringify(completeRebookingData));
    
    // Update modal with reference number
    document.getElementById('modal-ref-number').textContent = rebookingRequestId;
    
    // Show confirmation modal with animation
    showModal();
}

/* ===== SHOW MODAL ===== */
function showModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.add('show');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Optional: Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

/* ===== CLOSE MODAL ===== */
function closeModal() {
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

/* ===== GO BACK TO PREVIOUS STEP ===== */
function goBack() {
    // Save current form data before going back
    const reason = document.getElementById('rebooking-reason').value;
    const otherReasonText = document.getElementById('other-reason-text').value.trim();
    const additionalNotes = document.getElementById('additional-notes').value.trim();
    
    sessionStorage.setItem('step3_reason', reason);
    sessionStorage.setItem('step3_otherReason', otherReasonText);
    sessionStorage.setItem('step3_additionalNotes', additionalNotes);
    
    // Navigate back
    window.location.href = 'rebooking-step2.html';
}

/* ===== UTILITY: FORMAT DATE ===== */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/* ===== RESTORE PREVIOUS FORM DATA (if coming back from another page) ===== */
function restorePreviousFormData() {
    const savedReason = sessionStorage.getItem('step3_reason');
    const savedOtherReason = sessionStorage.getItem('step3_otherReason');
    const savedAdditionalNotes = sessionStorage.getItem('step3_additionalNotes');
    
    if (savedReason) {
        document.getElementById('rebooking-reason').value = savedReason;
        toggleOtherReason();
    }
    
    if (savedOtherReason) {
        document.getElementById('other-reason-text').value = savedOtherReason;
    }
    
    if (savedAdditionalNotes) {
        document.getElementById('additional-notes').value = savedAdditionalNotes;
    }
    
    updateConfirmButton();
}

// Call restore function after DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(restorePreviousFormData, 100);
});

