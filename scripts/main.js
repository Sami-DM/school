/**
 * Main JavaScript for I LO Kopernika website
 * Vanilla JS only - no dependencies
 */

document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchSubmit = document.getElementById('searchSubmit');
    
    if (searchIcon && searchOverlay) {
        // Toggle search overlay
        searchIcon.addEventListener('click', function() {
            searchOverlay.hidden = !searchOverlay.hidden;
            if (!searchOverlay.hidden) {
                searchInput.focus();
            }
        });
        
        // Close search
        searchClose.addEventListener('click', function() {
            searchOverlay.hidden = true;
        });
        
        // Search functionality
        searchSubmit.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchOverlay.hidden && 
                !searchOverlay.contains(e.target) && 
                !searchIcon.contains(e.target)) {
                searchOverlay.hidden = true;
            }
        });
    }
    
    // Simple search function (basic DOM search)
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            alert('Proszę wpisać szukaną frazę');
            return;
        }
        
        // Simple search - highlight matching text
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');
        let found = false;
        
        elements.forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes(query)) {
                found = true;
                // Scroll to first found element
                if (!window.searched) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.searched = true;
                }
                
                // Highlight the element
                const originalHTML = el.innerHTML;
                const regex = new RegExp(`(${query})`, 'gi');
                el.innerHTML = originalHTML.replace(regex, '<mark>$1</mark>');
                
                // Remove highlight after 5 seconds
                setTimeout(() => {
                    el.innerHTML = originalHTML;
                }, 5000);
            }
        });
        
        if (!found) {
            alert('Nie znaleziono wyników dla: ' + query);
        }
        
        searchOverlay.hidden = true;
        window.searched = false;
    }
    
    // Mobile submenu toggle
    const menuItemsWithSubmenu = document.querySelectorAll('.has-submenu > a');
    
    menuItemsWithSubmenu.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
    
    // Close mobile menu when clicking outside
    const menuToggle = document.getElementById('menu-toggle');
    
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            menuToggle && 
            menuToggle.checked &&
            !e.target.closest('.main-nav') && 
            !e.target.closest('.menu-toggle-label')) {
            menuToggle.checked = false;
        }
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Initialize any other functionality
    console.log('I LO Kopernika website loaded successfully');
});
