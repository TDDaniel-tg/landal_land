// Landal Landing Page JavaScript
// Modern vanilla JavaScript with all required functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScroll();
    initScrollAnimations();
    initFormValidation();
    initModalFunctionality();
    initFranchiseForm();
    initCounterAnimations();
    initMobileFeatures();
    initImageScaling();
    initOrientationLock();
});

// Smooth scroll between sections
function initSmoothScroll() {
    // Smooth scroll for scroll indicator
    const scrollButton = document.querySelector('.scroll-button');
    if (scrollButton) {
        scrollButton.addEventListener('click', () => {
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger counter animation for specific elements
                if (entry.target.classList.contains('growth-number') || 
                    entry.target.classList.contains('big-number') ||
                    entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animations
    document.querySelectorAll('.growth-card, .advantage-card, .stat-card, .founder-card').forEach(el => {
        observer.observe(el);
    });
    
    // Only observe offer-block on desktop
    if (window.innerWidth > 768) {
        document.querySelectorAll('.offer-block').forEach(el => {
            observer.observe(el);
        });
    }

    // Observe counter elements
    document.querySelectorAll('.growth-number, .big-number, .stat-number').forEach(el => {
        observer.observe(el);
    });

    // Add CSS for animations (excluding offer-block on mobile)
    const style = document.createElement('style');
    style.textContent = `
        .growth-card, .advantage-card, .stat-card, .founder-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .offer-block {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        @media (max-width: 768px) {
            .offer-block {
                opacity: 1 !important;
                transform: none !important;
                transition: none !important;
            }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .cta-button {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fadeInUp {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(style);
}

// Counter animation
function animateCounter(element) {
    if (element.dataset.animated) return;
    element.dataset.animated = 'true';
    
    const text = element.textContent;
    
    // Skip animation for text ranges like "3-4 года"
    if (text.includes('-') && text.match(/\d+-\d+/)) {
        return;
    }
    
    const number = parseFloat(text.replace(/[^\d.]/g, ''));
    const suffix = text.replace(/[\d.]/g, '');
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const steps = 60;
    const stepValue = number / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
        current += stepValue;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        // Format number based on original format
        let displayValue;
        if (text.includes('.')) {
            displayValue = current.toFixed(1);
        } else if (number >= 1000) {
            displayValue = Math.floor(current).toLocaleString();
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue + suffix;
    }, stepDuration);
}

// Form validation and submission
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Real-time validation
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('input', () => validateField(input));
            input.addEventListener('blur', () => validateField(input));
        });
        
        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                submitForm(form);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Remove existing error styling
    field.classList.remove('error', 'valid');
    
    // Required field validation
    if (!value) {
        isValid = false;
        message = 'Это поле обязательно для заполнения';
    } else {
        // Specific validation based on field type
        switch (field.type) {
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    isValid = false;
                    message = 'Введите корректный номер телефона';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Введите корректный email адрес';
                }
                break;
            case 'text':
                if (field.placeholder.includes('Имя') && value.length < 2) {
                    isValid = false;
                    message = 'Имя должно содержать минимум 2 символа';
                }
                break;
        }
    }
    
    // Apply validation styling
    if (isValid) {
        field.classList.add('valid');
    } else {
        field.classList.add('error');
    }
    
    // Show/hide error message
    showFieldError(field, message);
    
    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message if needed
    if (message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #DC2626;
            font-size: 12px;
            margin-top: 4px;
            animation: slideDown 0.3s ease;
        `;
        field.parentNode.appendChild(errorDiv);
    }
}

function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    const successMessage = form.parentNode.querySelector('.success-message');
    
    // Show loading state
    submitButton.textContent = 'Отправка...';
    submitButton.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        
        // Show success message
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.classList.add('fadeInUp');
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
        
        // Reset form
        form.reset();
        form.querySelectorAll('.valid, .error').forEach(el => {
            el.classList.remove('valid', 'error');
        });
        form.querySelectorAll('.error-message').forEach(el => el.remove());
        
        // Close modal if form is in modal
        const modal = form.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        // Analytics tracking (replace with actual tracking)
        console.log('Form submitted:', data);
        
    }, 2000);
}

// Modal functionality
function initModalFunctionality() {
    const modal = document.getElementById('consultationModal');
    const openButton = document.getElementById('openConsultationForm');
    const closeButton = modal?.querySelector('.close');
    
    if (!modal) return;
    
    // Open modal
    if (openButton) {
        openButton.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Add opening animation
            modal.style.animation = 'fadeIn 0.3s ease';
            modal.querySelector('.modal-content').style.animation = 'slideIn 0.3s ease';
        });
    }
    
    // Close modal
    function closeModal() {
        modal.style.animation = 'fadeOut 0.3s ease';
        modal.querySelector('.modal-content').style.animation = 'slideOut 0.3s ease';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
    
    // Add modal animations CSS
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px) scale(0.9); }
            to { transform: translateY(0) scale(1); }
        }
        
        @keyframes slideOut {
            from { transform: translateY(0) scale(1); }
            to { transform: translateY(-50px) scale(0.9); }
        }
        
        @keyframes slideDown {
            from { 
                opacity: 0; 
                transform: translateY(-10px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        .error {
            border-color: #DC2626 !important;
            background-color: #FEF2F2 !important;
        }
        
        .valid {
            border-color: #10B981 !important;
            background-color: #F0FDF4 !important;
        }
    `;
    document.head.appendChild(modalStyle);
}

// Initialize counter animations for stats
function initCounterAnimations() {
    // Already handled in initScrollAnimations
}

// Mobile-specific features
function initMobileFeatures() {
    // Removed problematic touch swipe handlers that were blocking scroll
    // Touch events are now handled through CSS touch-action properties
    
    // Optimize animations for mobile
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            // Recalculate layouts if needed
            window.scrollTo(0, window.scrollY);
        }, 100);
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Log performance metrics
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Lazy loading for images (basic implementation)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Add error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Add resize handler for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
}, 250));

// Franchise form functionality
function initFranchiseForm() {
    const franchiseForm = document.getElementById('franchiseForm');
    
    if (franchiseForm) {
        franchiseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const inputs = this.querySelectorAll('input');
            const name = inputs[0].value.trim();
            const phone = inputs[1].value.trim();
            const email = inputs[2].value.trim();
            
            // Simple validation
            if (!name || !phone || !email) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            // Show loading state
            const button = this.querySelector('.form-submit-btn');
            const originalText = button.textContent;
            button.textContent = 'Отправляем...';
            button.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Clear form
                inputs.forEach(input => input.value = '');
                
                button.textContent = 'Заявка отправлена!';
                button.style.background = '#5ebe2d';
                button.style.borderColor = '#5ebe2d';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    button.style.borderColor = '';
                }, 3000);
            }, 1000);
        });
    }
}

// PDF Download functionality
function initPdfDownload() {
    const pdfLinks = document.querySelectorAll('a[href*="franchise-presentation.pdf"]');
    
    pdfLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 12l2 2 4-4"></path></svg> Скачивание...';
            this.style.pointerEvents = 'none';
            
            // Simulate download (you can replace this with actual PDF download logic)
            setTimeout(() => {
                // Create a temporary link to trigger download
                const tempLink = document.createElement('a');
                tempLink.href = this.href;
                tempLink.download = 'franchise-presentation.pdf';
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                
                // Restore original state
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
                
                // Show success message
                showNotification('Презентация успешно скачана!', 'success');
            }, 1000);
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#5ebe2d' : '#333'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Image scaling based on zoom level
function initImageScaling() {
    const heroImage = document.querySelector('.hero-image-section img');
    if (!heroImage) return;
    
    let baseWidth = window.innerWidth;
    let currentScale = 1;
    
    // Устанавливаем базовые размеры через CSS переменные (твои новые размеры)
    heroImage.style.setProperty('--base-width', '950px');
    heroImage.style.setProperty('--base-height', '1000px');
    heroImage.style.setProperty('--max-width', '900px');
    heroImage.style.setProperty('--max-height', '1300px');
    
    function updateImageScale() {
        // Простой метод: сравниваем текущую ширину с базовой
        const currentWidth = window.innerWidth;
        const zoomFactor = baseWidth / currentWidth;
        
        // Рассчитываем масштаб изображения исходя из твоих размеров
        let scale = 1;
        let widthMultiplier = 1;
        let heightMultiplier = 1;
        
        if (zoomFactor <= 0.4) { // очень большой зум (250%+)
            scale = 2.2;
            widthMultiplier = 1.4;
            heightMultiplier = 1.6;
        } else if (zoomFactor <= 0.5) { // зум 200%
            scale = 1.8;
            widthMultiplier = 1.3;
            heightMultiplier = 1.4;
        } else if (zoomFactor <= 0.67) { // зум 150%
            scale = 1.5;
            widthMultiplier = 1.2;
            heightMultiplier = 1.3;
        } else if (zoomFactor <= 0.8) { // зум 125%
            scale = 1.25;
            widthMultiplier = 1.1;
            heightMultiplier = 1.15;
        } else if (zoomFactor <= 0.9) { // зум 110%
            scale = 1.1;
            widthMultiplier = 1.05;
            heightMultiplier = 1.05;
        }
        
        // Применяем только если изменился
        if (Math.abs(scale - currentScale) > 0.05) {
            currentScale = scale;
            
            // Рассчитываем новые размеры на основе твоих базовых
            const newWidth = Math.min(950 * widthMultiplier, 900 * heightMultiplier);
            const newHeight = Math.min(1000 * heightMultiplier, 1300 * heightMultiplier);
            
            // Применяем через CSS переменные и transform
            heroImage.style.setProperty('--scale-width', `${newWidth}px`);
            heroImage.style.setProperty('--scale-height', `${newHeight}px`);
            heroImage.style.transform = `translateY(-50%) scale(${scale})`;
            heroImage.style.transformOrigin = 'center right';
            heroImage.style.position = 'absolute';
            heroImage.style.right = '0';
            heroImage.style.top = '50%';
            heroImage.style.zIndex = '2';
            
            console.log(`Zoom: ${Math.round(1/zoomFactor * 100)}%, Scale: ${scale}, Size: ${Math.round(newWidth)}×${Math.round(newHeight)}`);
        }
    }
    
    // ResizeObserver для более точного отслеживания
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            updateImageScale();
        });
        resizeObserver.observe(document.body);
    }
    
    // Дополнительные слушатели
    window.addEventListener('resize', updateImageScale);
    window.addEventListener('load', () => {
        baseWidth = window.innerWidth;
        updateImageScale();
    });
    
    // Отслеживание через визуальный viewport (для мобильных браузеров)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', updateImageScale);
    }
    
    // Инициализация
    setTimeout(() => {
        baseWidth = window.innerWidth;
        updateImageScale();
    }, 100);
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollIndicator();
    initMobileFeatures();
    initCounters();
    initFranchiseForm();
    initPdfDownload();
    initImageScaling();
    initOrientationLock();
});

// Try to lock orientation to portrait on supported browsers and show overlay fallback
function initOrientationLock() {
    const lockOverlay = document.querySelector('.orientation-lock');

    // Attempt Screen Orientation API
    if (screen.orientation && screen.orientation.lock) {
        try {
            screen.orientation.lock('portrait').catch(() => {});
        } catch (e) {}
    }

    const update = () => {
        const isLandscape = window.matchMedia('(orientation: landscape)').matches;
        const isSmall = window.innerWidth <= 1024; // phones/tablets
        if (lockOverlay) {
            lockOverlay.style.display = isLandscape && isSmall ? 'flex' : 'none';
        }
        document.body.style.overflow = isLandscape && isSmall ? 'hidden' : '';
    };

    update();
    window.addEventListener('resize', update);
    if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener?.('change', update);
    }
}

// Show scroll indicator only while hero section is visible
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    const hero = document.querySelector('.hero-section');
    if (!indicator || !hero) return;

    // Start hidden until we know we're in view
    indicator.style.opacity = '0';
    indicator.style.pointerEvents = 'none';

    const show = () => {
        indicator.style.display = 'block';
        // next frame for transition safety
        requestAnimationFrame(() => {
            indicator.style.opacity = '1';
            indicator.style.pointerEvents = 'auto';
        });
    };

    const hide = () => {
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
        // optional: fully remove from layout after fade
        setTimeout(() => {
            if (parseFloat(getComputedStyle(indicator).opacity) === 0) {
                indicator.style.display = 'none';
            }
        }, 200);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
                    show();
                } else {
                    hide();
                }
            });
        },
        {
            threshold: [0, 0.15, 0.5, 1],
            root: null,
            rootMargin: '0px 0px 0px 0px'
        }
    );

    observer.observe(hero);

    // Also react on resize to keep state correct
    window.addEventListener('resize', () => {
        // Force re-check by unobserve/observe
        observer.unobserve(hero);
        observer.observe(hero);
    });
}
