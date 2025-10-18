/* ===== STEP 2 JAVASCRIPT - PACKAGE/ROOM SELECTION ===== */

// ===== DATA WITH BARKADA ROOM INCLUDED =====
const packages = [
    {
        id: 'lower-25',
        name: 'Lower Pool',
        capacity: '25 PAX',
        image: 'images/lower-pool-small.jpg',
        prices: { 
            daytour: {1:9500, 2:13000, 3:16000}, 
            overnight: {1:11000, 2:14500, 3:17500}, 
            '22hours': {1:20500, 2:27500, 3:33500} 
        },
        description: 'Perfect for intimate gatherings and small group celebrations',
        inclusions: ['Videoke', 'Family Room(s)', 'Refrigerator', 'Stove & Griller', 'Tables & Chairs']
    },
    {
        id: 'lower-40',
        name: 'Lower Pool',
        capacity: '40 PAX',
        image: 'images/lower-pool-large.jpg',
        prices: { 
            daytour: {1:10500, 2:14000, 3:17000, 4:20000}, 
            overnight: {1:12000, 2:15500, 3:18500, 4:21500}, 
            '22hours': {1:22500, 2:29500, 3:35500, 4:41500} 
        },
        description: 'Ideal for medium-sized celebrations and gatherings',
        inclusions: ['Videoke', 'Family Room(s)', 'Refrigerator', 'Stove & Griller', 'Complete Amenities']
    },
    {
        id: 'sampaguita-20',
        name: 'Sampaguita Pool',
        capacity: '20 PAX',
        image: 'images/sampaguita-pool.jpg',
        prices: { 
            daytour: {1:8500, 2:12000, 3:15000}, 
            overnight: {1:10000, 2:13500, 3:16500}, 
            '22hours': {1:18500, 2:25500, 3:31500} 
        },
        description: 'Cozy pool area perfect for family gatherings',
        inclusions: ['Videoke', 'Family Room(s)', 'Refrigerator', 'Basic Amenities']
    },
    {
        id: 'sampaguita-30',
        name: 'Sampaguita Pool',
        capacity: '30 PAX',
        image: 'images/sampaguita-pool-large.jpg',
        prices: { 
            daytour: {1:9500, 2:13000, 3:16000}, 
            overnight: {1:11000, 2:14500, 3:17500}, 
            '22hours': {1:20500, 2:27500, 3:33500} 
        },
        description: 'Spacious option for family reunions and celebrations',
        inclusions: ['Videoke', 'Family Room(s)', 'Refrigerator', 'Complete Amenities']
    },
    {
        id: 'upper-40',
        name: 'Upper Pool',
        capacity: '40 PAX',
        image: 'images/elanne-banner.jpeg',
        prices: { 
            daytour: {1:10500, 2:14000, 3:17000, 4:20000}, 
            overnight: {1:12000, 2:15500, 3:18500, 4:21500}, 
            '22hours': {1:22500, 2:29500, 3:35500, 4:41500} 
        },
        description: 'Premium pool with stunning Metro Manila skyline views',
        inclusions: ['Pool Access', 'Family Rooms', 'Videoke', 'Full Amenities']
    },
    {
        id: 'all-pools',
        name: 'All 3 Pools',
        capacity: '100 PAX',
        image: 'images/all-pools.jpg',
        prices: { 
            daytour: {1:24000}, 
            overnight: {1:28500}, 
            '22hours': {1:52500} 
        },
        description: 'Complete resort experience with access to all facilities',
        inclusions: ['All Pools', '3 Family Rooms', 'Videoke', 'Complete Amenities'],
        featured: true
    }
];

const rooms = [
    {
        id: 'couple-room',
        name: 'Couple Room',
        capacity: '2 persons',
        image: 'images/couple-room.jpg',
        price: 1500,
        duration: '10 hours',
        description: 'Perfect for couples seeking a romantic getaway',
        features: ['Queen-sized bed', 'Air conditioning', 'Private bathroom', 'LED TV', 'WiFi']
    },
    {
        id: 'family-room',
        name: 'Family Room',
        capacity: '7-10 persons',
        image: 'images/rooms.jfif',
        price: 3500,
        duration: 'Per room',
        description: 'Spacious accommodations for families and small groups',
        features: ['Multiple beds', 'Air conditioning', 'Private bathroom', 'Refrigerator', 'TV']
    },
    {
        id: 'barkada-room',
        name: 'Barkada Room',
        capacity: 'Up to 20 persons',
        image: 'images/barkada-room.jpg',
        price: 7000,
        duration: 'Per room',
        description: 'Ideal for large groups, gatherings, and team-building events',
        features: ['Large common space', 'Multiple sleeping arrangements', 'Air conditioning', 'Multiple bathrooms', 'Entertainment area', 'Refrigerator', 'Kitchenette access']
    }
];

// ===== STATE =====
let selectedDuration = 'daytour';
let selectedItems = [];
let roomCounts = {};


// ===== MODAL STATE =====
let currentModalItem = null;
let currentModalType = null; // 'package' or 'room'
let modalQuantity = 1;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeStep2();
});

function initializeStep2() {
    loadStep1Data();
    setupTabs();
    setupNavigation();
    renderPackages();
    renderRooms();
    updateSummary();
}

// ===== LOAD PREVIOUS STEP DATA =====
function loadStep1Data() {
    try {
        const step1Data = sessionStorage.getItem('elanneBookingStep1');
        if (step1Data) {
            const data = JSON.parse(step1Data);
            selectedDuration = data.durationType || 'daytour';
            
            const summaryDate = document.getElementById('summary-date');
            const summaryDuration = document.getElementById('summary-duration');
            
            if (summaryDate && data.checkinDate && data.checkoutDate) {
                const checkin = new Date(data.checkinDate);
                const checkout = new Date(data.checkoutDate);
                const options = { month: 'short', day: 'numeric', year: 'numeric' };
                summaryDate.textContent = `Date: ${checkin.toLocaleDateString('en-US', options)} - ${checkout.toLocaleDateString('en-US', options)}`;
            }
            
            if (summaryDuration) {
                const durationText = {
                    'daytour': 'Day Tour (8AM-6PM)',
                    'overnight': 'Overnight (8PM-6AM)',
                    '22hours': '22 Hours Full Day'
                };
                summaryDuration.textContent = `Duration: ${durationText[selectedDuration] || 'Day Tour'}`;
            }
        }
    } catch (error) {
        console.error('Error loading Step 1 data:', error);
    }
}

// ===== SETUP TABS =====
function setupTabs() {
    const packagesTab = document.getElementById('packages-tab');
    const roomsTab = document.getElementById('rooms-tab');
    
    if (packagesTab) {
        packagesTab.addEventListener('click', function() {
            showTab('packages');
        });
    }
    
    if (roomsTab) {
        roomsTab.addEventListener('click', function() {
            showTab('rooms');
        });
    }
}

// ===== SETUP NAVIGATION =====
function setupNavigation() {
    const backBtn = document.querySelector('.summary-actions .btn-outline');
    const nextBtn = document.getElementById('next-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            goBack();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToStep3();
        });
    }
}

// ===== TAB SWITCHING =====
function showTab(tabName) {
    // Don't clear selections when switching tabs
    
    const packagesTab = document.getElementById('packages-tab');
    const roomsTab = document.getElementById('rooms-tab');
    const packagesContent = document.getElementById('packages-content');
    const roomsContent = document.getElementById('rooms-content');
    
    if (tabName === 'packages') {
        if (packagesTab) packagesTab.classList.add('active');
        if (roomsTab) roomsTab.classList.remove('active');
        if (packagesContent) packagesContent.classList.add('active');
        if (roomsContent) roomsContent.classList.remove('active');
        renderPackages();
    } else {
        if (packagesTab) packagesTab.classList.remove('active');
        if (roomsTab) roomsTab.classList.add('active');
        if (packagesContent) packagesContent.classList.remove('active');
        if (roomsContent) roomsContent.classList.add('active');
        renderRooms();
    }
    
    updateSummary();
}

// ===== RENDER PACKAGES =====
function renderPackages() {
    const grid = document.getElementById('packages-grid');
    if (!grid) return;
    
    grid.innerHTML = packages.map(pkg => {
        const isSelected = selectedItems.includes(pkg.id);
        const currentCount = roomCounts[pkg.id] || 0;
        const currentPrice = isSelected ? (pkg.prices[selectedDuration]?.[currentCount] || 0) : 0;
        
        return `
            <div class="package-card ${isSelected ? 'selected' : ''}" onclick="openPackageModal('${pkg.id}')">
                ${pkg.featured ? '<div class="package-capacity" style="position: absolute; top: 1rem; left: 1rem; background: #e47b48; color: white;">★ FEATURED</div>' : ''}
                ${isSelected ? '<div class="selected-badge"><i class="bi bi-check-circle-fill"></i> Selected</div>' : ''}
                <img src="${pkg.image}" alt="${pkg.name}" class="package-image" onerror="this.src='images/elanne-banner.jpeg'">
                <div class="package-name">${pkg.name}</div>
                <div class="package-capacity">${pkg.capacity}</div>
                <div class="package-description">${pkg.description}</div>
                ${isSelected ? `
                    <div class="package-price">₱${currentPrice.toLocaleString()}</div>
                    <div style="text-align: center; padding: 0.75rem; background: rgba(228, 123, 72, 0.1); border-radius: 6px; margin: 0.75rem 0;">
                        <span style="color: var(--secondary); font-weight: 600;">
                            <i class="bi bi-check-circle"></i> ${currentCount} room${currentCount > 1 ? 's' : ''} selected
                        </span>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 1rem; color: #666; font-size: 0.9rem; margin-top: 1rem;">
                        <i class="bi bi-cursor"></i> Click to view details and select
                    </div>
                `}
            </div>
        `;
    }).join('');
}
// ===== RENDER ROOMS =====
function renderRooms() {
    const grid = document.getElementById('rooms-grid');
    if (!grid) return;
    
    // Check if "All Pools" package is selected
    const hasAllPoolsPackage = selectedItems.some(id => {
        const pkg = packages.find(p => p.id === id);
        return pkg && pkg.id === 'all-pools';
    });
    
    // If "All Pools" is selected, show disabled message
    if (hasAllPoolsPackage) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #fff8e1; border-radius: 12px; border: 2px dashed #ffc107;">
                <i class="bi bi-info-circle" style="font-size: 3rem; color: #ffc107; margin-bottom: 1rem;"></i>
                <h3 style="color: #856404; margin-bottom: 0.5rem;">Rooms Not Available</h3>
                <p style="color: #856404;">You have selected the "All 3 Pools" package which includes accommodation. Additional room bookings are not available with this package.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = rooms.map(room => {
        const currentCount = roomCounts[room.id] || 0;
        const isSelected = selectedItems.includes(room.id);
        const totalPrice = room.price * currentCount;
        
        return `
            <div class="room-card ${isSelected ? 'selected' : ''}" onclick="openRoomModal('${room.id}')">
                ${isSelected ? '<div class="selected-badge"><i class="bi bi-check-circle-fill"></i> Selected</div>' : ''}
                <img src="${room.image}" alt="${room.name}" class="package-image" onerror="this.src='images/rooms.jfif'">
                <div class="package-name">${room.name}</div>
                <div class="package-capacity">${room.capacity}</div>
                <div class="package-description">${room.description}</div>
                ${isSelected ? `
                    <div class="package-price">₱${totalPrice.toLocaleString()}</div>
                    <div style="text-align: center; padding: 0.75rem; background: rgba(228, 123, 72, 0.1); border-radius: 6px; margin: 0.75rem 0;">
                        <span style="color: var(--secondary); font-weight: 600;">
                            <i class="bi bi-check-circle"></i> ${currentCount} room${currentCount > 1 ? 's' : ''} selected
                        </span>
                    </div>
                ` : `
                    <div style="text-align: center; padding: 0.5rem; color: #666; font-size: 0.85rem;">
                        <i class="bi bi-clock"></i> ${room.duration} - ₱${room.price.toLocaleString()} each
                    </div>
                    <div style="text-align: center; padding: 1rem; color: #666; font-size: 0.9rem;">
                        <i class="bi bi-cursor"></i> Click to view details and select
                    </div>
                `}
            </div>
        `;
    }).join('');
}

// ===== SELECT PACKAGE (SINGLE SELECTION) =====
function selectPackage(packageId) {
    // Remove any other packages (only one package allowed)
    const otherPackages = packages.map(p => p.id).filter(id => id !== packageId);
    selectedItems = selectedItems.filter(id => !otherPackages.includes(id));
    
    // Add the new package
    if (!selectedItems.includes(packageId)) {
        selectedItems.push(packageId);
    }
    
    if (!roomCounts[packageId]) {
        roomCounts[packageId] = 1;
    }
    
    // If "All 3 Pools" is selected, remove all rooms
    if (packageId === 'all-pools') {
        const roomIds = rooms.map(r => r.id);
        selectedItems = selectedItems.filter(id => !roomIds.includes(id));
        roomIds.forEach(id => delete roomCounts[id]);
    }
    
    renderPackages();
    renderRooms(); // Re-render rooms to update disabled state
    updateSummary();
}

// ===== SELECT ROOM (MULTIPLE SELECTION) =====
function selectRoom(roomId) {
    // Check if "All 3 Pools" package is selected
    const hasAllPoolsPackage = selectedItems.includes('all-pools');
    if (hasAllPoolsPackage) {
        return; // Don't allow room selection
    }
    
    if (!selectedItems.includes(roomId)) {
        selectedItems.push(roomId);
        roomCounts[roomId] = (roomCounts[roomId] || 0) + 1;
    }
    renderRooms();
    updateSummary();
}

// ===== INCREASE ROOMS (MAX 10 PER TYPE) =====
function increaseRooms(event, itemId) {
    event.stopPropagation();
    
    // Check if trying to increase room count and "All 3 Pools" is selected
    const room = rooms.find(r => r.id === itemId);
    if (room && selectedItems.includes('all-pools')) {
        return; // Don't allow room count increase
    }
    
    const pkg = packages.find(p => p.id === itemId);
    const maxRooms = pkg ? Object.keys(pkg.prices[selectedDuration] || {}).length : 10;
    
    if ((roomCounts[itemId] || 0) < maxRooms) {
        roomCounts[itemId] = (roomCounts[itemId] || 0) + 1;
        if (!selectedItems.includes(itemId)) {
            // For packages, replace other packages
            if (pkg) {
                const otherPackages = packages.map(p => p.id).filter(id => id !== itemId);
                selectedItems = selectedItems.filter(id => !otherPackages.includes(id));
            }
            selectedItems.push(itemId);
        }
        pkg ? renderPackages() : renderRooms();
        updateSummary();
    }
}

// ===== DECREASE ROOMS =====
function decreaseRooms(event, itemId) {
    event.stopPropagation();
    const pkg = packages.find(p => p.id === itemId);
    const minCount = pkg ? 1 : 0;
    
    if ((roomCounts[itemId] || 0) > minCount) {
        roomCounts[itemId] = roomCounts[itemId] - 1;
        
        if (!pkg && roomCounts[itemId] === 0) {
            selectedItems = selectedItems.filter(id => id !== itemId);
        }
        
        pkg ? renderPackages() : renderRooms();
        updateSummary();
    }
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
    const summaryEmpty = document.getElementById('summary-empty');
    const summaryContent = document.getElementById('summary-content');
    const nextBtn = document.getElementById('next-btn');
    
    if (selectedItems.length === 0) {
        if (summaryEmpty) summaryEmpty.style.display = 'block';
        if (summaryContent) summaryContent.style.display = 'none';
        if (nextBtn) nextBtn.disabled = true;
        return;
    }
    
    if (summaryEmpty) summaryEmpty.style.display = 'none';
    if (summaryContent) summaryContent.style.display = 'flex';
    if (nextBtn) nextBtn.disabled = false;
    
    const pkgSection = document.getElementById('package-summary-section');
    const roomsSection = document.getElementById('rooms-summary-section');
    const pkgCard = document.getElementById('package-summary-card');
    const roomsList = document.getElementById('rooms-summary-list');
    
    let totalPrice = 0;
    let hasPackages = false;
    let hasRooms = false;
    
    if (pkgCard) pkgCard.innerHTML = '';
    if (roomsList) roomsList.innerHTML = '';
    
    selectedItems.forEach(itemId => {
        const pkg = packages.find(p => p.id === itemId);
        const room = rooms.find(r => r.id === itemId);
        const count = roomCounts[itemId] || 0;
        
        if (pkg) {
            hasPackages = true;
            const price = pkg.prices[selectedDuration]?.[count] || 0;
            totalPrice += price;
            if (pkgCard) {
                pkgCard.innerHTML = `
                    <div class="summary-item-name">${pkg.name} (${pkg.capacity})</div>
                    <div class="summary-item-details">
                        <span>${count} room${count > 1 ? 's' : ''}</span>
                        <span class="summary-item-price">₱${price.toLocaleString()}</span>
                    </div>
                `;
            }
        } else if (room) {
            hasRooms = true;
            const price = room.price * count;
            totalPrice += price;
            if (roomsList) {
                roomsList.innerHTML += `
                    <div class="summary-item-card">
                        <div class="summary-item-name">${room.name}</div>
                        <div class="summary-item-details">
                            <span>Qty: ${count}</span>
                            <span class="summary-item-price">₱${price.toLocaleString()}</span>
                        </div>
                    </div>
                `;
            }
        }
    });
    
    if (pkgSection) pkgSection.style.display = hasPackages ? 'block' : 'none';
    if (roomsSection) roomsSection.style.display = hasRooms ? 'block' : 'none';
    
    const subtotalElem = document.getElementById('summary-subtotal');
    const totalElem = document.getElementById('summary-total');
    
    if (subtotalElem) subtotalElem.textContent = '₱' + totalPrice.toLocaleString();
    if (totalElem) totalElem.textContent = '₱' + totalPrice.toLocaleString();
}

// ===== SAVE STEP 2 DATA =====
function saveStep2Data() {
    const bookingData = {
        selectedItems: selectedItems,
        roomCounts: roomCounts,
        selectedDuration: selectedDuration,
        totalPrice: calculateTotalPrice(),
        timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('elanneBookingStep2', JSON.stringify(bookingData));
}

function calculateTotalPrice() {
    let total = 0;
    
    selectedItems.forEach(itemId => {
        const pkg = packages.find(p => p.id === itemId);
        const room = rooms.find(r => r.id === itemId);
        const count = roomCounts[itemId] || 0;
        
        if (pkg) {
            total += pkg.prices[selectedDuration]?.[count] || 0;
        } else if (room) {
            total += room.price * count;
        }
    });
    
    return total;
}

// ===== NAVIGATION FUNCTIONS =====
function goBack() {
    saveStep2Data();
    window.location.href = 'step1-date-duration.html';
}

function goToStep3() {
    if (selectedItems.length === 0) {
        alert('Please select at least one package or room to continue.');
        return;
    }
    
    saveStep2Data();
    window.location.href = 'step3-payment.html';
}
// ===== MODAL FUNCTIONS =====
function openPackageModal(packageId) {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;
    
    currentModalItem = pkg;
    currentModalType = 'package';
    modalQuantity = roomCounts[packageId] || 1;
    
    // Populate modal
    document.getElementById('modal-image').src = pkg.image;
    document.getElementById('modal-image').onerror = function() { this.src = 'images/elanne-banner.jpeg'; };
    document.getElementById('modal-title').textContent = pkg.name;
    document.getElementById('modal-capacity-badge').textContent = pkg.capacity;
    document.getElementById('modal-description').textContent = pkg.description;
    document.getElementById('modal-inclusions-title').textContent = 'Inclusions';
    
    // Populate inclusions
    const inclusionsList = document.getElementById('modal-inclusions-list');
    inclusionsList.innerHTML = pkg.inclusions.map(inc => `<li>${inc}</li>`).join('');
    
    // Setup quantity controls
    const maxRooms = Object.keys(pkg.prices[selectedDuration] || {}).length;
    const quantitySection = document.getElementById('modal-quantity-section');
    
    if (maxRooms > 1) {
        quantitySection.style.display = 'block';
        document.getElementById('modal-quantity-note').textContent = `Maximum ${maxRooms} rooms`;
        updateModalQuantityDisplay();
    } else {
        quantitySection.style.display = 'none';
    }
    
    // Update price
    updateModalPrice();
    
    // Show modal
    document.getElementById('details-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function openRoomModal(roomId) {
    // Check if "All 3 Pools" package is selected
    const hasAllPoolsPackage = selectedItems.includes('all-pools');
    if (hasAllPoolsPackage) {
        return; // Don't open modal for rooms
    }

    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    currentModalItem = room;
    currentModalType = 'room';
    modalQuantity = roomCounts[roomId] || 1;
    
    // Populate modal
    document.getElementById('modal-image').src = room.image;
    document.getElementById('modal-image').onerror = function() { this.src = 'images/rooms.jfif'; };
    document.getElementById('modal-title').textContent = room.name;
    document.getElementById('modal-capacity-badge').textContent = room.capacity;
    document.getElementById('modal-description').textContent = room.description;
    document.getElementById('modal-inclusions-title').textContent = 'Features';
    
    // Populate features
    const inclusionsList = document.getElementById('modal-inclusions-list');
    inclusionsList.innerHTML = room.features.map(feat => `<li>${feat}</li>`).join('');
    
    // Setup quantity controls
    const quantitySection = document.getElementById('modal-quantity-section');
    quantitySection.style.display = 'block';
    document.getElementById('modal-quantity-note').textContent = `Maximum 10 rooms • ${room.duration}`;
    updateModalQuantityDisplay();
    
    // Update price
    updateModalPrice();
    
    // Show modal
    document.getElementById('details-modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
    document.getElementById('details-modal').classList.remove('show');
    document.body.style.overflow = '';
    currentModalItem = null;
    currentModalType = null;
    modalQuantity = 1;
}

function modalIncreaseQuantity() {
    if (currentModalType === 'package') {
        const maxRooms = Object.keys(currentModalItem.prices[selectedDuration] || {}).length;
        if (modalQuantity < maxRooms) {
            modalQuantity++;
            updateModalQuantityDisplay();
            updateModalPrice();
        }
    } else if (currentModalType === 'room') {
        if (modalQuantity < 10) {
            modalQuantity++;
            updateModalQuantityDisplay();
            updateModalPrice();
        }
    }
}

function modalDecreaseQuantity() {
    if (modalQuantity > 1) {
        modalQuantity--;
        updateModalQuantityDisplay();
        updateModalPrice();
    }
}

function updateModalQuantityDisplay() {
    document.getElementById('modal-quantity').textContent = modalQuantity;
    
    if (currentModalType === 'package') {
        const maxRooms = Object.keys(currentModalItem.prices[selectedDuration] || {}).length;
        document.getElementById('modal-decrease-btn').disabled = modalQuantity <= 1;
        document.getElementById('modal-increase-btn').disabled = modalQuantity >= maxRooms;
    } else {
        document.getElementById('modal-decrease-btn').disabled = modalQuantity <= 1;
        document.getElementById('modal-increase-btn').disabled = modalQuantity >= 10;
    }
}

function updateModalPrice() {
    let price = 0;
    
    if (currentModalType === 'package') {
        price = currentModalItem.prices[selectedDuration]?.[modalQuantity] || 0;
    } else if (currentModalType === 'room') {
        price = currentModalItem.price * modalQuantity;
    }
    
    document.getElementById('modal-price').textContent = '₱' + price.toLocaleString();
}

function addItemFromModal() {
    if (!currentModalItem) return;
    
    if (currentModalType === 'package') {
        // For packages, remove other packages (only one package allowed)
        const otherPackages = packages.map(p => p.id).filter(id => id !== currentModalItem.id);
        selectedItems = selectedItems.filter(id => !otherPackages.includes(id));
        
        // Add the new package
        if (!selectedItems.includes(currentModalItem.id)) {
            selectedItems.push(currentModalItem.id);
        }
        roomCounts[currentModalItem.id] = modalQuantity;
        
        // If "All 3 Pools" is selected, remove all rooms
        if (currentModalItem.id === 'all-pools') {
            const roomIds = rooms.map(r => r.id);
            selectedItems = selectedItems.filter(id => !roomIds.includes(id));
            roomIds.forEach(id => delete roomCounts[id]);
        }
        
        renderPackages();
        renderRooms(); // Update rooms display
    } else if (currentModalType === 'room') {
        // Check if "All 3 Pools" is selected
        if (selectedItems.includes('all-pools')) {
            closeDetailsModal();
            return;
        }
        
        // For rooms, can select multiple
        if (!selectedItems.includes(currentModalItem.id)) {
            selectedItems.push(currentModalItem.id);
        }
        roomCounts[currentModalItem.id] = modalQuantity;
        renderRooms();
    }
    
    updateSummary();
    closeDetailsModal();
}

// Make modal functions globally accessible
window.openPackageModal = openPackageModal;
window.openRoomModal = openRoomModal;
window.closeDetailsModal = closeDetailsModal;
window.modalIncreaseQuantity = modalIncreaseQuantity;
window.modalDecreaseQuantity = modalDecreaseQuantity;
window.addItemFromModal = addItemFromModal;

// ===== MAKE FUNCTIONS GLOBALLY ACCESSIBLE =====
window.showTab = showTab;
window.selectPackage = selectPackage;
window.selectRoom = selectRoom;
window.increaseRooms = increaseRooms;
window.decreaseRooms = decreaseRooms;
window.goBack = goBack;
window.goToStep3 = goToStep3;