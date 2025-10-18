// Package data from pamphlet
const packages = [
    // Lower Pool Packages
    {
        id: 'lower-pool-40',
        name: 'Lower Pool',
        capacity: '40 PAX',
        type: 'pool',
        prices: {
            daytour: 10500,
            overnight: 12000,
            '22hours': 22500
        },
        inclusions: ['Videoke', 'Family Room 7-10 PAX', 'Refrigerator', 'Utensils', 'Tables and Chairs', 'Stove and Griller', '1 Box Cube Ice', '2 Container Mineral Water']
    },
    {
        id: 'lower-pool-25',
        name: 'Lower Pool',
        capacity: '25 PAX',
        type: 'pool',
        prices: {
            daytour: 8500,
            overnight: 11000,
            '22hours': 20500
        },
        inclusions: ['Videoke', 'Family Room 7-10 PAX', 'Refrigerator', 'Utensils', 'Tables and Chairs', 'Stove and Griller', '1 Box Cube Ice', '2 Container Mineral Water']
    },
    // Azalea Hall
    {
        id: 'azalea-hall',
        name: 'Azalea Hall',
        capacity: '80-100 PAX',
        type: 'hall',
        prices: {
            daytour: 9000,
            overnight: 0,
            '22hours': 0
        },
        minHours: 4,
        excessRate: 2000,
        fullPackage: {
            price: 29000,
            duration: '6 hours',
            includes: ['Venue', 'Tables and Chairs', '2 Rooms for 15 PAX', '10 Hours Upper Pool', 'Videoke', 'Stove', 'Griller', '3 Container Mineral Water', '1 Sack Cubed Ice']
        }
    },
    // Catleya Hall
    {
        id: 'catleya-hall',
        name: 'Catleya Hall',
        capacity: '150-200 PAX',
        type: 'hall',
        prices: {
            daytour: 11000,
            overnight: 0,
            '22hours': 0
        },
        minHours: 4,
        excessRate: 2500,
        fullPackage: {
            price: 35500,
            duration: '6 hours',
            includes: ['Venue', 'Tables and Chairs', '2 Rooms for 15 PAX', '10 Hours Upper Pool', 'Videoke', 'Stove', 'Ref', 'Griller', '3 Container Mineral Water', '1 Sack Cubed Ice']
        }
    },
    // Sampaguita Pool
    {
        id: 'sampaguita-30',
        name: 'Sampaguita Pool',
        capacity: '30 PAX',
        type: 'pool',
        prices: {
            daytour: 9500,
            overnight: 11000,
            '22hours': 20500
        },
        inclusions: ['Videoke', 'Refrigerator', 'Family Room 7-10 PAX', 'Utensils', 'Tables and Chairs', '1 Box Cube Ice', 'Stove and Griller', '2 Container Mineral Water']
    },
    {
        id: 'sampaguita-20',
        name: 'Sampaguita Pool',
        capacity: '20 PAX',
        type: 'pool',
        prices: {
            daytour: 8500,
            overnight: 10000,
            '22hours': 18500
        },
        inclusions: ['Videoke', 'Refrigerator', 'Family Room 7-10 PAX', 'Utensils', 'Tables and Chairs', '1 Box Cube Ice', 'Stove and Griller', '2 Container Mineral Water']
    },
    // Upper Pool Packages
    {
        id: 'upper-pool-40',
        name: 'Upper Pool',
        capacity: '40 PAX',
        type: 'pool',
        prices: {
            daytour: 10500,
            overnight: 12000,
            '22hours': 22500
        }
    },
    {
        id: 'upper-pool-50',
        name: 'Upper Pool',
        capacity: '50 PAX',
        type: 'pool',
        prices: {
            daytour: 11500,
            overnight: 15500,
            '22hours': 25500
        }
    },
    {
        id: 'upper-pool-70',
        name: 'Upper Pool',
        capacity: '70 PAX',
        type: 'pool',
        prices: {
            daytour: 13000,
            overnight: 18500,
            '22hours': 31500
        }
    },
    {
        id: 'upper-pool-80',
        name: 'Upper Pool',
        capacity: '80 PAX',
        type: 'pool',
        prices: {
            daytour: 13500,
            overnight: 20000,
            '22hours': 33500
        }
    },
    {
        id: 'upper-pool-100',
        name: 'Upper Pool',
        capacity: '100 PAX',
        type: 'pool',
        prices: {
            daytour: 19500,
            overnight: 22500,
            '22hours': 42000
        }
    }
];

// Add-ons data
const addons = [
    { id: 'videoke', name: 'Videoke Machine', price: 500, description: 'Sing your heart out with our karaoke system' },
    { id: 'grill', name: 'Griller Set', price: 300, description: 'Complete BBQ grilling equipment and utensils' },
    { id: 'ice', name: 'Extra Ice', price: 100, description: 'Additional box of ice cubes' },
    { id: 'decorations', name: 'Party Decorations', price: 800, description: 'Basic party decorations and setup' }
];

// State
let currentStep = 0;
let bookingData = {
    selectedPackage: null,
    bookingDate: null,
    duration: null,
    selectedAddons: [],
    guestInfo: {}
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderPackages();
    renderAddons();
    updateNavigationButtons();
    
    // Set minimum date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Render packages
function renderPackages(filter = 'all') {
    const container = document.getElementById('packages-container');
    const filteredPackages = filter === 'all' ? packages : packages.filter(p => p.type === filter);
    
    container.innerHTML = filteredPackages.map(pkg => `
        <div class="package-card ${bookingData.selectedPackage?.id === pkg.id ? 'selected' : ''}" 
             onclick="selectPackage('${pkg.id}')"
             data-testid="package-${pkg.id}">
            <div class="package-header">
                <div>
                    <div class="package-name">${pkg.name}</div>
                    <div class="package-capacity">${pkg.capacity}</div>
                </div>
            </div>
            <div class="package-prices">
                ${pkg.prices.daytour ? `<div class="price-option">
                    <span class="price-label">Day Tour</span>
                    <span class="price-value">₱${pkg.prices.daytour.toLocaleString()}</span>
                </div>` : ''}
                ${pkg.prices.overnight ? `<div class="price-option">
                    <span class="price-label">Overnight</span>
                    <span class="price-value">₱${pkg.prices.overnight.toLocaleString()}</span>
                </div>` : ''}
                ${pkg.prices['22hours'] ? `<div class="price-option">
                    <span class="price-label">22 Hours</span>
                    <span class="price-value">₱${pkg.prices['22hours'].toLocaleString()}</span>
                </div>` : ''}
                ${pkg.fullPackage ? `<div class="price-option">
                    <span class="price-label">Full Package</span>
                    <span class="price-value">₱${pkg.fullPackage.price.toLocaleString()}</span>
                </div>` : ''}
            </div>
            <span class="package-type">${pkg.type === 'pool' ? 'Pool Package' : 'Hall Package'}</span>
        </div>
    `).join('');
}

// Filter packages
function filterPackages(type) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderPackages(type);
}

// Select package
function selectPackage(packageId) {
    const pkg = packages.find(p => p.id === packageId);
    bookingData.selectedPackage = pkg;
    renderPackages();
    updateSummary();
    updateNavigationButtons();
}

// Render add-ons
function renderAddons() {
    const container = document.getElementById('addons-container');
    container.innerHTML = addons.map(addon => `
        <div class="addon-card ${bookingData.selectedAddons.includes(addon.id) ? 'selected' : ''}" 
             onclick="toggleAddon('${addon.id}')"
             data-testid="addon-${addon.id}">
            <input type="checkbox" 
                   class="addon-checkbox" 
                   ${bookingData.selectedAddons.includes(addon.id) ? 'checked' : ''}
                   onclick="event.stopPropagation(); toggleAddon('${addon.id}')">
            <div class="addon-info">
                <div class="addon-name">${addon.name}</div>
                <div class="addon-description">${addon.description}</div>
                <div class="addon-price">₱${addon.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');
}

// Toggle addon
function toggleAddon(addonId) {
    const index = bookingData.selectedAddons.indexOf(addonId);
    if (index > -1) {
        bookingData.selectedAddons.splice(index, 1);
    } else {
        bookingData.selectedAddons.push(addonId);
    }
    renderAddons();
    updateSummary();
}

// Update price display
function updatePriceDisplay() {
    const duration = document.getElementById('duration').value;
    bookingData.duration = duration;
    updateSummary();
    updateNavigationButtons();
}

// Update booking summary
function updateSummary() {
    const summaryContent = document.getElementById('summary-content');
    
    if (!bookingData.selectedPackage) {
        summaryContent.innerHTML = '<p class="empty-summary">Select a package to see your booking details</p>';
        return;
    }
    
    const pkg = bookingData.selectedPackage;
    const duration = bookingData.duration || 'daytour';
    const basePrice = pkg.prices[duration] || 0;
    
    const addonsPrice = bookingData.selectedAddons.reduce((sum, addonId) => {
        const addon = addons.find(a => a.id === addonId);
        return sum + (addon?.price || 0);
    }, 0);
    
    const subtotal = basePrice + addonsPrice;
    const downPayment = subtotal * 0.5;
    
    const dateValue = document.getElementById('booking-date')?.value;
    const durationSelect = document.getElementById('duration');
    const durationText = durationSelect?.options[durationSelect.selectedIndex]?.text;
    
    summaryContent.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Package:</span>
            <span class="summary-value">${pkg.name} (${pkg.capacity})</span>
        </div>
        ${dateValue ? `<div class="summary-item">
            <span class="summary-label">Date:</span>
            <span class="summary-value">${new Date(dateValue).toLocaleDateString()}</span>
        </div>` : ''}
        ${duration ? `<div class="summary-item">
            <span class="summary-label">Duration:</span>
            <span class="summary-value">${durationText}</span>
        </div>` : ''}
        <div class="summary-item">
            <span class="summary-label">Package Price:</span>
            <span class="summary-value">₱${basePrice.toLocaleString()}</span>
        </div>
        ${bookingData.selectedAddons.length > 0 ? `
            <div class="summary-item">
                <span class="summary-label">Add-ons:</span>
                <span class="summary-value">₱${addonsPrice.toLocaleString()}</span>
            </div>
        ` : ''}
        <hr class="summary-divider">
        <div class="summary-total">
            <span>Subtotal:</span>
            <span>₱${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-deposit">
            <span>Down Payment (50%):</span>
            <span>₱${downPayment.toLocaleString()}</span>
        </div>
    `;
}

// Navigation
function nextStep() {
    if (!canProceed()) return;
    
    if (currentStep === 2) {
        // Collect guest info
        bookingData.guestInfo = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            paymentMethod: document.getElementById('payment-method').value,
            specialRequests: document.getElementById('special-requests').value
        };
        
        // Generate booking reference
        const ref = 'ELN-2025-' + Math.random().toString(36).substr(2, 5).toUpperCase();
        document.getElementById('booking-reference').textContent = ref;
        
        // Show feedback modal after a delay
        setTimeout(() => {
            document.getElementById('feedback-modal').classList.add('show');
        }, 1000);
    }
    
    if (currentStep < 3) {
        currentStep++;
        updateStepDisplay();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Update step content
    document.querySelectorAll('.step-content').forEach((el, index) => {
        el.classList.toggle('active', index === currentStep);
    });
    
    // Update wizard progress
    document.querySelectorAll('.wizard-step').forEach((el, index) => {
        el.classList.toggle('active', index === currentStep);
        el.classList.toggle('completed', index < currentStep);
        
        if (index < currentStep) {
            el.querySelector('.step-circle').textContent = '✓';
        } else {
            el.querySelector('.step-circle').textContent = index + 1;
        }
    });
    
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    const navButtons = document.getElementById('nav-buttons');
    
    if (currentStep === 3) {
        navButtons.style.display = 'none';
        return;
    }
    
    navButtons.style.display = 'flex';
    backBtn.disabled = currentStep === 0;
    nextBtn.disabled = !canProceed();
    nextBtn.textContent = currentStep === 2 ? 'Complete Booking →' : 'Next →';
}

function canProceed() {
    switch (currentStep) {
        case 0:
            const date = document.getElementById('booking-date')?.value;
            const duration = document.getElementById('duration')?.value;
            return bookingData.selectedPackage && date && duration;
        case 1:
            return true; // Add-ons are optional
        case 2:
            const firstName = document.getElementById('first-name')?.value;
            const lastName = document.getElementById('last-name')?.value;
            const email = document.getElementById('email')?.value;
            const phone = document.getElementById('phone')?.value;
            const payment = document.getElementById('payment-method')?.value;
            return firstName && lastName && email && phone && payment;
        default:
            return false;
    }
}

// Modal
function closeModal() {
    document.getElementById('feedback-modal').classList.remove('show');
}

// Listen for form changes
document.addEventListener('input', (e) => {
    if (e.target.id === 'booking-date') {
        bookingData.bookingDate = e.target.value;
        updateSummary();
        updateNavigationButtons();
    }
    if (currentStep === 2) {
        updateNavigationButtons();
    }
});
