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

// Mobile Menu Functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMenu = document.getElementById('closeMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeMenu.addEventListener('click', () => {
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
});

mobileMenuOverlay.addEventListener('click', (e) => {
    if (e.target === mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});



// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Set minimum date for booking inputs
const today = new Date().toISOString().split('T')[0];
document.getElementById('checkin').setAttribute('min', today);
document.getElementById('checkout').setAttribute('min', today);

// Update checkout minimum date when checkin changes
document.getElementById('checkin').addEventListener('change', function() {
    const checkinDate = new Date(this.value);
    checkinDate.setDate(checkinDate.getDate() + 1);
    const minCheckout = checkinDate.toISOString().split('T')[0];
    document.getElementById('checkout').setAttribute('min', minCheckout);
});

// Newsletter subscription
document.querySelector('.sub-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.querySelector('.sub-input').value;
    if (email && email.includes('@')) {
        alert('Thank you for subscribing! You will receive our latest travel deals and updates.');
        document.querySelector('.sub-input').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
});

// Booking form submission
document.querySelector('.booking-inp-button').addEventListener('click', function(e) {
    e.preventDefault();
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const adults = document.getElementById('adults').value;
    
    if (checkin && checkout && adults) {
        alert('Booking request submitted! We will contact you shortly to confirm your reservation.');
    } else {
        alert('Please fill in all required fields: Check-in date, Check-out date, and number of adults.');
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.banner_header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


