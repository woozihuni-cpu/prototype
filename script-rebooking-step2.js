/* ===== REBOOKING STEP 2 JAVASCRIPT ===== */
/* Extends script-step2.js with rebooking-specific functionality */

// ===== REBOOKING DATA =====
let rebookingData = {
    originalBooking: {
        bookingId: '1006',
        rebookingId: 'RB006',
        packageName: 'Lower Pool (40 PAX)',
        packageId: 'lower-40',
        roomCount: 1,
        guests: 35,
        totalPrice: 10500,
        checkinDate: '2025-10-26',
        checkoutDate: '2025-10-27',
        durationType: 'daytour'
    },
    newSelection: {
        selectedItems: [],
        roomCounts: {},
        totalPrice: 0
    }
};

// Load from sessionStorage if exists
try {
    const stored = sessionStorage.getItem('rebookingData');
    if (stored) {
        const loadedData = JSON.parse(stored);
        rebookingData = { ...rebookingData, ...loadedData };
    }
} catch (e) {
    console.error('Error loading rebooking data:', e);
}

// ===== INITIALIZE ON LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    // Update header with booking IDs
    const rebookingIdElem = document.getElementById('rebooking-id');
    const originalBookingIdElem = document.getElementById('original-booking-id');
    
    if (rebookingIdElem) rebookingIdElem.textContent = rebookingData.originalBooking.rebookingId;
    if (originalBookingIdElem) originalBookingIdElem.textContent = rebookingData.originalBooking.bookingId;
    
    // Initial render
    renderOriginalSummary();
    updateRebookingSummary();
});

// ===== RENDER ORIGINAL BOOKING SUMMARY =====
function renderOriginalSummary() {
    const container = document.getElementById('original-summary-body');
    if (!container) return;
    
    const original = rebookingData.originalBooking;
    const durationText = {
        'daytour': 'Day Tour (8AM-6PM)',
        'overnight': 'Overnight (8PM-6AM)',
        '22hours': '22 Hours Full Day'
    };
    
    const checkin = new Date(original.checkinDate);
    const checkout = new Date(original.checkoutDate);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    container.innerHTML = `
        <div class="summary-section-header">
            <i class="bi bi-water"></i> Package
        </div>
        <div class="summary-item-card">
            <div class="summary-item-name">${original.packageName}</div>
            <div class="summary-item-details">
                <span>${original.roomCount} room${original.roomCount > 1 ? 's' : ''}</span>
                <span class="summary-item-price">₱${original.totalPrice.toLocaleString()}</span>
            </div>
        </div>
        
        <div class="summary-total-section">
            <div class="total-row main-total">
                <span>Total:</span>
                <span>₱${original.totalPrice.toLocaleString()}</span>
            </div>
        </div>
        
        <div class="summary-info-section">
            <div class="summary-info-row">
                <i class="bi bi-calendar-check"></i>
                <span>${checkin.toLocaleDateString('en-US', options)} - ${checkout.toLocaleDateString('en-US', options)}</span>
            </div>
            <div class="summary-info-row">
                <i class="bi bi-clock"></i>
                <span>${durationText[original.durationType] || 'Day Tour'}</span>
            </div>
            <div class="summary-info-row">
                <i class="bi bi-people"></i>
                <span>${original.guests} persons</span>
            </div>
        </div>
    `;
}

// ===== RENDER NEW BOOKING SUMMARY =====
function renderNewSummary() {
    const container = document.getElementById('new-summary-body');
    if (!container) return;
    
    if (selectedItems.length === 0) {
        container.innerHTML = `
            <div class="summary-empty">
                <i class="bi bi-inbox"></i>
                <p>No items selected yet</p>
                <span style="font-size: 0.9rem;">Choose a package or room to continue</span>
            </div>
        `;
        return;
    }
    
    let totalPrice = 0;
    let packagesHTML = '';
    let roomsHTML = '';
    
    selectedItems.forEach(itemId => {
        const pkg = packages.find(p => p.id === itemId);
        const room = rooms.find(r => r.id === itemId);
        const count = roomCounts[itemId] || 0;
        
        if (pkg) {
            const price = pkg.prices[selectedDuration]?.[count] || 0;
            totalPrice += price;
            packagesHTML = `
                <div class="summary-section-header">
                    <i class="bi bi-water"></i> Package
                </div>
                <div class="summary-item-card">
                    <div class="summary-item-name">${pkg.name} (${pkg.capacity})</div>
                    <div class="summary-item-details">
                        <span>${count} room${count > 1 ? 's' : ''}</span>
                        <span class="summary-item-price">₱${price.toLocaleString()}</span>
                    </div>
                </div>
            `;
        } else if (room) {
            const price = room.price * count;
            totalPrice += price;
            if (!roomsHTML) {
                roomsHTML = `
                    <div class="summary-section-header">
                        <i class="bi bi-door-open"></i> Rooms
                    </div>
                `;
            }
            roomsHTML += `
                <div class="summary-item-card">
                    <div class="summary-item-name">${room.name}</div>
                    <div class="summary-item-details">
                        <span>Qty: ${count}</span>
                        <span class="summary-item-price">₱${price.toLocaleString()}</span>
                    </div>
                </div>
            `;
        }
    });
    
    const durationText = {
        'daytour': 'Day Tour (8AM-6PM)',
        'overnight': 'Overnight (8PM-6AM)',
        '22hours': '22 Hours Full Day'
    };
    
    // Get date info from Step 1
    let dateInfo = '';
    try {
        const step1Data = sessionStorage.getItem('elanneBookingStep1');
        if (step1Data) {
            const data = JSON.parse(step1Data);
            const checkin = new Date(data.checkinDate);
            const checkout = new Date(data.checkoutDate);
            const options = { month: 'short', day: 'numeric', year: 'numeric' };
            dateInfo = `${checkin.toLocaleDateString('en-US', options)} - ${checkout.toLocaleDateString('en-US', options)}`;
        }
    } catch (e) {
        dateInfo = rebookingData.originalBooking.checkinDate ? 
            `${new Date(rebookingData.originalBooking.checkinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(rebookingData.originalBooking.checkoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : 
            'Date not set';
    }
    
    container.innerHTML = `
        ${packagesHTML}
        ${roomsHTML}
        
        <div class="summary-total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₱${totalPrice.toLocaleString()}</span>
            </div>
            <div class="total-row main-total">
                <span>Total:</span>
                <span>₱${totalPrice.toLocaleString()}</span>
            </div>
        </div>
        
        <div class="summary-info-section">
            <div class="summary-info-row">
                <i class="bi bi-calendar-check"></i>
                <span>${dateInfo}</span>
            </div>
            <div class="summary-info-row">
                <i class="bi bi-clock"></i>
                <span>${durationText[selectedDuration] || 'Day Tour'}</span>
            </div>
        </div>
    `;
    
    // Update rebooking data
    rebookingData.newSelection.selectedItems = selectedItems;
    rebookingData.newSelection.roomCounts = roomCounts;
    rebookingData.newSelection.totalPrice = totalPrice;
    sessionStorage.setItem('rebookingData', JSON.stringify(rebookingData));
}

// ===== UPDATE PRICE DIFFERENCE =====
function updatePriceDifference() {
    const diffSection = document.getElementById('price-difference-section');
    const diffAmount = document.getElementById('price-diff-amount');
    const diffNote = document.getElementById('price-diff-note');
    
    if (!diffSection || !diffAmount) return;
    
    if (selectedItems.length === 0) {
        diffSection.style.display = 'none';
        return;
    }
    
    const originalPrice = rebookingData.originalBooking.totalPrice;
    const newPrice = rebookingData.newSelection.totalPrice;
    const difference = newPrice - originalPrice;
    
    diffSection.style.display = 'block';
    
    // Remove all classes
    diffAmount.classList.remove('positive', 'negative', 'same');
    
    if (difference === 0) {
        diffAmount.classList.add('same');
        diffAmount.textContent = 'No Change';
        diffNote.textContent = 'New booking has the same price';
    } else if (difference > 0) {
        diffAmount.classList.add('positive');
        diffAmount.textContent = `+₱${difference.toLocaleString()}`;
        diffNote.textContent = `₱${difference.toLocaleString()} more than original`;
    } else {
        diffAmount.classList.add('negative');
        diffAmount.textContent = `-₱${Math.abs(difference).toLocaleString()}`;
        diffNote.textContent = `₱${Math.abs(difference).toLocaleString()} less than original`;
    }
}

// ===== COMBINE ALL UPDATES =====
function updateRebookingSummary() {
    renderNewSummary();
    updatePriceDifference();
    
    // Update next button state
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.disabled = selectedItems.length === 0;
    }
}

// ===== OVERRIDE updateSummary FROM script-step2.js =====
const originalUpdateSummary = window.updateSummary;

window.updateSummary = function() {
    updateRebookingSummary();
};

// ===== OVERRIDE NAVIGATION =====
const originalGoToStep3 = window.goToStep3;
window.goToStep3 = function() {
    if (selectedItems.length === 0) {
        alert('Please select at least one package or room to continue with your rebooking.');
        return;
    }
    
    // Save rebooking data
    sessionStorage.setItem('rebookingData', JSON.stringify(rebookingData));
    
    // Navigate to rebooking step 3
    window.location.href = 'rebooking-step3.html';
};

const originalGoBack = window.goBack;
window.goBack = function() {
    // Save current state
    sessionStorage.setItem('rebookingData', JSON.stringify(rebookingData));
    
    // Navigate back to rebooking step 1
    window.location.href = 'rebooking-step1.html';
};