// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormHandling();
    initMobileMenu();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    window.addEventListener('scroll', () => {
        highlightActiveNavItem();
    });
}

// Highlight active navigation item
function highlightActiveNavItem() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item, .about-text, .about-image, .location-item, .contact-item, .contact-form');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.bg-circle');
        
        parallaxElements.forEach((el, index) => {
            const speed = (index + 1) * 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Initialize animations
function initAnimations() {
    // Add CSS classes for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .menu-item,
        .about-text,
        .about-image,
        .location-item,
        .contact-item,
        .contact-form {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }
        
        .animate-in.menu-item,
        .animate-in.about-text,
        .animate-in.about-image,
        .animate-in.location-item,
        .animate-in.contact-item,
        .animate-in.contact-form {
            opacity: 1;
            transform: translateY(0);
        }
        
        .navbar.scrolled {
            background: rgba(26, 26, 26, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }
        
        .nav-menu a.active {
            color: #ffc107;
        }
        
        .nav-menu a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Counter animation for stats
    animateCounters();
}

// Counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = parseInt(target.textContent.replace(/\D/g, ''));
                const suffix = target.textContent.replace(/\d/g, '');
                
                animateNumber(target, 0, finalNumber, suffix, 2000);
                observer.unobserve(target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateNumber(element, start, end, suffix, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Order buttons
    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', handleOrderClick);
    });
    
    // CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', handleCTAClick);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleOrderClick(e) {
    const menuItem = e.target.closest('.menu-item');
    const itemName = menuItem.querySelector('h3').textContent;
    
    // Simulate order process
    showNotification(`${itemName} adicionado ao carrinho!`, 'success');
    
    // You can integrate with WhatsApp or delivery platform here
    // Example: redirect to WhatsApp
    const whatsappNumber = '5511999999999';
    const message = `Olá! Gostaria de pedir um ${itemName}.`;
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
    }, 1000);
}

function handleCTAClick() {
    // Scroll to menu section
    const menuSection = document.querySelector('#menu');
    if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Add mobile menu styles
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            @media (max-width: 768px) {
                .nav-menu {
                    position: fixed;
                    left: -100%;
                    top: 70px;
                    flex-direction: column;
                    background-color: rgba(26, 26, 26, 0.98);
                    width: 100%;
                    text-align: center;
                    transition: 0.3s;
                    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
                    backdrop-filter: blur(10px);
                    padding: 2rem 0;
                }
                
                .nav-menu.active {
                    left: 0;
                }
                
                .nav-menu li {
                    margin: 1rem 0;
                }
                
                .hamburger.active span:nth-child(1) {
                    transform: rotate(-45deg) translate(-5px, 6px);
                }
                
                .hamburger.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .hamburger.active span:nth-child(3) {
                    transform: rotate(45deg) translate(-5px, -6px);
                }
            }
        `;
        document.head.appendChild(mobileStyles);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const notificationStyles = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #28a745, #20c997)' : 'linear-gradient(45deg, #ffc107, #ff8f00)'};
        color: ${type === 'success' ? '#fff' : '#1a1a1a'};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.style.cssText = notificationStyles;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Social media links functionality
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.nav-social a, .footer-social a, .social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = getPlatformFromLink(link);
            const url = getSocialMediaURL(platform);
            
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

function getPlatformFromLink(link) {
    const icon = link.querySelector('i');
    if (icon.classList.contains('fa-instagram')) return 'instagram';
    if (icon.classList.contains('fa-facebook')) return 'facebook';
    if (icon.classList.contains('fa-whatsapp')) return 'whatsapp';
    if (icon.classList.contains('fa-twitter')) return 'twitter';
    return null;
}

function getSocialMediaURL(platform) {
    const urls = {
        instagram: 'https://instagram.com/zero7hamburgueria',
        facebook: 'https://facebook.com/zero7hamburgueria',
        whatsapp: 'https://wa.me/5511999999999',
        twitter: 'https://twitter.com/zero7hamburgueria'
    };
    
    return urls[platform] || null;
}

// Initialize social links after DOM is loaded
document.addEventListener('DOMContentLoaded', initSocialLinks);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    });
    
    // Preload critical images
    const criticalImages = [
        'assets/logo.png'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    optimizePerformance();
    initLazyLoading();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Funções para os botões do mapa
function openGoogleMaps() {
    const address = "Rua das Hamburguerias, 123, Centro, São Paulo, SP";
    const url = `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}

function openWaze() {
    const address = "Rua das Hamburguerias, 123, Centro, São Paulo, SP";
    const url = `https://waze.com/ul?q=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
}

// Função para inicializar a seção de localização
function initLocationSection() {
    // Adicionar efeitos de hover aos landmarks
    const landmarks = document.querySelectorAll('.landmark');
    landmarks.forEach(landmark => {
        landmark.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        landmark.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Adicionar efeito de pulso ao pin do mapa
    const mapPin = document.querySelector('.map-pin');
    if (mapPin) {
        setInterval(() => {
            mapPin.style.animation = 'none';
            setTimeout(() => {
                mapPin.style.animation = 'bounce 2s infinite';
            }, 50);
        }, 5000);
    }
    
    // Observer para animações dos itens de localização
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });
    
    // Observar todos os itens de localização
    const locationItems = document.querySelectorAll('.location-item');
    locationItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
    
    // Observar o mapa interativo
    const interactiveMap = document.querySelector('.interactive-map');
    if (interactiveMap) {
        interactiveMap.style.opacity = '0';
        interactiveMap.style.transform = 'translateY(30px)';
        interactiveMap.style.transition = 'all 0.8s ease';
        observer.observe(interactiveMap);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que todos os elementos estejam carregados
    setTimeout(initLocationSection, 100);
});

// Função para copiar endereço
function copyAddress() {
    const address = "Rua das Hamburguerias, 123 - Centro, São Paulo, SP - CEP: 01234-567";
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(address).then(() => {
            showLocationNotification('Endereço copiado para a área de transferência!', 'success');
        }).catch(() => {
            fallbackCopyAddress(address);
        });
    } else {
        fallbackCopyAddress(address);
    }
}

// Função alternativa para copiar endereço
function fallbackCopyAddress(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showLocationNotification('Endereço copiado para a área de transferência!', 'success');
    } catch (err) {
        showLocationNotification('Erro ao copiar endereço', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Sistema de notificações específico para localização
function showLocationNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `location-notification location-notification-${type}`;
    notification.textContent = message;
    
    const styles = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #28a745, #20c997)' : 
                   type === 'error' ? 'linear-gradient(45deg, #dc3545, #c82333)' : 
                   'linear-gradient(45deg, #ffc107, #ff8f00)'};
        color: ${type === 'error' ? '#fff' : type === 'success' ? '#fff' : '#1a1a1a'};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-size: 0.9rem;
    `;
    
    notification.style.cssText = styles;
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animação de saída e remoção
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}