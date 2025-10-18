/* ===== REBOOKING FLOW JAVASCRIPT ===== */

// Original booking data (from booking ID 1006)
const originalBooking = {
    bookingId: '1006',
    rebookingId: 'RB006',
    customerName: 'Pearl Roxas',
    customerEmail: 'pearl.roxas@email.com',
    customerPhone: '+63 912 345 6789',
    checkinDate: '2025-10-26',
    checkoutDate: '2025-10-27',
    durationType: 'daytour',
    packageId: 'lower-40',
    packageName: 'Lower Pool (40 PAX)',
    guestCount: 35,
    totalPrice: 10500,
    roomCounts: { 'lower-40': 1 }
};

// New booking state
const newBooking = {
    durationType: null,
    selectedDates: [],
    packageId: null,
    packageName: null,
    roomCounts: {},
    totalPrice: 0,
    reason: '',
    reasonOther: ''
};

// Current step
let currentStep = 1;

// Reason options
const rebookingReasons = [
    'Conflict of Schedule',
    'Weather Concerns',
    'Health Issues',
    'Personal Emergency',
    'Change in Group Size',
    'Venue Preference Change',
    'Other'
];

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', function() {
    initializeRebooking();
});

function initializeRebooking() {
    const step = getCurrentStepFromURL();
    currentStep = step;
    
    if (step === 1) {
        initializeStep1();
    } else if (step === 2) {
        initializeStep2();
    } else if (step === 3) {
        initializeStep3();
    }
    
    updateProgressBar();
}

function getCurrentStepFromURL() {
    const path = window.location.pathname;
    if (path.includes('step1')) return 1;
    if (path.includes('step2')) return 2;
    if (path.includes('step3')) return 3;
    return 1;
}

/* ===== STEP 1: DATE & DURATION ===== */
function initializeStep1() {
    // Load previous new booking data if exists
    loadNewBookingData();
    
    // Setup duration selection
    setupDurationSelection();
    
    // Render calendars
    renderRebookingCalendars();
    
    // Update comparison
    updateStep1Comparison();
    
    // Setup navigation
    setupStep1Navigation();
}

function setupDurationSelection() {
    document.querySelectorAll('input[name="duration-type"]').forEach(radio => {
        // Pre-select if already chosen
        if (radio.value === newBooking.durationType) {
            radio.checked = true;
        }
        
        radio.addEventListener('change', function() {
            newBooking.durationType = this.value;
            newBooking.selectedDates = [];
            renderRebookingCalendars();
            updateStep1Comparison();
            validateStep1();
        });
    });
}

function renderRebookingCalendars() {
    const container = document.querySelector('.rebooking-calendars');
    if (!container) return;
    
    const today = new Date();
    const month1 = new Date(today.getFullYear(), today.getMonth(), 1);
    const month2 = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    container.innerHTML = `
        <div class="rebooking-calendar-wrapper">
            ${renderSingleCalendar(month1, 0)}
        </div>
        <div class="rebooking-calendar-wrapper">
            ${renderSingleCalendar(month2, 1)}
        </div>
    `;
}

function renderSingleCalendar(date, offset) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    let html = `
        <div class="calendar-header">
            <h3>${monthNames[date.getMonth()]} ${date.getFullYear()}</h3>
        </div>
        <div class="calendar-grid">
    `;
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });
    
    // Empty cells before month starts
    const firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // Days of month
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(date.getFullYear(), date.getMonth(), day);
        const availability = getDayAvailability(cellDate);
        const isClickable = isDateClickable(cellDate, availability);
        const isSelected = newBooking.selectedDates.some(d => 
            new Date(d).toDateString() === cellDate.toDateString()
        );
        
        const classNames = ['calendar-day', availability];
        if (isSelected) classNames.push('selected');
        if (!isClickable) classNames.push('disabled');
        
        html += `
            <button class="${classNames.join(' ')}"
                    onclick="selectRebookingDate('${cellDate.toISOString()}')"
                    ${!isClickable ? 'disabled' : ''}>
                <span>${day}</span>
            </button>
        `;
    }
    
    html += '</div>';
    return html;
}

function getDayAvailability(date) {
    const dayOfMonth = date.getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return 'unavailable';
    
    // Simulate availability pattern
    if (dayOfMonth % 7 === 0) return 'unavailable';
    if (dayOfMonth % 5 === 0) return 'day-only';
    if (dayOfMonth % 6 === 0) return 'night-only';
    return 'available';
}

function isDateClickable(date, availability) {
    if (availability === 'unavailable') return false;
    if (!newBooking.durationType) return false;
    
    switch(newBooking.durationType) {
        case 'daytour':
            return availability === 'available' || availability === 'day-only';
        case 'overnight':
            return availability === 'available' || availability === 'night-only';
        case 'fullday':
            return availability === 'available';
        default:
            return false;
    }
}

window.selectRebookingDate = function(dateStr) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    if (newBooking.durationType === 'fullday') {
        if (newBooking.selectedDates.length < 2) {
            newBooking.selectedDates.push(date.toISOString());
            
            if (newBooking.selectedDates.length === 2) {
                const d1 = new Date(newBooking.selectedDates[0]);
                const d2 = new Date(newBooking.selectedDates[1]);
                const daysDiff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
                
                if (Math.abs(daysDiff) !== 1) {
                    newBooking.selectedDates = [date.toISOString()];
                }
            }
        } else {
            newBooking.selectedDates = [date.toISOString()];
        }
    } else {
        newBooking.selectedDates = [date.toISOString()];
    }
    
    renderRebookingCalendars();
    updateStep1Comparison();
    validateStep1();
};

function updateStep1Comparison() {
    // Update original column
    const originalDate = document.getElementById('original-dates');
    const originalDuration = document.getElementById('original-duration');
    
    if (originalDate) {
        const checkin = new Date(originalBooking.checkinDate);
        const checkout = new Date(originalBooking.checkoutDate);
        originalDate.innerHTML = `
            <strong>Check-in:</strong> ${formatDate(checkin)}<br>
            <strong>Check-out:</strong> ${formatDate(checkout)}
        `;
    }
    
    if (originalDuration) {
        const durationMap = {
            'daytour': 'Day Tour (8:00 AM - 6:00 PM)',
            'overnight': 'Overnight (8:00 PM - 6:00 AM)',
            'fullday': 'Full Day (22 Hours)'
        };
        originalDuration.textContent = durationMap[originalBooking.durationType] || 'Day Tour';
    }
    
    // Update new column
    const newDate = document.getElementById('new-dates');
    const newDuration = document.getElementById('new-duration');
    
    if (newDate) {
        if (newBooking.selectedDates.length === 0) {
            newDate.innerHTML = '<span class="comparison-value empty">No dates selected</span>';
        } else if (newBooking.durationType === 'fullday' && newBooking.selectedDates.length === 2) {
            const dates = newBooking.selectedDates.map(d => new Date(d)).sort((a, b) => a - b);
            newDate.innerHTML = `
                <strong>Check-in:</strong> ${formatDate(dates[0])}<br>
                <strong>Check-out:</strong> ${formatDate(dates[1])}
            `;
        } else {
            const date = new Date(newBooking.selectedDates[0]);
            newDate.innerHTML = `<strong>Date:</strong> ${formatDate(date)}`;
        }
    }
    
    if (newDuration) {
        if (newBooking.durationType) {
            const durationMap = {
                'daytour': 'Day Tour (8:00 AM - 6:00 PM)',
                'overnight': 'Overnight (8:00 PM - 6:00 AM)',
                'fullday': 'Full Day (22 Hours)'
            };
            newDuration.textContent = durationMap[newBooking.durationType];
        } else {
            newDuration.innerHTML = '<span class="comparison-value empty">No duration selected</span>';
        }
    }
}

function validateStep1() {
    const nextBtn = document.getElementById('step1-next-btn');
    if (!nextBtn) return;
    
    const isValid = newBooking.durationType && newBooking.selectedDates.length > 0;
    
    if (newBooking.durationType === 'fullday') {
        nextBtn.disabled = newBooking.selectedDates.length < 2;
    } else {
        nextBtn.disabled = !isValid;
    }
}

function setupStep1Navigation() {
    const nextBtn = document.getElementById('step1-next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            saveNewBookingData();
            window.location.href = 'rebooking-step2.html';
        });
    }
}

/* ===== STEP 2: PACKAGE & ROOMS ===== */
function initializeStep2() {
    loadNewBookingData();
    
    // Reuse existing package/room rendering
    if (typeof renderPackages === 'function') {
        renderPackages();
    }
    
    updateStep2Comparison();
    setupStep2Navigation();
}

function updateStep2Comparison() {
    // Update original package
    const originalPkg = document.getElementById('original-package');
    if (originalPkg) {
        originalPkg.innerHTML = `
            <strong>${originalBooking.packageName}</strong><br>
            <span style="color: #666;">Rooms: ${originalBooking.roomCounts[originalBooking.packageId] || 1}</span><br>
            <span style="color: #666;">Guests: ${originalBooking.guestCount}</span>
        `;
    }
    
    const originalPrice = document.getElementById('original-price');
    if (originalPrice) {
        originalPrice.textContent = '₱' + originalBooking.totalPrice.toLocaleString();
    }
    
    // Update new package
    const newPkg = document.getElementById('new-package');
    if (newPkg) {
        if (newBooking.packageId && newBooking.packageName) {
            const roomCount = newBooking.roomCounts[newBooking.packageId] || 1;
            newPkg.innerHTML = `
                <strong>${newBooking.packageName}</strong><br>
                <span style="color: #666;">Rooms: ${roomCount}</span>
            `;
        } else {
            newPkg.innerHTML = '<span class="comparison-value empty">No package selected</span>';
        }
    }
    
    const newPrice = document.getElementById('new-price');
    if (newPrice) {
        if (newBooking.totalPrice > 0) {
            newPrice.textContent = '₱' + newBooking.totalPrice.toLocaleString();
        } else {
            newPrice.innerHTML = '<span class="comparison-value empty">₱0</span>';
        }
    }
    
    // Update price difference
    updatePriceDifference();
}

function updatePriceDifference() {
    const diffElem = document.getElementById('price-difference');
    if (!diffElem) return;
    
    const difference = newBooking.totalPrice - originalBooking.totalPrice;
    
    if (difference === 0) {
        diffElem.textContent = 'No change';
        diffElem.className = 'price-value';
    } else if (difference > 0) {
        diffElem.innerHTML = `
            ₱${difference.toLocaleString()}
            <span class="price-difference-badge increase">
                <i class="bi bi-arrow-up"></i> Increase
            </span>
        `;
    } else {
        diffElem.innerHTML = `
            ₱${Math.abs(difference).toLocaleString()}
            <span class="price-difference-badge decrease">
                <i class="bi bi-arrow-down"></i> Decrease
            </span>
        `;
    }
}

function setupStep2Navigation() {
    const backBtn = document.getElementById('step2-back-btn');
    const nextBtn = document.getElementById('step2-next-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'rebooking-step1.html';
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (newBooking.packageId) {
                saveNewBookingData();
                window.location.href = 'rebooking-step3.html';
            }
        });
    }
}

/* ===== STEP 3: CONFIRMATION ===== */
function initializeStep3() {
    loadNewBookingData();
    populateReasonDropdown();
    setupReasonHandling();
    updateStep3Comparison();
    setupStep3Navigation();
}

function populateReasonDropdown() {
    const select = document.getElementById('rebooking-reason');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select a reason...</option>';
    rebookingReasons.forEach(reason => {
        const option = document.createElement('option');
        option.value = reason;
        option.textContent = reason;
        if (reason === newBooking.reason) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function setupReasonHandling() {
    const select = document.getElementById('rebooking-reason');
    const otherText = document.getElementById('reason-other-text');
    
    if (select) {
        select.addEventListener('change', function() {
            newBooking.reason = this.value;
            
            if (otherText) {
                if (this.value === 'Other') {
                    otherText.disabled = false;
                    otherText.required = true;
                } else {
                    otherText.disabled = true;
                    otherText.required = false;
                    otherText.value = '';
                    newBooking.reasonOther = '';
                }
            }
            
            validateStep3();
        });
    }
    
    if (otherText) {
        otherText.addEventListener('input', function() {
            newBooking.reasonOther = this.value;
            validateStep3();
        });
    }
}

function updateStep3Comparison() {
    // Populate all comparison fields
    updateStep1Comparison();
    updateStep2Comparison();
    
    // Additional step 3 specific updates
    const customerInfo = document.getElementById('customer-info');
    if (customerInfo) {
        customerInfo.innerHTML = `
            <strong>Name:</strong> ${originalBooking.customerName}<br>
            <strong>Email:</strong> ${originalBooking.customerEmail}<br>
            <strong>Phone:</strong> ${originalBooking.customerPhone}
        `;
    }
}

function validateStep3() {
    const confirmBtn = document.getElementById('confirm-rebooking-btn');
    if (!confirmBtn) return;
    
    const hasReason = newBooking.reason !== '';
    const hasOtherText = newBooking.reason !== 'Other' || (newBooking.reason === 'Other' && newBooking.reasonOther.trim() !== '');
    
    confirmBtn.disabled = !(hasReason && hasOtherText);
}

function setupStep3Navigation() {
    const backBtn = document.getElementById('step3-back-btn');
    const confirmBtn = document.getElementById('confirm-rebooking-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'rebooking-step2.html';
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            submitRebookingRequest();
        });
    }
}

function submitRebookingRequest() {
    // Save rebooking request
    const rebookingData = {
        original: originalBooking,
        new: newBooking,
        rebookingId: originalBooking.rebookingId,
        submittedAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('rebookingRequest', JSON.stringify(rebookingData));
    
    // Redirect to success page
    window.location.href = 'rebooking-confirmation.html';
}

/* ===== UTILITY FUNCTIONS ===== */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function saveNewBookingData() {
    sessionStorage.setItem('newBookingData', JSON.stringify(newBooking));
}

function loadNewBookingData() {
    const saved = sessionStorage.getItem('newBookingData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(newBooking, data);
    }
}

function updateProgressBar() {
    // Update progress bar based on current step
    for (let i = 1; i <= 3; i++) {
        const stepElem = document.getElementById(`step-indicator-${i}`);
        if (!stepElem) continue;
        
        if (i < currentStep) {
            stepElem.classList.add('completed');
            stepElem.classList.remove('active');
        } else if (i === currentStep) {
            stepElem.classList.add('active');
            stepElem.classList.remove('completed');
        } else {
            stepElem.classList.remove('active', 'completed');
        }
    }
}

/* ===== EXPORT FOR INTEGRATION WITH EXISTING SCRIPTS ===== */
window.rebookingState = {
    original: originalBooking,
    new: newBooking,
    updateStep1Comparison,
    updateStep2Comparison,
    updateStep3Comparison,
    validateStep1,
    validateStep3
};