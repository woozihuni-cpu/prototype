// Smooth scrolling for navigation links
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

// Promo buttons functionality
document.querySelectorAll('.promo-btn').forEach(button => {
    button.addEventListener('click', function() {
        const promoCard = this.closest('.announcement-card');
        const promoTitle = promoCard.querySelector('h3').textContent;
        alert(`Learn more about: ${promoTitle}`);
        // Replace with actual promo detail logic
    });
});

// Package view details buttons
document.querySelectorAll('.package-btn').forEach(button => {
    button.addEventListener('click', function() {
        const packageCard = this.closest('.package-card');
        const packageTitle = packageCard.querySelector('h3').textContent;
        alert(`Viewing details for: ${packageTitle}`);
        // Replace with actual package detail logic
    });
});

// Explore amenities button
const exploreBtn = document.querySelector('.explore-btn');
if (exploreBtn) {
    exploreBtn.addEventListener('click', function() {
        alert('Redirecting to Amenities page...');
        // Replace with actual amenities page URL when available
        // window.location.href = 'amenities.html';
    });
}

// Event learn more buttons
document.querySelectorAll('.event-btn').forEach(button => {
    button.addEventListener('click', function() {
        const eventCard = this.closest('.event-card');
        const eventTitle = eventCard.querySelector('h3').textContent;
        alert(`Learning more about: ${eventTitle}`);
        // Replace with actual event detail logic
    });
});

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.package-card, .event-card, .announcement-card');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// PACKAGES Modal functionality
function openModal(packageId) {
    const modal = document.getElementById('packageModal');
    const modalBody = document.getElementById('modalBody');
    const content = document.getElementById('modal-' + packageId);
    
    if (content) {
        modalBody.innerHTML = content.innerHTML;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('packageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function bookPackage(packageName) {
    alert('Booking ' + packageName + '\n\nYou will be redirected to our booking page or Facebook Messenger.');
    // Replace with actual booking logic
    // window.location.href = 'booking.html?package=' + encodeURIComponent(packageName);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('packageModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal with ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});