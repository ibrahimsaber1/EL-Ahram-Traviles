// Common JavaScript functions for all pages

// Load Header and Footer Components
function loadComponents() {
    // Determine if we're on the home page or in pages directory
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const pathPrefix = isHomePage ? './' : '../';
    
    // Load Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const headerPath = isHomePage ? './header.html' : './header.html';
        fetch(headerPath)
            .then(res => res.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                initializeHeader();
            })
            .catch(err => console.error('Failed to load header:', err));
    }

    // Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const footerPath = isHomePage ? './footer.html' : './footer.html';
        fetch(footerPath)
            .then(res => res.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(err => console.error('Failed to load footer:', err));
    }
}

// Initialize Header Functionality
function initializeHeader() {
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

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('#mainHeader');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Set active navigation link
    setActiveNavLink();
}

// Set Active Navigation Link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav_links a, .page-nav-links a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Remove active classes first
        link.parentElement.classList.remove('auth-active', 'active');
        
        // Check if current page matches link
        if (currentPath.includes('rooms.html') && linkPath.includes('rooms.html')) {
            link.parentElement.classList.add('auth-active');
        } else if (currentPath.includes('hotels.html') && linkPath.includes('hotels.html')) {
            link.parentElement.classList.add('auth-active');
        } else if (currentPath.includes('login.html') && linkPath.includes('login.html')) {
            link.parentElement.classList.add('auth-active');
        } else if (currentPath.includes('register.html') && linkPath.includes('register.html')) {
            link.parentElement.classList.add('auth-active');
        } else if ((currentPath.endsWith('index.html') || currentPath === '/') && linkPath.includes('index.html')) {
            link.parentElement.classList.add('auth-active');
        }
    });
}

// Smooth Scrolling for anchor links
function initializeSmoothScrolling() {
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
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
    initializeSmoothScrolling();
});

// Initialize AOS if available
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
});