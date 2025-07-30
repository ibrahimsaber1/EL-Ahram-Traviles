// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMenu = document.getElementById('closeMenu');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (closeMenu) {
    closeMenu.addEventListener('click', () => {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Filter Functionality
const applyFiltersBtn = document.getElementById('applyFilters');
const clearFiltersBtn = document.getElementById('clearFilters');

if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
}

if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearFilters);
}

function applyFilters() {
    const roomType = document.getElementById('roomType').value;
    const priceRange = document.getElementById('priceRange').value;
    const capacity = document.getElementById('capacity').value;
    const viewType = document.getElementById('viewType').value;
    const features = document.getElementById('features').value;
    
    const roomItems = document.querySelectorAll('.room-item');
    let visibleCount = 0;
    
    roomItems.forEach(room => {
        let shouldShow = true;
        
        // Room type filter
        if (roomType && room.dataset.type !== roomType) {
            shouldShow = false;
        }
        
        // Price filter
        if (priceRange) {
            const price = parseInt(room.dataset.price);
            const [min, max] = priceRange.includes('+') 
                ? [parseInt(priceRange.replace('+', '')), Infinity]
                : priceRange.split('-').map(p => parseInt(p));
            
            if (price < min || price > max) {
                shouldShow = false;
            }
        }
        
        // Capacity filter
        if (capacity && parseInt(room.dataset.capacity) < parseInt(capacity)) {
            shouldShow = false;
        }
        
        // View type filter
        if (viewType && room.dataset.view !== viewType) {
            shouldShow = false;
        }
        
        // Features filter
        if (features && !room.dataset.features.includes(features)) {
            shouldShow = false;
        }
        
        // Show/hide room
        if (shouldShow) {
            room.style.display = 'block';
            visibleCount++;
        } else {
            room.style.display = 'none';
        }
    });
    
    // Update results info
    document.querySelector('.results-info').textContent = `Showing ${visibleCount} of 24 available rooms`;
    
    // Show message if no results
    if (visibleCount === 0) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

function clearFilters() {
    // Reset all filter dropdowns
    document.getElementById('roomType').value = '';
    document.getElementById('priceRange').value = '';
    document.getElementById('capacity').value = '';
    document.getElementById('viewType').value = '';
    document.getElementById('features').value = '';
    
    // Show all rooms
    const roomItems = document.querySelectorAll('.room-item');
    roomItems.forEach(room => {
        room.style.display = 'block';
    });
    
    // Update results info
    document.querySelector('.results-info').textContent = `Showing 6 of 24 available rooms`;
    hideNoResultsMessage();
}

// Category filtering
function filterByCategory(category) {
    document.getElementById('roomType').value = category;
    applyFilters();
    
    // Scroll to rooms section
    document.querySelector('.rooms-grid').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Sort Functionality
const sortSelect = document.getElementById('sortBy');
if (sortSelect) {
    sortSelect.addEventListener('change', sortRooms);
}

function sortRooms() {
    const sortBy = document.getElementById('sortBy').value;
    const roomsList = document.getElementById('roomsList');
    const rooms = Array.from(roomsList.querySelectorAll('.room-item'));
    
    rooms.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'rating':
                const ratingA = parseFloat(a.querySelector('.rating-score').textContent);
                const ratingB = parseFloat(b.querySelector('.rating-score').textContent);
                return ratingB - ratingA;
            case 'size':
                const sizeA = parseInt(a.querySelector('.room-specs span').textContent);
                const sizeB = parseInt(b.querySelector('.room-specs span').textContent);
                return sizeB - sizeA;
            default:
                return 0; // Keep original order for recommended
        }
    });
    
    // Re-append sorted rooms
    rooms.forEach(room => roomsList.appendChild(room));
}

// Room Details Modal
function viewRoomDetails(roomId) {
    const modal = document.getElementById('roomModal');
    
    // Sample room data (in a real app, this would come from a database)
    const roomData = {
        'deluxe-sea-suite': {
            title: 'Deluxe Sea View Suite',
            price: '$350',
            specs: ['45 m²', '2 Guests', 'Sea View', 'King Bed'],
            description: 'Elegant suite featuring panoramic sea views, marble bathroom with soaking tub, private balcony, and premium amenities for the ultimate luxury experience.',
            amenities: ['Free WiFi', 'Smart TV', 'A/C', 'Minibar', 'Marble Bath', 'Balcony']
        },
        'private-villa-pool': {
            title: 'Private Villa with Pool',
            price: '$520',
            specs: ['120 m²', '6 Guests', 'Sea View', '3 Bedrooms'],
            description: 'Exclusive three-bedroom villa with private infinity pool, outdoor dining area, fully equipped kitchen, and dedicated butler service.',
            amenities: ['Private Pool', 'Full Kitchen', 'Butler Service', 'Private Parking', 'In-room Spa', 'Wine Cellar']
        }
        // Add more room data as needed
    };
    
    const room = roomData[roomId] || roomData['deluxe-sea-suite'];
    
    // Populate modal content
    document.getElementById('modalRoomTitle').textContent = room.title;
    document.getElementById('modalPrice').textContent = room.price;
    document.getElementById('modalMainImage').src = '../images/room1.jpg';
    
    // Populate specs
    const specsContainer = document.getElementById('modalSpecs');
    specsContainer.innerHTML = room.specs.map(spec => 
        `<span class="spec-item"><i class="fas fa-check"></i> ${spec}</span>`
    ).join('');
    
    // Populate description
    document.getElementById('modalDescription').innerHTML = `<p>${room.description}</p>`;
    
    // Populate amenities
    const amenitiesContainer = document.getElementById('modalAmenities');
    amenitiesContainer.innerHTML = `
        <h4>Room Amenities</h4>
        <div class="amenities-list">
            ${room.amenities.map(amenity => 
                `<span class="amenity-item"><i class="fas fa-check"></i> ${amenity}</span>`
            ).join('')}
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('roomModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function changeMainImage(thumbnail) {
    const mainImage = document.getElementById('modalMainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Update main image
    mainImage.src = thumbnail.src;
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Gallery function
function openGallery(roomId) {
    // This would open a full gallery in a real application
    alert(`Opening gallery for ${roomId}. In a real app, this would show a full image gallery.`);
}

// Load More Functionality
const loadMoreBtn = document.getElementById('loadMoreRooms');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreRooms);
}

function loadMoreRooms() {
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Rooms';
        loadMoreBtn.disabled = false;
        
        document.querySelector('.results-info').textContent = 'Showing 12 of 24 available rooms';
        alert('More rooms loaded! (This is a demo - in a real app, more rooms would be added)');
    }, 1500);
}

// Book Now Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary') && e.target.textContent.includes('Book')) {
        const roomName = e.target.closest('.room-item').querySelector('h3').textContent;
        const price = e.target.closest('.room-item').querySelector('.price-amount').textContent;
        
        if (confirm(`Book ${roomName} for ${price} per night?`)) {
            alert('Booking confirmed! You will receive a confirmation email shortly.');
        }
    }
});

// Helper Functions
function showNoResultsMessage() {
    let message = document.getElementById('noResultsMessage');
    if (!message) {
        message = document.createElement('div');
        message.id = 'noResultsMessage';
        message.className = 'no-results-message';
        message.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-bed"></i>
                <h3>No rooms found</h3>
                <p>Try adjusting your filters to find available rooms</p>
                <button onclick="clearFilters()" class="clear-filters-btn">Clear Filters</button>
            </div>
        `;
        document.getElementById('roomsList').appendChild(message);
    }
}

function hideNoResultsMessage() {
    const message = document.getElementById('noResultsMessage');
    if (message) {
        message.remove();
    }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('roomModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.page-header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
