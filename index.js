// index.js – all interactive features + smoke background + custom cursor + team modal + service modal

(function() {
  // ---------- SMOKE CANVAS BACKGROUND ----------
  const canvas = document.getElementById('smoke-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    const PARTICLE_COUNT = 80;
    const COLORS = ['rgba(139, 92, 246, 0.15)', 'rgba(236, 72, 153, 0.12)', 'rgba(167, 139, 250, 0.1)'];

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 80 + Math.random() * 120,
          speedX: (Math.random() - 0.5) * 0.2,
          speedY: -0.1 - Math.random() * 0.15,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.x += p.speedX + Math.sin(Date.now() * 0.001 + p.phase) * 0.1;
        p.y += p.speedY + Math.cos(Date.now() * 0.001 + p.phase) * 0.05;
        
        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color.replace('0.15', '0.25').replace('0.12', '0.2').replace('0.1', '0.18'));
        gradient.addColorStop(0.5, p.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();
  }

  // ---------- SCROLL REVEAL ----------
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  reveals.forEach(r => observer.observe(r));

  // ---------- ANIMATED COUNTERS ----------
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.dataset.target;
        let count = 0;
        const update = () => {
          counter.innerText = count;
          if (count < target) {
            count += Math.ceil(target / 50);
            setTimeout(update, 20);
          } else {
            counter.innerText = target;
          }
        };
        update();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ---------- TESTIMONIAL CAROUSEL WITH ARROWS AND AUTO SLIDE ----------
  const carousel = document.getElementById('testimonialCarousel');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-arrow.prev');
  const nextBtn = document.querySelector('.carousel-arrow.next');
  
  let currentIndex = 0;
  let autoSlideInterval;
  const slideIntervalTime = 3000; // 3 seconds

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentIndex = index;
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, slideIntervalTime);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  });

  if (dots.length) {
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        stopAutoSlide();
        startAutoSlide();
      });
    });
  }

  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
  }

  startAutoSlide();

  // ---------- MOBILE MENU TOGGLE ----------
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      alert('Mobile menu would open here. (Add your own implementation)');
    });
  }

  // ---------- PREMIUM CURSOR EFFECT ----------
  (function initCursor() {
    if (!window.matchMedia('(pointer: fine)').matches || 'ontouchstart' in window) {
      document.body.style.cursor = 'auto';
      return;
    }

    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;
    const speed = 0.15;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateOutline() {
      outlineX += (mouseX - outlineX) * speed;
      outlineY += (mouseY - outlineY) * speed;
      cursorOutline.style.left = outlineX + 'px';
      cursorOutline.style.top = outlineY + 'px';
      requestAnimationFrame(animateOutline);
    }
    animateOutline();

    const interactiveElements = document.querySelectorAll(
      'a, button, .btn, input, textarea, .service-card, .pricing-card, .portfolio-item, .blog-card, .case-card, .learn-more, .social-icons i, .team-card, .testimonial-item'
    );
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.8)';
        cursorDot.style.backgroundColor = '#8b5cf6';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hover');
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.backgroundColor = 'white';
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });

    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
  })();

  // ---------- CONTACT FORM HANDLER (Web3Forms) with double-submit prevention ----------
  const contactForm = document.getElementById('contactForm');
  const formContainer = document.getElementById('contactFormContainer');
  const successMessage = document.getElementById('contactSuccessMessage');
  let isSubmitting = false; // flag to prevent double submission

  window.resetContactForm = function() {
    if (formContainer && successMessage) {
      formContainer.classList.remove('hidden');
      successMessage.classList.remove('show');
      contactForm.reset();
      // Re-enable submit button if it was disabled
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message'; // restore original text
      }
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Prevent double submission
      if (isSubmitting) return;
      isSubmitting = true;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send message';

      // Disable button and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Collect form data
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Simple validation (already handled by required fields, but double-check)
      if (!data.name || !data.email || !data.message) {
        alert('Please fill in all required fields (Name, Email, Message).');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
        isSubmitting = false;
        return;
      }

      try {
        // Send to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          console.log('Form submitted successfully:', result);
          // Hide form, show success message
          formContainer.classList.add('hidden');
          successMessage.classList.add('show');
          // Button will be re-enabled when resetContactForm is called
        } else {
          alert('Something went wrong. Please try again later.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Network error. Please check your connection and try again.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      } finally {
        isSubmitting = false;
      }
    });
  }

  // ---------- TEAM MODAL ----------
  const teamCards = document.querySelectorAll('.team-card');
  const modal = document.getElementById('teamModal');
  // 🔧 specifically target the close button inside the team modal
  const modalClose = document.querySelector('#teamModal .modal-close');
  const modalAvatar = document.getElementById('modalAvatar');
  const modalName = document.getElementById('modalName');
  const modalRole = document.getElementById('modalRole');
  const modalBio = document.getElementById('modalBio');
  const modalSocial = document.getElementById('modalSocial');

  const teamData = {
    alex: {
      name: 'Alex Morgan',
      role: 'Founder & CEO',
      bio: 'Alex has over 15 years of experience in digital marketing and brand strategy. He founded Brand Bazar to help businesses unlock their social media potential.',
      social: {
        linkedin: 'https://linkedin.com/in/alexmorgan',
        twitter: 'https://twitter.com/alexmorgan'
      },
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    jamie: {
      name: 'Jamie Lee',
      role: 'Head of Strategy',
      bio: 'Jamie is a former Meta strategist who has planned and executed campaigns for Fortune 500 companies. She ensures every move is data‑backed.',
      social: {
        linkedin: 'https://linkedin.com/in/jamielee',
        twitter: 'https://twitter.com/jamielee'
      },
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    casey: {
      name: 'Casey Park',
      role: 'Creative Director',
      bio: 'Casey brings ideas to life with stunning visuals and storytelling. His work has been featured in Adweek and Communication Arts.',
      social: {
        linkedin: 'https://linkedin.com/in/caseypark',
        twitter: 'https://twitter.com/caseypark'
      },
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    riley: {
      name: 'Riley Smith',
      role: 'Lead Analyst',
      bio: 'Riley turns complex data into actionable insights. He specializes in attribution modelling and conversion rate optimisation.',
      social: {
        linkedin: 'https://linkedin.com/in/rileysmith',
        twitter: 'https://twitter.com/rileysmith'
      },
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    taylor: {
      name: 'Taylor Wong',
      role: 'Content Lead',
      bio: 'Taylor creates scroll‑stopping content that resonates with audiences. She has a knack for viral trends and authentic storytelling.',
      social: {
        linkedin: 'https://linkedin.com/in/taylorwong',
        twitter: 'https://twitter.com/taylorwong'
      },
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    }
  };

  function openModal(memberId) {
    const data = teamData[memberId];
    if (!data) return;

    modalAvatar.src = data.avatar;
    modalAvatar.alt = data.name;
    modalName.textContent = data.name;
    modalRole.textContent = data.role;
    modalBio.textContent = data.bio;

    modalSocial.innerHTML = '';
    for (let [platform, url] of Object.entries(data.social)) {
      const icon = document.createElement('a');
      icon.href = url;
      icon.target = '_blank';
      icon.innerHTML = `<i class="fab fa-${platform}"></i>`;
      modalSocial.appendChild(icon);
    }

    modal.classList.add('show');
  }

  function closeModal() {
    modal.classList.remove('show');
  }

  teamCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.team-social a')) return;
      const memberId = card.dataset.member;
      openModal(memberId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ---------- SERVICE MODAL ----------
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceModal = document.getElementById('serviceModal');
  const serviceClose = document.querySelector('.service-close');
  const serviceIcon = document.getElementById('serviceIcon');
  const serviceName = document.getElementById('serviceName');
  const serviceDescription = document.getElementById('serviceDescription');
  const serviceDetails = document.getElementById('serviceDetails');

  const serviceData = {
    management: {
      name: 'Social Media Management',
      description: 'Full‑service social media management',
      details: 'We handle everything from content scheduling to community engagement. Our team ensures your brand stays active, responsive, and growing across all major platforms. We create tailored strategies to boost your organic reach and build a loyal following.',
      icon: 'fa-chart-line'
    },
    content: {
      name: 'Content Creation',
      description: 'High‑impact video & creative',
      details: 'Our creative team produces scroll‑stopping videos, graphics, and copy that resonate with your target audience. From Reels to TikTok trends, we craft content that drives engagement and reinforces your brand identity.',
      icon: 'fa-pen-fancy'
    },
    ads: {
      name: 'Paid Ads Campaigns',
      description: 'ROAS‑focused advertising',
      details: 'We design and manage data‑driven ad campaigns on Meta, TikTok, and other platforms. Our experts optimize for conversions, ensuring you get the highest return on your ad spend with detailed performance tracking.',
      icon: 'fa-ad'
    },
    influencer: {
      name: 'Influencer Marketing',
      description: 'Strategic influencer partnerships',
      details: 'We connect your brand with the right influencers to build authentic relationships and drive sales. From macro to micro‑influencers, we handle outreach, negotiations, and campaign management.',
      icon: 'fa-star'
    },
    strategy: {
      name: 'Brand Strategy',
      description: 'Positioning & voice development',
      details: 'We help define your brand’s unique voice and market positioning. Through in‑depth research and creative workshops, we develop a roadmap that sets you apart from competitors and resonates with your audience.',
      icon: 'fa-bullseye'
    },
    analytics: {
      name: 'Analytics & Growth Tracking',
      description: 'Actionable insights & reporting',
      details: 'We provide weekly reports and deep‑dive analytics to track your growth. Our team identifies trends, measures ROI, and continuously refines strategies to ensure your social media efforts deliver real business results.',
      icon: 'fa-magnifying-glass-chart'
    }
  };

  function openServiceModal(serviceId) {
    const data = serviceData[serviceId];
    if (!data) return;

    serviceIcon.className = `fas ${data.icon}`;
    serviceName.textContent = data.name;
    serviceDescription.textContent = data.description;
    serviceDetails.textContent = data.details;

    serviceModal.classList.add('show');
  }

  function closeServiceModal() {
    serviceModal.classList.remove('show');
  }

  serviceCards.forEach(card => {
    const learnMoreLink = card.querySelector('.learn-more');
    if (learnMoreLink) {
      learnMoreLink.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceId = card.dataset.service;
        openServiceModal(serviceId);
      });
    }
  });

  if (serviceClose) {
    serviceClose.addEventListener('click', closeServiceModal);
  }

  window.addEventListener('click', (e) => {
    if (e.target === serviceModal) {
      closeServiceModal();
    }
  });
})();
