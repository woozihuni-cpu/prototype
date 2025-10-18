/* ===== STEP 1: DATE & DURATION LOGIC ===== */

// State management
const reservationState = {
    durationType: null,
    fulldayTimeType: null,  // ADD THIS LINE
    selectedDates: [],
    monthOffset1: 0,
    monthOffset2: 1,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth()
};

// Availability data (simulated - pattern repeats)
// 0: available, 1: day-only, 2: night-only, 3: unavailable
const availabilityPatterns = {
    0: 'available',
    1: 'day-only',
    2: 'night-only',
    3: 'unavailable'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeDurationSelection();
    initializeFullDayTimeSelection();  // ADD THIS LINE
    renderDualCalendars();
    updateNavigationState();
});

// Duration selection handler
function initializeDurationSelection() {
    document.querySelectorAll('input[name="duration-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            reservationState.durationType = this.value;
            reservationState.selectedDates = [];
            reservationState.fulldayTimeType = null;  // ADD THIS
            
            // Show/hide full day time selection - ADD THIS BLOCK
            const fulldayTimeSection = document.getElementById('fullday-time-selection');
            if (this.value === 'fullday') {
                fulldayTimeSection.style.display = 'block';
                document.querySelectorAll('input[name="fullday-time"]').forEach(r => r.checked = false);
            } else {
                fulldayTimeSection.style.display = 'none';
            }
            
            updateCalendarInstructions();  // ADD THIS
            updateDurationDisplay();
            renderDualCalendars();
            updateNavigationState();
            updateSummary();
        });
    });
}

// Full Day Time Selection Handler
function initializeFullDayTimeSelection() {
    document.querySelectorAll('input[name="fullday-time"]').forEach(radio => {
        radio.addEventListener('change', function() {
            reservationState.fulldayTimeType = this.value;
            reservationState.selectedDates = [];
            
            updateCalendarInstructions();
            renderDualCalendars();
            updateSummary();
            updateNavigationState();
        });
    });
}

function updateDurationDisplay() {
    const durationMap = {
        'daytour': 'Day Tour (8:00 AM - 6:00 PM)',
        'overnight': 'Overnight (8:00 PM - 6:00 AM)',
        'fullday': 'Full Day (22 Hours)'
    };
    
    document.getElementById('selected-duration').textContent = 
        durationMap[reservationState.durationType] || 'Not selected';
}
// Calendar Instructions
function updateCalendarInstructions() {
    const instructionText = document.getElementById('calendar-instruction-text');
    
    if (!reservationState.durationType) {
        instructionText.textContent = 'Please select a duration type first to enable the calendar.';
        return;
    }
    
    if (reservationState.durationType === 'fullday' && !reservationState.fulldayTimeType) {
        instructionText.textContent = 'Please select a full day time range to enable the calendar.';
        return;
    }
    
    switch(reservationState.durationType) {
        case 'daytour':
            instructionText.textContent = 'Select one day for your day tour (8:00 AM - 6:00 PM).';
            break;
        case 'overnight':
            instructionText.textContent = 'Select one night for your overnight stay (8:00 PM - 6:00 AM).';
            break;
        case 'fullday':
            if (reservationState.fulldayTimeType === 'day-night') {
                instructionText.textContent = 'Select 2 consecutive days. First day needs Day Tour slot, second day needs Overnight slot.';
            } else {
                instructionText.textContent = 'Select 2 consecutive days. First day needs Overnight slot, second day needs Day Tour slot.';
            }
            break;
    }
}

// Calculate day availability
function getDayAvailability(date) {
    const dayOfMonth = date.getDate();
    const dayOfWeek = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return 'unavailable';
    
    // Simulate availability pattern
    if (dayOfMonth % 7 === 0) return 'unavailable';
    if (dayOfMonth % 5 === 0) return 'day-only';
    if (dayOfMonth % 6 === 0) return 'night-only';
    return 'available';
}

// Check if date is clickable based on duration type
function isDateClickable(date, availability) {
    if (availability === 'unavailable') return false;
    if (!reservationState.durationType) return false;  // ADD THIS CHECK
    
    if (reservationState.durationType === 'fullday' && !reservationState.fulldayTimeType) {
        return false;  // ADD THIS CHECK
    }
    
    switch(reservationState.durationType) {
        case 'daytour':
            return availability === 'available' || availability === 'day-only';
        case 'overnight':
            return availability === 'available' || availability === 'night-only';
        case 'fullday':
            return canSelectForFullDay(date, availability);  // CHANGE THIS
        default:
            return false;
    }
}

// Full Day Selection Logic
function canSelectForFullDay(date, availability) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayAvailability = getDayAvailability(nextDay);
    
    if (nextDayAvailability === 'unavailable') return false;
    
    if (reservationState.fulldayTimeType === 'day-night') {
        const firstDayHasDay = availability === 'available' || availability === 'day-only';
        const secondDayHasNight = nextDayAvailability === 'available' || nextDayAvailability === 'night-only';
        return firstDayHasDay && secondDayHasNight;
    } else if (reservationState.fulldayTimeType === 'night-day') {
        const firstDayHasNight = availability === 'available' || availability === 'night-only';
        const secondDayHasDay = nextDayAvailability === 'available' || nextDayAvailability === 'day-only';
        return firstDayHasNight && secondDayHasDay;
    }
    
    return false;
}

// Render dual calendar view
function renderDualCalendars() {
    renderCalendar('calendar-1', 0);
    renderCalendar('calendar-2', 1);
}

function renderCalendar(containerId, monthOffset) {
    const container = document.getElementById(containerId);
    const date = new Date(reservationState.currentYear, reservationState.currentMonth + monthOffset, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    let html = `
        <div class="calendar-header">
            <h3>${monthNames[date.getMonth()]} ${date.getFullYear()}</h3>
            ${monthOffset === 0 ? `
                <div class="calendar-nav">
                    <button onclick="previousMonth()"><i class="bi bi-chevron-left"></i></button>
                </div>
            ` : `
                <div class="calendar-nav">
                    <button onclick="nextMonth()"><i class="bi bi-chevron-right"></i></button>
                </div>
            `}
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
        const isSelected = reservationState.selectedDates.some(d => 
            d.toDateString() === cellDate.toDateString()
        );
        const isInRange = isFullDayRangeDate(cellDate);
        
        const classNames = ['calendar-day', availability];
        if (isSelected) classNames.push('selected');
        if (isInRange && !isSelected) classNames.push('selected-range');
        if (!isClickable) classNames.push('disabled');
        
        html += `
            <button class="${classNames.join(' ')}"
                    onclick="${isClickable ? `selectDate(new Date('${cellDate.toISOString()}'))` : ''}">
                <span>${day}</span>
            </button>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Check if date is in full day range
function isFullDayRangeDate(date) {
    if (reservationState.durationType !== 'fullday' || reservationState.selectedDates.length < 2) {
        return false;
    }
    
    const [start, end] = [reservationState.selectedDates[0], reservationState.selectedDates[1]].sort((a, b) => a - b);
    return date > start && date < end;
}

// Select date
function selectDate(date) {
    date.setHours(0, 0, 0, 0);
    
    if (reservationState.durationType === 'fullday') {
        // For full day, automatically select both consecutive dates
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        reservationState.selectedDates = [date, nextDay];
    } else {
        reservationState.selectedDates = [date];
    }
    
    renderDualCalendars();
    updateSummary();
    updateNavigationState();
}

// Month navigation
function previousMonth() {
    if (reservationState.monthOffset1 > 0) {
        reservationState.monthOffset1--;
        reservationState.monthOffset2--;
        renderDualCalendars();
    }
}

function nextMonth() {
    reservationState.monthOffset1++;
    reservationState.monthOffset2++;
    renderDualCalendars();
}

// Update summary display
function updateSummary() {
    if (reservationState.selectedDates.length === 0) {
        document.getElementById('selected-dates').textContent = 'None';
        document.getElementById('stay-length').textContent = '-';
        return;
    }
    
    if (reservationState.durationType === 'fullday' && reservationState.selectedDates.length === 2) {
        const [d1, d2] = reservationState.selectedDates.sort((a, b) => a - b);
        document.getElementById('selected-dates').textContent = 
            `${d1.toLocaleDateString()} to ${d2.toLocaleDateString()}`;
        document.getElementById('stay-length').textContent = '22 hours (2 days)';
    } else {
        document.getElementById('selected-dates').textContent = 
            reservationState.selectedDates[0].toLocaleDateString();
        
        const lengthMap = {
            'daytour': '10 hours (Day)',
            'overnight': '10 hours (Night)',
            'fullday': '22 hours'
        };
        document.getElementById('stay-length').textContent = lengthMap[reservationState.durationType] || '-';
    }
}

// Update navigation state
function updateNavigationState() {
    const nextBtn = document.getElementById('next-btn');
    let isComplete = reservationState.durationType && reservationState.selectedDates.length > 0;
    
    if (reservationState.durationType === 'fullday') {
        isComplete = isComplete && reservationState.fulldayTimeType && reservationState.selectedDates.length === 2;
    }
    
    nextBtn.disabled = !isComplete;
}

// Navigation functions
function goHome() {
    window.location.href = 'index.html';
}

function goToStep2() {
    sessionStorage.setItem('reservationStep1', JSON.stringify({
        durationType: reservationState.durationType,
        fulldayTimeType: reservationState.fulldayTimeType,  // ADD THIS
        selectedDates: reservationState.selectedDates.map(d => d.toISOString())
    }));
    
    window.location.href = 'step2-room.html';
}