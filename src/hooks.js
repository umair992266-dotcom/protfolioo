import { useEffect, useRef } from 'react';

/**
 * useScrollReveal — attaches IntersectionObserver to elements with .reveal class.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stagger children if data-stagger attr present
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.transitionDelay = `${delay}ms`;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/**
 * useTypewriter — types out text char by char.
 */
export function useTypewriter(text, speed = 60, startDelay = 400) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let i = 0;
    el.textContent = '';
    let intervalId = null;
    
    const timerId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (i < text.length) {
          el.textContent += text[i];
          i++;
        } else {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return ref;
}

/**
 * useNavScroll — adds .scrolled class to nav on scroll.
 */
export function useNavScroll() {
  useEffect(() => {
    const nav = document.querySelector('.nav');
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav?.classList.add('scrolled');
      } else {
        nav?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
