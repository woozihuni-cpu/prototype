const packages = [
            {
                id: 'lower-25',
                name: 'Lower Pool',
                capacity: '25 PAX',
                image: 'images/lower-pool-small.jpg',
                prices: { daytour: {1:9500,2:13000,3:16000}, overnight: {1:11000,2:14500,3:17500}, '22hours': {1:20500,2:27500,3:33500} },
                description: 'Perfect for intimate gatherings',
                inclusions: ['Videoke', 'Family Room(s)', 'Refrigerator', 'Stove & Griller']
            },
            {
                id: 'lower-40',
                name: 'Lower Pool',
                capacity: '40 PAX',
                image: 'images/lower-pool-large.jpg',
                prices: { daytour: {1:10500,2:14000,3:17000,4:20000}, overnight: {1:12000,2:15500,3:18500,4:21500}, '22hours': {1:22500,2:29500,3:35500,4:41500} },
                description: 'Ideal for celebrations',
                inclusions: ['Videoke', 'Family Room(s)', 'Refrigerator', 'Stove & Griller']
            },
            {
                id: 'sampaguita-20',
                name: 'Sampaguita Pool',
                capacity: '20 PAX',
                image: 'images/sampaguita-pool.jpg',
                prices: { daytour: {1:8500,2:12000,3:15000}, overnight: {1:10000,2:13500,3:16500}, '22hours': {1:18500,2:25500,3:31500} },
                description: 'Cozy pool for families',
                inclusions: ['Videoke', 'Family Room(s)', 'Refrigerator', 'Amenities']
            },
            {
                id: 'upper-40',
                name: 'Upper Pool',
                capacity: '40 PAX',
                image: 'images/elanne-banner.jpeg',
                prices: { daytour: {1:10500,2:14000,3:17000,4:20000}, overnight: {1:12000,2:15500,3:18500,4:21500}, '22hours': {1:22500,2:29500,3:35500,4:41500} },
                description: 'Best skyline views',
                inclusions: ['Pool Access', 'Family Rooms', 'Videoke', 'Full Amenities']
            },
            {
                id: 'all-pools',
                name: 'All 3 Pools',
                capacity: '100 PAX',
                image: 'images/all-pools.jpg',
                prices: { daytour: {1:24000}, overnight: {1:28500}, '22hours': {1:52500} },
                description: 'Complete resort experience',
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
                description: 'Perfect for couples',
                features: ['Queen bed', 'AC', 'Private bath', 'TV']
            },
            {
                id: 'family-room',
                name: 'Family Room',
                capacity: '7-10 persons',
                image: 'images/rooms.jfif',
                price: 3500,
                duration: 'Per room',
                description: 'Spacious for families',
                features: ['Multiple beds', 'AC', 'Private bath', 'Refrigerator']
            },
            {
                id: 'barkada-room',
                name: 'Barkada Room',
                capacity: 'Up to 20 persons',
                image: 'images/barkada-room.jpg',
                price: 7000,
                duration: 'Per room',
                description: 'Ideal for large groups',
                features: ['Large space', 'Multiple beds', 'AC', 'Entertainment area', 'Kitchenette']
            }
        ];

        // ===== STATE =====
        let selectedDuration = 'daytour';
        let selectedItems = [];
        let roomCounts = {};

        // ===== INIT =====
        document.addEventListener('DOMContentLoaded', function() {
            renderPackages();
            renderRooms();
            updateSummary();
        });

        // ===== TAB SWITCHING =====
        function showTab(tabName) {
            selectedItems = [];
            roomCounts = {};
            
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            if (tabName === 'packages') {
                document.getElementById('packages-tab').classList.add('active');
                document.getElementById('packages-content').classList.add('active');
                renderPackages();
            } else {
                document.getElementById('rooms-tab').classList.add('active');
                document.getElementById('rooms-content').classList.add('active');
                renderRooms();
            }
            
            updateSummary();
        }

        // ===== RENDER PACKAGES =====
        function renderPackages() {
            const grid = document.getElementById('packages-grid');
            grid.innerHTML = packages.map(pkg => {
                const maxRooms = Object.keys(pkg.prices[selectedDuration] || {}).length;
                const currentCount = roomCounts[pkg.id] || 0;
                const currentPrice = pkg.prices[selectedDuration]?.[currentCount] || 0;
                const isSelected = selectedItems.includes(pkg.id);
                
                return `
                    <div class="package-card ${isSelected ? 'selected' : ''}" onclick="selectPackage('${pkg.id}')">
                        ${pkg.featured ? '<div class="package-capacity" style="position: absolute; top: 1rem; left: 1rem; background: #e47b48; color: white;">★ FEATURED</div>' : ''}
                        <img src="${pkg.image}" alt="${pkg.name}" class="package-image">
                        <div class="package-name">${pkg.name}</div>
                        <div class="package-capacity">${pkg.capacity}</div>
                        <div class="package-description">${pkg.description}</div>
                        <div class="package-price">₱${currentPrice.toLocaleString()}</div>
                        
                        ${maxRooms > 1 ? `
                            <div class="room-controls">
                                <span style="font-weight: 600; color: #2e6180;">Rooms:</span>
                                <div class="room-counter">
                                    <button onclick="decreaseRooms(event, '${pkg.id}')" ${currentCount <= 1 ? 'disabled' : ''}>
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <span class="count">${currentCount || 1}</span>
                                    <button onclick="increaseRooms(event, '${pkg.id}')" ${currentCount >= maxRooms ? 'disabled' : ''}>
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="package-inclusions">
                            <h4><i class="bi bi-check-circle"></i> Inclusions:</h4>
                            <ul>
                                ${pkg.inclusions.map(inc => `<li>${inc}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ===== RENDER ROOMS =====
        function renderRooms() {
            const grid = document.getElementById('rooms-grid');
            grid.innerHTML = rooms.map(room => {
                const currentCount = roomCounts[room.id] || 0;
                const isSelected = selectedItems.includes(room.id);
                const totalPrice = room.price * currentCount;
                
                return `
                    <div class="room-card ${isSelected ? 'selected' : ''}" onclick="selectRoom('${room.id}')">
                        <img src="${room.image}" alt="${room.name}" class="package-image">
                        <div class="package-name">${room.name}</div>
                        <div class="package-capacity">${room.capacity}</div>
                        <div class="package-description">${room.description}</div>
                        <div class="package-price">₱${totalPrice.toLocaleString()}</div>
                        <div style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">
                            <i class="bi bi-clock"></i> ${room.duration} - ₱${room.price.toLocaleString()} each
                        </div>
                        
                        <div class="room-controls">
                            <span style="font-weight: 600; color: #2e6180;">Quantity:</span>
                            <div class="room-counter">
                                <button onclick="decreaseRooms(event, '${room.id}')" ${currentCount <= 0 ? 'disabled' : ''}>
                                    <i class="bi bi-dash"></i>
                                </button>
                                <span class="count">${currentCount}</span>
                                <button onclick="increaseRooms(event, '${room.id}')" ${currentCount >= 10 ? 'disabled' : ''}>
                                    <i class="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="package-inclusions">
                            <h4><i class="bi bi-star"></i> Features:</h4>
                            <ul>
                                ${room.features.map(feat => `<li>${feat}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ===== SELECT PACKAGE =====
        function selectPackage(packageId) {
            selectedItems = [packageId];
            if (!roomCounts[packageId]) {
                roomCounts = { [packageId]: 1 };
            }
            renderPackages();
            updateSummary();
        }

        // ===== SELECT ROOM =====
        function selectRoom(roomId) {
            if (!selectedItems.includes(roomId)) {
                selectedItems.push(roomId);
                roomCounts[roomId] = (roomCounts[roomId] || 0) + 1;
            }
            renderRooms();
            updateSummary();
        }

        // ===== INCREASE ROOMS =====
        function increaseRooms(event, itemId) {
            event.stopPropagation();
            const pkg = packages.find(p => p.id === itemId);
            const maxRooms = pkg ? Object.keys(pkg.prices[selectedDuration] || {}).length : 10;
            
            if ((roomCounts[itemId] || 0) < maxRooms) {
                roomCounts[itemId] = (roomCounts[itemId] || 0) + 1;
                if (!selectedItems.includes(itemId)) {
                    selectedItems = [itemId];
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
                summaryEmpty.style.display = 'block';
                summaryContent.style.display = 'none';
                nextBtn.disabled = true;
                return;
            }
            
            summaryEmpty.style.display = 'none';
            summaryContent.style.display = 'flex';
            nextBtn.disabled = false;
            
            const pkgSection = document.getElementById('package-summary-section');
            const roomsSection = document.getElementById('rooms-summary-section');
            const pkgCard = document.getElementById('package-summary-card');
            const roomsList = document.getElementById('rooms-summary-list');
            
            let totalPrice = 0;
            let hasPackages = false;
            let hasRooms = false;
            
            pkgCard.innerHTML = '';
            roomsList.innerHTML = '';
            
            selectedItems.forEach(itemId => {
                const pkg = packages.find(p => p.id === itemId);
                const room = rooms.find(r => r.id === itemId);
                const count = roomCounts[itemId] || 0;
                
                if (pkg) {
                    hasPackages = true;
                    const price = pkg.prices[selectedDuration]?.[count] || 0;
                    totalPrice += price;
                    pkgCard.innerHTML = `
                        <div class="summary-item-name">${pkg.name} (${pkg.capacity})</div>
                        <div class="summary-item-details">
                            <span>${count} room${count > 1 ? 's' : ''}</span>
                            <span class="summary-item-price">₱${price.toLocaleString()}</span>
                        </div>
                    `;
                } else if (room) {
                    hasRooms = true;
                    const price = room.price * count;
                    totalPrice += price;
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
            });
            
            pkgSection.style.display = hasPackages ? 'block' : 'none';
            roomsSection.style.display = hasRooms ? 'block' : 'none';
            
            document.getElementById('summary-subtotal').textContent = '₱' + totalPrice.toLocaleString();
            document.getElementById('summary-total').textContent = '₱' + totalPrice.toLocaleString();
        }

        // ===== NAVIGATION =====
        function goBack() {
            console.log('Go back to Step 1');
        }

        function goToStep3() {
            console.log('Go to Step 3');
        }

        function goToHome() {
            console.log('Navigate to home');
        }

        function goToRooms() {
            console.log('Navigate to rooms');
        }

        function goToPackages() {
            console.log('Navigate to packages');
        }

        function goToEvents() {
            console.log('Navigate to events');
        }

        function goToContact() {
            console.log('Navigate to contact');
        }

        function switchPage(page) {
            console.log('Switch to page:', page);
        }