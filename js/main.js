/**
 * main.js — Shared Navigation & Utilities
 * Multiple Disease Prediction System
 * Handles: mobile menu toggle, active page highlighting, scroll animations,
 *          navbar shadow on scroll, and smooth anchor link scrolling.
 */

// Wait for the DOM to be fully loaded before initializing components
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initActiveNav();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
});

/**
 * 1. Mobile Hamburger Menu
 * Toggles the mobile navigation drawer when the hamburger icon is clicked.
 * Closes automatically when any navigation link is clicked.
 */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    // Toggle menu state on hamburger button click
    hamburger.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = navLinks.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking on any navigation link
    const links = navLinks.querySelectorAll('a');
    links.forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside of the navbar
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
}

/**
 * 2. Active Page Highlighting
 * Inspects window.location.pathname and marks the matching nav link with .active
 */
function initActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    if (!navLinks.length) return;

    // Extract current filename from URL (e.g., 'predict.html' or default to 'index.html')
    const currentPath = window.location.pathname;
    let currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    if (!currentFile || currentFile === '') {
        currentFile = 'index.html';
    }

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Clean link href to filename
        const linkFile = href.split('#')[0].split('?')[0].split('/').pop();

        // Check if link points to current page
        const isMatch = (linkFile === currentFile) ||
            (currentFile === 'index.html' && (linkFile === '' || linkFile === 'index.html' || href === '/'));

        if (isMatch) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

/**
 * 3. Scroll Animation Observer
 * Uses IntersectionObserver to trigger fade-in animations on elements with [data-animate]
 * when they enter the viewport (threshold: 0.1).
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    // Fallback for older browsers without IntersectionObserver support
    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach((el) => el.classList.add('animate-fade-in-up'));
        return;
    }

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // triggers when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                // Stop observing once animated so animation doesn't repeat
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el) => observer.observe(el));
}

/**
 * 4. Navbar Shadow on Scroll
 * Adds a '.scrolled' class to the .navbar when the page is scrolled past 50px
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    // Check on scroll and run once initially in case page reloaded scrolled down
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * 5. Smooth Scroll for Anchor Links
 * Enhances in-page anchor links with smooth scroll animation
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            // Ignore placeholder links like href="#"
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                event.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, '', targetId);
                }
            }
        });
    });
}
