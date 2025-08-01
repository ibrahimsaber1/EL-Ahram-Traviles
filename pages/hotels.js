// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});
fetch('./footer.html')
.then(res => res.text())
.then(data => {
    document.getElementById('footer-placeholder').innerHTML = data;
    console.log(`found this footer: ${data}`);
});

fetch('./header.html')
    .then(res => res.text())
    .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
    console.log(`found this header: ${data}`);
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

// Set minimum dates for check-in and check-out
const today = new Date().toISOString().split('T')[0];
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

if (checkinInput) {
    checkinInput.setAttribute('min', today);
    checkinInput.addEventListener('change', function() {
        const checkinDate = new Date(this.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        const minCheckout = checkinDate.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', minCheckout);
    });
}

if (checkoutInput) {
    checkoutInput.setAttribute('min', today);
}

// Hotel Search Form Submission
const searchForm = document.getElementById('hotelSearchForm');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(searchForm);
        const searchData = Object.fromEntries(formData);
        
        // Validate form
        if (!searchData.destination || !searchData.checkin || !searchData.checkout) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Validate dates
        const checkinDate = new Date(searchData.checkin);
        const checkoutDate = new Date(searchData.checkout);
        
        if (checkoutDate <= checkinDate) {
            alert('Check-out date must be after check-in date.');
            return;
        }
        
        // Update search location display
        document.getElementById('searchLocation').textContent = searchData.destination;
        
        // Show loading and simulate search
        showSearchLoading();
        
        setTimeout(() => {
            hideSearchLoading();
            // Scroll to results
            document.querySelector('.hotels-results').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 2000);
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
    const priceRange = document.getElementById('priceRange').value;
    const starRating = document.getElementById('starRating').value;
    const hotelType = document.getElementById('hotelType').value;
    const amenities = document.getElementById('amenities').value;
    
    const hotelItems = document.querySelectorAll('.hotel-item');
    let visibleCount = 0;
    
    hotelItems.forEach(hotel => {
        let shouldShow = true;
        
        // Price filter
        if (priceRange) {
            const price = parseInt(hotel.dataset.price);
            const [min, max] = priceRange.includes('+') 
                ? [parseInt(priceRange.replace('+', '')), Infinity]
                : priceRange.split('-').map(p => parseInt(p));
            
            if (price < min || price > max) {
                shouldShow = false;
            }
        }
        
        // Star rating filter
        if (starRating && parseInt(hotel.dataset.rating) < parseInt(starRating)) {
            shouldShow = false;
        }
        
        // Hotel type filter
        if (hotelType && hotel.dataset.type !== hotelType) {
            shouldShow = false;
        }
        
        // Show/hide hotel
        if (shouldShow) {
            hotel.style.display = 'grid';
            visibleCount++;
        } else {
            hotel.style.display = 'none';
        }
    });
    
    // Update results count
    document.getElementById('resultsCount').textContent = `${visibleCount} hotels found`;
    
    // Show message if no results
    if (visibleCount === 0) {
        showNoResultsMessage();
    } else {
        hideNoResultsMessage();
    }
}

function clearFilters() {
    // Reset all filter dropdowns
    document.getElementById('priceRange').value = '';
    document.getElementById('starRating').value = '';
    document.getElementById('hotelType').value = '';
    document.getElementById('amenities').value = '';
    
    // Show all hotels
    const hotelItems = document.querySelectorAll('.hotel-item');
    hotelItems.forEach(hotel => {
        hotel.style.display = 'grid';
    });
    
    // Update results count
    document.getElementById('resultsCount').textContent = `${hotelItems.length} hotels found`;
    hideNoResultsMessage();
}

// Sort Functionality
const sortSelect = document.getElementById('sortBy');
if (sortSelect) {
    sortSelect.addEventListener('change', sortHotels);
}

function sortHotels() {
    const sortBy = document.getElementById('sortBy').value;
    const hotelsList = document.getElementById('hotelsList');
    const hotels = Array.from(hotelsList.querySelectorAll('.hotel-item'));
    
    hotels.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.dataset.price) - parseInt(b.dataset.price);
            case 'price-high':
                return parseInt(b.dataset.price) - parseInt(a.dataset.price);
            case 'rating':
                return parseInt(b.dataset.rating) - parseInt(a.dataset.rating);
            default:
                return 0; // Keep original order for recommended
        }
    });
    
    // Re-append sorted hotels
    hotels.forEach(hotel => hotelsList.appendChild(hotel));
}

// Book Now Functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-btn')) {
        const hotelName = e.target.closest('.hotel-item').querySelector('.hotel-name').textContent;
        const price = e.target.closest('.hotel-item').querySelector('.price-amount').textContent;
        
        if (confirm(`Book ${hotelName} for ${price} per night?`)) {
            // Show booking success
            alert('Booking confirmed! You will receive a confirmation email shortly.');
        }
    }
});

// Load More Functionality
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreHotels);
}

function loadMoreHotels() {
    // Simulate loading more hotels
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        // Reset button
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Hotels';
        loadMoreBtn.disabled = false;
        
        // Update text
        document.querySelector('.load-more-text').textContent = 'Showing 12 of 28 hotels';
        
        alert('More hotels loaded! (This is a demo - in a real app, more hotels would be added to the list)');
    }, 1500);
}

// Helper Functions
function showSearchLoading() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;
}

function hideSearchLoading() {
    const searchBtn = document.querySelector('.search-btn');
    searchBtn.innerHTML = '<i class="fas fa-search"></i> Search Hotels';
    searchBtn.disabled = false;
}

function showNoResultsMessage() {
    let message = document.getElementById('noResultsMessage');
    if (!message) {
        message = document.createElement('div');
        message.id = 'noResultsMessage';
        message.className = 'no-results-message';
        message.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No hotels found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button onclick="clearFilters()" class="clear-filters-btn">Clear Filters</button>
            </div>
        `;
        document.getElementById('hotelsList').appendChild(message);
    }
}

function hideNoResultsMessage() {
    const message = document.getElementById('noResultsMessage');
    if (message) {
        message.remove();
    }
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.page-header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
