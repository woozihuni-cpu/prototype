// Step 3: Payment Logic (Fixed)

let selectedPaymentMethod = null;
let bookingData = {};

document.addEventListener('DOMContentLoaded', function() {
    loadBookingData();
    populateSummary();
    setupEventListeners();
    applyPaymentStyles();
});

function loadBookingData() {
    bookingData = {
        date: sessionStorage.getItem('selectedDate'),
        duration: sessionStorage.getItem('selectedDuration'),
        selectedItems: JSON.parse(sessionStorage.getItem('selectedItems') || '[]'),
        roomCounts: JSON.parse(sessionStorage.getItem('roomCounts') || '{}'),
        totalPrice: parseInt(sessionStorage.getItem('totalPrice') || '6000')
    };
}

function populateSummary() {
    const durationLabels = {
        'daytour': 'Day Tour (8:00 AM - 6:00 PM)',
        'overnight': 'Overnight (8:00 PM - 6:00 AM)',
        '22hours': '22 Hours (Full Day)'
    };
    
    if (bookingData.date) {
        const dateObj = new Date(bookingData.date);
        document.getElementById('summary-checkin').textContent = dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        document.getElementById('summary-checkin').textContent = 'October 26, 2025';
    }
    
    document.getElementById('summary-duration').textContent = durationLabels[bookingData.duration] || 'Day Tour (8:00 AM - 6:00 PM)';
    
    let selectionText = 'Lower Pool (40 PAX)';
    if (bookingData.selectedItems && bookingData.selectedItems.length > 0) {
        selectionText = '';
        bookingData.selectedItems.forEach(itemId => {
            const count = bookingData.roomCounts[itemId] || 1;
            selectionText += `${itemId.replace('-', ' ').toUpperCase()} (${count}) `;
        });
    }
    document.getElementById('summary-selection').textContent = selectionText;
    
    const total = bookingData.totalPrice || 6000;
    const downPayment = Math.ceil(total * 0.5);
    
    document.getElementById('summary-total').textContent = '₱' + total.toLocaleString();
    document.getElementById('summary-downpayment').textContent = '₱' + downPayment.toLocaleString();
    document.getElementById('gcash-amount').textContent = '₱' + downPayment.toLocaleString();
    document.getElementById('paymaya-amount').textContent = '₱' + downPayment.toLocaleString();
    document.getElementById('bank-amount').textContent = '₱' + downPayment.toLocaleString();
}

function setupEventListeners() {
    document.getElementById('terms-agree').addEventListener('change', updateConfirmButton);
    document.getElementById('guest-name').addEventListener('input', updateConfirmButton);
    document.getElementById('guest-email').addEventListener('input', updateConfirmButton);
    document.getElementById('guest-phone').addEventListener('input', updateConfirmButton);
    document.getElementById('guest-count').addEventListener('input', updateConfirmButton);
}

function applyPaymentStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .payment-option:hover {
            border-color: #e47b48 !important;
            box-shadow: 0 4px 12px rgba(228, 123, 72, 0.15);
        }
        .payment-option.selected {
            border-color: #e47b48 !important;
            background-color: rgba(228, 123, 72, 0.05);
        }
        .payment-option.selected i {
            color: #e47b48 !important;
        }
    `;
    document.head.appendChild(style);
}

function selectPayment(method) {
    selectedPaymentMethod = method;
    
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
    event.target.closest('.payment-option').classList.add('selected');
    
    document.querySelectorAll('.payment-instructions').forEach(inst => inst.style.display = 'none');
    document.getElementById(`${method}-instructions`).style.display = 'block';
    
    updateConfirmButton();
}

function updateConfirmButton() {
    const name = document.getElementById('guest-name').value.trim();
    const email = document.getElementById('guest-email').value.trim();
    const phone = document.getElementById('guest-phone').value.trim();
    const guestCount = document.getElementById('guest-count').value.trim();
    const termsChecked = document.getElementById('terms-agree').checked;
    
    const allValid = name && email && phone && guestCount && termsChecked && selectedPaymentMethod;
    document.getElementById('confirm-btn').disabled = !allValid;
}

function confirmBooking() {
    const bookingRef = '1006';
    
    sessionStorage.setItem('bookingRef', bookingRef);
    sessionStorage.setItem('guestName', document.getElementById('guest-name').value || 'Pearl Roxas');
    sessionStorage.setItem('guestEmail', document.getElementById('guest-email').value || 'pearl.roxas@email.com');
    sessionStorage.setItem('guestPhone', document.getElementById('guest-phone').value || '+63 912 345 6789');
    sessionStorage.setItem('guestCount', document.getElementById('guest-count').value || '35');
    sessionStorage.setItem('specialRequests', document.getElementById('special-requests').value);
    sessionStorage.setItem('paymentMethod', selectedPaymentMethod);
    sessionStorage.setItem('packageName', 'Lower Pool (40 PAX)');
    sessionStorage.setItem('checkinDate', 'October 26, 2025');
    sessionStorage.setItem('checkoutDate', 'October 27, 2025');
    sessionStorage.setItem('totalAmount', '₱6,000');
    
    window.location.href = 'step4-confirmation.html';
}

function goBack() {
    window.location.href = 'step2-room.html';
}