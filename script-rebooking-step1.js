/* ===== REBOOKING STEP 1 JAVASCRIPT - FIXED WITH FULL DAY LOGIC ===== */

// Rebooking State
const rebookingState = {
    // Original booking data
    originalBooking: {
        id: '1006',
        customerName: 'Pearl Roxas',
        checkinDate: '2025-10-26',
        checkoutDate: '2025-10-27',
        durationType: 'daytour',
        packageName: 'Lower Pool (40 PAX)',
        totalPrice: 10500
    },
    // New selection
    newSelection: {
        durationType: null,
        fulldayTimeType: null, // 'day-night' or 'night-day'
        selectedDates: [],
        checkinDate: null,
        checkoutDate: null
    }
};

// Calendar state
const calendarState = {
    monthOffset1: 0,
    monthOffset2: 1
};

/* ===== INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', function() {
    initializeDurationSelection();
    initializeFullDayTimeSelection();
    renderDualCalendars();
    setupNextButton();
    updateComparison();
    
    // Try to load previous selection if user came back
    setTimeout(loadPreviousSelection, 100);
});

/* ===== DURATION SELECTION ===== */
function initializeDurationSelection() {
    document.querySelectorAll('input[name="duration-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            rebookingState.newSelection.durationType = this.value;
            rebookingState.newSelection.selectedDates = [];
            rebookingState.newSelection.fulldayTimeType = null;
            
            // Show/hide full day time selection
            const fulldayTimeSection = document.getElementById('fullday-time-selection');
            if (this.value === 'fullday') {
                fulldayTimeSection.style.display = 'block';
                // Reset time selection
                document.querySelectorAll('input[name="fullday-time"]').forEach(r => r.checked = false);
            } else {
                fulldayTimeSection.style.display = 'none';
            }
            
            updateCalendarInstructions();
            renderDualCalendars();
            updateComparison();
            updateNextButton();
        });
    });
}

/* ===== FULL DAY TIME SELECTION ===== */
function initializeFullDayTimeSelection() {
    document.querySelectorAll('input[name="fullday-time"]').forEach(radio => {
        radio.addEventListener('change', function() {
            rebookingState.newSelection.fulldayTimeType = this.value;
            rebookingState.newSelection.selectedDates = [];
            
            updateCalendarInstructions();
            renderDualCalendars();
            updateComparison();
            updateNextButton();
        });
    });
}

/* ===== CALENDAR INSTRUCTIONS ===== */
function updateCalendarInstructions() {
    const instructionText = document.getElementById('calendar-instruction-text');
    
    if (!rebookingState.newSelection.durationType) {
        instructionText.textContent = 'Please select a duration type first to enable the calendar.';
        return;
    }
    
    if (rebookingState.newSelection.durationType === 'fullday' && !rebookingState.newSelection.fulldayTimeType) {
        instructionText.textContent = 'Please select a full day time range to enable the calendar.';
        return;
    }
    
    switch(rebookingState.newSelection.durationType) {
        case 'daytour':
            instructionText.textContent = 'Select one day for your day tour (8:00 AM - 6:00 PM).';
            break;
        case 'overnight':
            instructionText.textContent = 'Select one night for your overnight stay (8:00 PM - 6:00 AM).';
            break;
        case 'fullday':
            if (rebookingState.newSelection.fulldayTimeType === 'day-night') {
                instructionText.textContent = 'Select 2 consecutive days. First day needs Day Tour slot, second day needs Overnight slot.';
            } else {
                instructionText.textContent = 'Select 2 consecutive days. First day needs Overnight slot, second day needs Day Tour slot.';
            }
            break;
    }
}

/* ===== CALENDAR RENDERING ===== */
function renderDualCalendars() {
    const today = new Date();
    const month1 = new Date(today.getFullYear(), today.getMonth() + calendarState.monthOffset1, 1);
    const month2 = new Date(today.getFullYear(), today.getMonth() + calendarState.monthOffset2, 1);
    
    renderSingleCalendar('calendar-1', month1, 0);
    renderSingleCalendar('calendar-2', month2, 1);
}

function renderSingleCalendar(containerId, date, offset) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const today = new Date();
    const canGoPrev = calendarState.monthOffset1 > 0;
    
    let html = `
        <div class="calendar-header">
            <h3>${monthNames[date.getMonth()]} ${date.getFullYear()}</h3>
            <div class="calendar-nav">
                ${offset === 0 ? `
                    <button onclick="previousMonth()" ${!canGoPrev ? 'disabled' : ''} title="Previous Month">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                ` : `
                    <button onclick="nextMonth()" title="Next Month">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                `}
            </div>
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
        cellDate.setHours(0, 0, 0, 0);
        
        const availability = getDayAvailability(cellDate);
        const isClickable = isDateClickable(cellDate, availability);
        const isSelected = rebookingState.newSelection.selectedDates.some(d => 
            new Date(d).toDateString() === cellDate.toDateString()
        );
        
        const classNames = ['calendar-day', availability];
        if (isSelected) classNames.push('selected');
        if (!isClickable) classNames.push('disabled');
        
        const dateStr = cellDate.toISOString();
        
        html += `
            <button class="${classNames.join(' ')}"
                    onclick="selectRebookingDate('${dateStr}')"
                    ${!isClickable ? 'disabled' : ''}
                    title="${getDateTitle(cellDate, availability)}">
                <span>${day}</span>
            </button>
        `;
    }
    
    html += '</div>';
    document.getElementById(containerId).innerHTML = html;
}

// Helper function to get date tooltip
function getDateTitle(date, availability) {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (availability === 'unavailable') {
        return `${dateStr} - Unavailable`;
    }
    
    const availMap = {
        'available': 'Fully Available (Day Tour + Overnight)',
        'day-only': 'Day Tour Only',
        'night-only': 'Overnight Only'
    };
    
    return `${dateStr} - ${availMap[availability] || availability}`;
}

/* ===== DAY AVAILABILITY ===== */
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

/* ===== DATE CLICKABILITY - UPDATED FOR FULL DAY LOGIC ===== */
function isDateClickable(date, availability) {
    if (availability === 'unavailable') return false;
    if (!rebookingState.newSelection.durationType) return false;
    
    // For full day, also need time type selected
    if (rebookingState.newSelection.durationType === 'fullday' && !rebookingState.newSelection.fulldayTimeType) {
        return false;
    }
    
    switch(rebookingState.newSelection.durationType) {
        case 'daytour':
            return availability === 'available' || availability === 'day-only';
        case 'overnight':
            return availability === 'available' || availability === 'night-only';
        case 'fullday':
            return canSelectForFullDay(date, availability);
        default:
            return false;
    }
}

/* ===== FULL DAY SELECTION LOGIC ===== */
function canSelectForFullDay(date, availability) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayAvailability = getDayAvailability(nextDay);
    
    if (nextDayAvailability === 'unavailable') return false;
    
    if (rebookingState.newSelection.fulldayTimeType === 'day-night') {
        // Day to Night: First day needs DAY slot, second day needs NIGHT slot
        const firstDayHasDay = availability === 'available' || availability === 'day-only';
        const secondDayHasNight = nextDayAvailability === 'available' || nextDayAvailability === 'night-only';
        return firstDayHasDay && secondDayHasNight;
    } else if (rebookingState.newSelection.fulldayTimeType === 'night-day') {
        // Night to Day: First day needs NIGHT slot, second day needs DAY slot
        const firstDayHasNight = availability === 'available' || availability === 'night-only';
        const secondDayHasDay = nextDayAvailability === 'available' || nextDayAvailability === 'day-only';
        return firstDayHasNight && secondDayHasDay;
    }
    
    return false;
}

/* ===== DATE SELECTION - UPDATED FOR FULL DAY ===== */
window.selectRebookingDate = function(dateStr) {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    
    if (rebookingState.newSelection.durationType === 'fullday') {
        // For full day, we need 2 consecutive dates
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        // Store both dates
        rebookingState.newSelection.selectedDates = [
            date.toISOString(),
            nextDay.toISOString()
        ];
        
        rebookingState.newSelection.checkinDate = date.toISOString().split('T')[0];
        rebookingState.newSelection.checkoutDate = nextDay.toISOString().split('T')[0];
    } else {
        // For day tour or overnight, just one date
        rebookingState.newSelection.selectedDates = [date.toISOString()];
        rebookingState.newSelection.checkinDate = date.toISOString().split('T')[0];
        
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        rebookingState.newSelection.checkoutDate = nextDay.toISOString().split('T')[0];
    }
    
    renderDualCalendars();
    updateComparison();
    updateNextButton();
};

/* ===== CALENDAR NAVIGATION ===== */
window.previousMonth = function() {
    if (calendarState.monthOffset1 > 0) {
        calendarState.monthOffset1--;
        calendarState.monthOffset2--;
        renderDualCalendars();
    }
};

window.nextMonth = function() {
    calendarState.monthOffset1++;
    calendarState.monthOffset2++;
    renderDualCalendars();
};

/* ===== UPDATE COMPARISON ===== */
function updateComparison() {
    const newDates = document.getElementById('new-dates');
    const newDuration = document.getElementById('new-duration');

    // Update dates
    if (rebookingState.newSelection.selectedDates.length > 0) {
        const startDate = new Date(rebookingState.newSelection.selectedDates[0]);
        const endDate = new Date(rebookingState.newSelection.checkoutDate);
        
        newDates.innerHTML = `
            <strong>Check-in:</strong> ${startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br>
            <strong>Check-out:</strong> ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        `;
        newDates.classList.remove('empty');
    } else {
        newDates.innerHTML = 'No dates selected';
        newDates.classList.add('empty');
    }

    // Update duration
    if (rebookingState.newSelection.durationType) {
        let durationText = '';
        
        switch(rebookingState.newSelection.durationType) {
            case 'daytour':
                durationText = 'Day Tour (8:00 AM - 6:00 PM)';
                break;
            case 'overnight':
                durationText = 'Overnight (8:00 PM - 6:00 AM)';
                break;
            case 'fullday':
                if (rebookingState.newSelection.fulldayTimeType === 'day-night') {
                    durationText = '22 Hours: Day to Night<br><small style="font-size: 0.85em;">(8:00 AM - 6:00 AM)</small>';
                } else if (rebookingState.newSelection.fulldayTimeType === 'night-day') {
                    durationText = '22 Hours: Night to Day<br><small style="font-size: 0.85em;">(8:00 PM - 6:00 PM)</small>';
                } else {
                    durationText = '22 Hours (Full Day)';
                }
                break;
        }
        
        newDuration.innerHTML = durationText;
        newDuration.classList.remove('empty');
    } else {
        newDuration.textContent = 'No duration selected';
        newDuration.classList.add('empty');
    }
}

/* ===== UPDATE NEXT BUTTON ===== */
function updateNextButton() {
    const nextBtn = document.getElementById('step1-next-btn');
    
    let isValid = false;
    
    if (rebookingState.newSelection.durationType === 'fullday') {
        // For full day, need duration, time type, and 2 dates selected
        isValid = rebookingState.newSelection.durationType && 
                  rebookingState.newSelection.fulldayTimeType && 
                  rebookingState.newSelection.selectedDates.length === 2;
    } else {
        // For day tour or overnight, need duration and 1 date selected
        isValid = rebookingState.newSelection.durationType && 
                  rebookingState.newSelection.selectedDates.length > 0;
    }
    
    nextBtn.disabled = !isValid;
}

/* ===== SETUP NEXT BUTTON ===== */
function setupNextButton() {
    const nextBtn = document.getElementById('step1-next-btn');
    nextBtn.addEventListener('click', function() {
        if (!this.disabled) {
            saveAndProceed();
        }
    });
}

/* ===== SAVE AND PROCEED TO STEP 2 ===== */
function saveAndProceed() {
    // Save rebooking state to sessionStorage
    sessionStorage.setItem('rebookingData', JSON.stringify(rebookingState));
    
    // Navigate to step 2
    window.location.href = 'rebooking-step2.html';
}

/* ===== LOAD PREVIOUS DATA (if returning from step 2) ===== */
function loadPreviousSelection() {
    const savedData = sessionStorage.getItem('rebookingData');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            if (data.newSelection) {
                // Restore selections
                if (data.newSelection.durationType) {
                    document.getElementById(`duration-${data.newSelection.durationType}`).checked = true;
                    rebookingState.newSelection.durationType = data.newSelection.durationType;
                    
                    if (data.newSelection.durationType === 'fullday' && data.newSelection.fulldayTimeType) {
                        document.getElementById('fullday-time-selection').style.display = 'block';
                        const timeRadio = document.querySelector(`input[name="fullday-time"][value="${data.newSelection.fulldayTimeType}"]`);
                        if (timeRadio) {
                            timeRadio.checked = true;
                            rebookingState.newSelection.fulldayTimeType = data.newSelection.fulldayTimeType;
                        }
                    }
                    
                    if (data.newSelection.selectedDates && data.newSelection.selectedDates.length > 0) {
                        rebookingState.newSelection.selectedDates = data.newSelection.selectedDates;
                        rebookingState.newSelection.checkinDate = data.newSelection.checkinDate;
                        rebookingState.newSelection.checkoutDate = data.newSelection.checkoutDate;
                    }
                }
            }
            
            // Re-render with saved state
            updateCalendarInstructions();
            renderDualCalendars();
            updateComparison();
            updateNextButton();
        } catch (e) {
            console.error('Error loading previous selection:', e);
        }
    }
}