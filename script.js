// 페이지 로드 시 애니메이션 효과
document.addEventListener('DOMContentLoaded', function() {
    // 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 관찰할 요소들
    const animatedElements = document.querySelectorAll('.feature-card, .todo-item, .profile-container');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 체크박스 클릭 이벤트
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // 체크되면 축하 효과
                this.parentElement.style.color = '#a5b4fc';
                this.parentElement.style.fontWeight = '700';
                
                // 축하 애니메이션
                const celebration = document.createElement('div');
                celebration.textContent = '🎉';
                celebration.style.position = 'fixed';
                celebration.style.fontSize = '3rem';
                celebration.style.pointerEvents = 'none';
                celebration.style.zIndex = '9999';
                celebration.style.left = '50%';
                celebration.style.top = '50%';
                celebration.style.transform = 'translate(-50%, -50%)';
                celebration.style.animation = 'celebrate 1s ease-out forwards';
                
                document.body.appendChild(celebration);
                
                setTimeout(() => {
                    celebration.remove();
                }, 1000);
            } else {
                this.parentElement.style.color = '';
                this.parentElement.style.fontWeight = '';
            }
        });
    });

    // 축하 애니메이션 CSS 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebrate {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
            }
            50% {
                transform: translate(-50%, -50%) scale(1.5);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 네비게이션 스크롤 효과
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        }
        
        lastScroll = currentScroll;
    });

    // 마우스 커서 효과 (유니크한 디자인을 위해)
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(99, 102, 241, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.display = 'block';
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // 링크 호버 시 커서 효과
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = 'rgba(236, 72, 153, 0.8)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = 'rgba(99, 102, 241, 0.8)';
        });
    });
});

