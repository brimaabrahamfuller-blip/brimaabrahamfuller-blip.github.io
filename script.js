// ==========================================================================
// Security Configuration
// ==========================================================================

const SecurityConfig = {
    // Rate limiting: max submissions per time window
    MAX_SUBMISSIONS: 3,
    TIME_WINDOW: 60000, // 1 minute in milliseconds
    submissions: [],
    
    // Check if rate limit is exceeded
    checkRateLimit() {
        const now = Date.now();
        // Remove old submissions outside time window
        this.submissions = this.submissions.filter(time => now - time < this.TIME_WINDOW);
        
        if (this.submissions.length >= this.MAX_SUBMISSIONS) {
            return false; // Rate limit exceeded
        }
        
        this.submissions.push(now);
        return true; // OK to proceed
    }
};

// ==========================================================================
// Input Sanitization Utilities
// ==========================================================================

const SecurityUtils = {
    // Sanitize string input to prevent XSS
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    // Validate email format
    validateEmail(email) {
        const re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        return re.test(String(email).toLowerCase());
    },
    
    // Validate name (letters, spaces, hyphens, apostrophes only)
    validateName(name) {
        const re = /^[a-zA-Z\s'-]+$/;
        return re.test(name) && name.length >= 2 && name.length <= 100;
    },
    
    // Validate message length
    validateMessage(message) {
        return message.length >= 10 && message.length <= 5000;
    },
    
    // Validate subject length
    validateSubject(subject) {
        return subject.length >= 3 && subject.length <= 200;
    }
};

// ==========================================================================
// Mobile Navigation Menu Toggle
// ==========================================================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==========================================================================
// Smooth Scroll for Navigation Links
// ==========================================================================

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================================================
// Navbar Background Change on Scroll
// ==========================================================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--dark-bg)';
        navbar.style.backdropFilter = 'none';
    }
});

// ==========================================================================
// Active Navigation Link on Scroll
// ==========================================================================

const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==========================================================================
// Secure Contact Form Handling with Validation & Rate Limiting
// ==========================================================================

const contactForm = document.querySelector('.contact-form');

// Function to show error message
function showError(message, type = 'error') {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)'};
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.5s ease;
        max-width: 400px;
    `;
    errorDiv.innerHTML = `
        <strong>${type === 'error' ? '⚠ Error' : '✓ Success'}</strong><br>
        ${SecurityUtils.sanitizeInput(message)}
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 500);
    }, 5000);
}

// Function to validate form field and show visual feedback
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    switch(fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (!SecurityUtils.validateName(value)) {
                errorMessage = 'Please enter a valid name (2-100 characters, letters only)';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!SecurityUtils.validateEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'subject':
            if (value && !SecurityUtils.validateSubject(value)) {
                errorMessage = 'Subject must be between 3 and 200 characters';
                isValid = false;
            }
            break;
            
        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (!SecurityUtils.validateMessage(value)) {
                errorMessage = 'Message must be between 10 and 5000 characters';
                isValid = false;
            }
            break;
    }
    
    // Visual feedback
    if (!isValid) {
        field.style.borderColor = '#ef4444';
        field.setAttribute('aria-invalid', 'true');
    } else {
        field.style.borderColor = '#10b981';
        field.setAttribute('aria-invalid', 'false');
    }
    
    return { isValid, errorMessage };
}

// Add real-time validation on blur
const formFields = contactForm.querySelectorAll('input, textarea');
formFields.forEach(field => {
    field.addEventListener('blur', () => {
        if (field.value.trim()) {
            validateField(field);
        }
    });
    
    // Reset border color on focus
    field.addEventListener('focus', () => {
        field.style.borderColor = '';
    });
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Rate limiting check
    if (!SecurityConfig.checkRateLimit()) {
        showError('Too many submissions. Please wait a minute before trying again.', 'error');
        return;
    }
    
    // Get form values
    const nameField = contactForm.querySelector('#name');
    const emailField = contactForm.querySelector('#email');
    const subjectField = contactForm.querySelector('#subject');
    const messageField = contactForm.querySelector('#message');
    
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const subject = subjectField.value.trim();
    const message = messageField.value.trim();
    
    // Validate all fields
    const nameValidation = validateField(nameField);
    const emailValidation = validateField(emailField);
    const messageValidation = validateField(messageField);
    const subjectValidation = subject ? validateField(subjectField) : { isValid: true };
    
    // Check if any validation failed
    if (!nameValidation.isValid) {
        showError(nameValidation.errorMessage, 'error');
        nameField.focus();
        return;
    }
    
    if (!emailValidation.isValid) {
        showError(emailValidation.errorMessage, 'error');
        emailField.focus();
        return;
    }
    
    if (!subjectValidation.isValid) {
        showError(subjectValidation.errorMessage, 'error');
        subjectField.focus();
        return;
    }
    
    if (!messageValidation.isValid) {
        showError(messageValidation.errorMessage, 'error');
        messageField.focus();
        return;
    }
    
    // Sanitize all inputs before processing
    const sanitizedData = {
        name: SecurityUtils.sanitizeInput(name),
        email: SecurityUtils.sanitizeInput(email),
        subject: SecurityUtils.sanitizeInput(subject),
        message: SecurityUtils.sanitizeInput(message),
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 200) // Limited length for security
    };
    
    // Here you would typically send the sanitized form data to a server
    // For now, we'll just show a success message
    console.log('Secure form submission:', sanitizedData);
    
    // Create success message
    showError('Thank you for reaching out! I\'ll get back to you soon.', 'success');
    
    // Reset form and validation states
    contactForm.reset();
    formFields.forEach(field => {
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
    });
});

// ==========================================================================
// Add CSS animations for messages
// ==========================================================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--accent-color);
    }
`;
document.head.appendChild(style);

// ==========================================================================
// Scroll Animations for Elements
// ==========================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .highlight-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ==========================================================================
// Typing Effect for Hero Subtitle
// ==========================================================================

const heroSubtitle = document.querySelector('.hero-subtitle');
const subtitleText = heroSubtitle.textContent;
heroSubtitle.textContent = '';

let charIndex = 0;

function typeEffect() {
    if (charIndex < subtitleText.length) {
        heroSubtitle.textContent += subtitleText.charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100);
    }
}

// Start typing effect after page load
window.addEventListener('load', () => {
    setTimeout(typeEffect, 500);
});

// ==========================================================================
// Update Copyright Year Automatically
// ==========================================================================

const updateCopyrightYear = () => {
    const footerText = document.querySelector('.footer p');
    const currentYear = new Date().getFullYear();
    footerText.textContent = `© ${currentYear} Brima Abraham Fuller. All rights reserved.`;
};

updateCopyrightYear();

// ==========================================================================
// Security: Prevent Console Tampering (Optional)
// ==========================================================================

console.log('%c🔒 Portfolio Security Enabled', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%c⚠ Warning: This is a browser feature intended for developers.', 'color: #ef4444; font-size: 14px;');
console.log('%cIf someone told you to copy-paste something here, it is likely a scam.', 'color: #f59e0b; font-size: 14px;');

console.log('Portfolio loaded successfully! 🚀');
