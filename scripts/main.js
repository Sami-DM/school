/**
 * Main JavaScript for I LO Kopernika website
 * Vanilla JS only - no dependencies
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle-label');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        // Add close button to mobile menu
        const menuClose = document.createElement('button');
        menuClose.className = 'menu-close';
        menuClose.innerHTML = '✕';
        menuClose.setAttribute('aria-label', 'Zamknij menu');
        mainNav.appendChild(menuClose);
        
        // Toggle menu when burger icon is clicked
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when close button is clicked
        menuClose.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close menu when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                mainNav.classList.contains('active') &&
                !e.target.closest('.main-nav') && 
                !e.target.closest('.menu-toggle-label')) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Mobile submenu toggle
        const submenuParents = document.querySelectorAll('.has-submenu > a');
        submenuParents.forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = this.parentElement;
                    parent.classList.toggle('active');
                    
                    // Закрываем другие открытые подменю
                    document.querySelectorAll('.has-submenu').forEach(otherParent => {
                        if (otherParent !== parent) {
                            otherParent.classList.remove('active');
                        }
                    });
                }
            });
        });
        
        // Close mobile submenus when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !e.target.closest('.has-submenu') &&
                !e.target.closest('.menu-toggle-label')) {
                document.querySelectorAll('.has-submenu').forEach(parent => {
                    parent.classList.remove('active');
                });
            }
        });
    }
    
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
        
        if (searchSubmit) {
            searchSubmit.addEventListener('click', performSearch);
        }
        
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
        
        // Close search when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchOverlay.hidden && 
                searchOverlay && 
                !searchOverlay.contains(e.target) && 
                !searchIcon.contains(e.target)) {
                searchOverlay.hidden = true;
            }
        });
    }
    
    // News Filter functionality (for aktualnosci.html)
    const newsFilter = document.getElementById('newsFilter');
    if (newsFilter) {
        newsFilter.addEventListener('change', function() {
            const selectedMonth = this.value;
            const newsItems = document.querySelectorAll('.news-list-item');
            
            newsItems.forEach(item => {
                if (selectedMonth === 'all' || item.getAttribute('data-month') === selectedMonth) {
                    item.classList.remove('news-hidden');
                } else {
                    item.classList.add('news-hidden');
                }
            });
        });
    }
    
    // Add smooth scrolling for anchor links (including hash links to sections)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                let targetElement;
                
                // Если ссылка ведет на якорь на той же странице
                if (targetId) {
                    targetElement = document.getElementById(targetId);
                }
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Закрываем мобильное меню после клика
                    if (window.innerWidth <= 768 && mainNav && mainNav.classList.contains('active')) {
                        menuToggle.classList.remove('active');
                        mainNav.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            }
        });
    });
    
    // Handle links to sections on other pages
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Если ссылка ведет на якорь на другой странице
            if (href.includes('#') && !href.startsWith(window.location.pathname)) {
                // Разрешаем стандартное поведение - переход на другую страницу
                // Браузер сам обработает переход и скролл к якорю
                return;
            }
        });
    });
    
    // Initialize any other functionality
    console.log('I LO Kopernika website loaded successfully');
});

// Timetable functionality
function showTimetable(className) {
    // Remove active class from all buttons
    document.querySelectorAll('.btn-class').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update title
    document.getElementById('timetableTitle').textContent = `Plan lekcji: Klasa ${className}`;
    
    // Hide all timetables
    document.querySelectorAll('.timetable-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Show selected timetable (in real implementation, you would have separate containers)
    // For demo, we'll just show the first one
    const selectedTimetable = document.getElementById(`timetable-${className}`);
    if (selectedTimetable) {
        selectedTimetable.classList.add('active');
    } else {
        // If timetable doesn't exist, show the first one
        document.querySelector('.timetable-container').classList.add('active');
    }
    
    // Scroll to timetable
    document.getElementById('timetableTitle').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}
