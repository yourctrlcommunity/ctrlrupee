// Add this to your script.js

document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('theme-toggle');
  const body = document.body;
  // Set default theme to dark if not set
  if (!localStorage.getItem('theme')) {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
    if (toggle) toggle.textContent = '\u2600\ufe0f';
  } else if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (toggle) toggle.textContent = '\u2600\ufe0f';
  } else {
    body.classList.remove('dark-mode');
    if (toggle) toggle.textContent = '\ud83c\udf19';
  }
  toggle.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      toggle.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    } else {
      toggle.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    }
  });

  // Phone timer and QR logic
  const startBtn = document.getElementById('startNowBtn');
  const timer = document.getElementById('timer');
  const qrSection = document.getElementById('qrSection');
  const phoneInner = document.querySelector('.phone-inner');
  let countdown;

  // Add girl.png as a full background when Start Now button is visible
  if (phoneInner && startBtn) {
    // Create the image element
    const girlImg = document.createElement('img');
    girlImg.src = 'girl.png';
    girlImg.alt = 'Girl';
    girlImg.className = 'girl-img';

    // Style for full coverage
    girlImg.style.position = 'absolute';
    girlImg.style.top = '0';
    girlImg.style.left = '0';
    girlImg.style.width = '100%';
    girlImg.style.height = '100%';
    girlImg.style.objectFit = 'cover';
    girlImg.style.zIndex = '1';

    // Style the button for overlay
    startBtn.style.position = 'absolute';
    startBtn.style.top = '50%';
    startBtn.style.left = '50%';
    startBtn.style.transform = 'translate(-50%, -50%)';
    startBtn.style.zIndex = '2';

    // Make phoneInner relative for absolute children
    phoneInner.style.position = 'relative';

    // Insert image as the first child
    phoneInner.insertBefore(girlImg, phoneInner.firstChild);

    startBtn.addEventListener('click', function () {
      // Remove the image when timer starts
      if (girlImg.parentNode) {
        girlImg.parentNode.removeChild(girlImg);
      }
      startBtn.style.display = 'none';
      timer.style.display = 'block';
      let timeLeft = 30;
      timer.textContent = timeLeft;
      countdown = setInterval(() => {
        timeLeft--;
        timer.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(countdown);
          timer.style.display = 'none';
          qrSection.style.display = 'flex';
        }
      }, 1000);
    });
  }

  let budgetData = null;

  // Load the JSON data once when the page loads
  fetch('budgets.json')
    .then(response => response.json())
    .then(data => { budgetData = data; });

  function getRandomMessage(userType, daily) {
    if (!budgetData) return '';
    const ranges = budgetData[userType] || [];
    for (const rangeObj of ranges) {
      if (daily >= rangeObj.range[0] && daily <= rangeObj.range[1]) {
        const msgs = rangeObj.messages;
        return msgs[Math.floor(Math.random() * msgs.length)];
      }
    }
    return '';
  }

  // Only add budget form logic if the form exists (prevents errors on blog page)
  const budgetForm = document.getElementById("budget-form");
  if (budgetForm) {
    budgetForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const amount = parseFloat(document.getElementById("budget-amount").value);
      const type = document.getElementById("budget-type").value;
      const userType = document.getElementById("user-type").value;

      let daily, weekly, monthly;

      if (type === "daily") {
        daily = amount;
        weekly = amount * 7;
        monthly = amount * 30;
      } else if (type === "weekly") {
        weekly = amount;
        daily = amount / 7;
        monthly = amount * (30 / 7);
      } else if (type === "monthly") {
        monthly = amount;
        daily = amount / 30;
        weekly = amount / 30 * 7;
      }

      // Round to 2 decimals
      daily = parseFloat(daily.toFixed(2));
      weekly = weekly.toFixed(2);
      monthly = monthly.toFixed(2);

      document.getElementById("daily-budget").innerText = `💡 Daily Budget: ₹${daily}`;
      document.getElementById("weekly-budget").innerText = `📆 Weekly Budget: ₹${weekly}`;
      document.getElementById("monthly-budget").innerText = `📅 Monthly Budget: ₹${monthly}`;

      // Show one random message from the correct range
      const fun = getRandomMessage(userType, daily);
      document.getElementById("fun-lines").innerHTML = fun ? `<p>${fun}</p>` : '';

      document.getElementById("result-section").style.display = "block";
    });
  }

  const budgetCalc = document.querySelector('.budget-calc');

  window.addEventListener('scroll', () => {
    if (!budgetCalc) return;
    const rect = budgetCalc.getBoundingClientRect();
    // Hide only when the entire calculator is above the viewport
    if (rect.bottom < 0) {
      budgetCalc.classList.add('hide-flip');
    } else {
      budgetCalc.classList.remove('hide-flip');
    }
  });

  const upcomingFeatures = [
    {
      emoji: "🎯",
      title: "Set savings or spending goals"
    },
    {
      emoji: "⏰",
      title: "Weekly and monthly reminders"
    },
    {
      emoji: "📤",
      title: "Expense export (PDF/CSV)"
    },
    {
      emoji: "🔓",
      title: "Unlock with PIN or fingerprint"
    },
    {
      emoji: "📈",
      title: "Charts to visualize your growth"
    },
    {
      emoji: "🏆",
      title: "Rewards for no-spend streaks"
    }
  ];

  const upcomingCard = document.getElementById('upcomingFeatureCard');
  let featureInterval = null;
  let featureIndex = 0;
  let originalContent = '';
  if (upcomingCard) {
    originalContent = upcomingCard.innerHTML;
  function showUpcomingFeature(idx) {
    const f = upcomingFeatures[idx];
    upcomingCard.innerHTML = `<span class="feature-emoji">${f.emoji}</span><h3>${f.title}</h3>`;
  }
  function startFeatureCycle() {
    featureIndex = 0;
    showUpcomingFeature(featureIndex);
    featureInterval = setInterval(() => {
      featureIndex = (featureIndex + 1) % upcomingFeatures.length;
      showUpcomingFeature(featureIndex);
    }, 1800);
  }
  function stopFeatureCycle() {
    clearInterval(featureInterval);
    upcomingCard.innerHTML = originalContent;
  }
  upcomingCard.addEventListener('mouseenter', startFeatureCycle);
  upcomingCard.addEventListener('focus', startFeatureCycle);
  upcomingCard.addEventListener('mouseleave', stopFeatureCycle);
  upcomingCard.addEventListener('blur', stopFeatureCycle);
  }

  // Contact Modal Logic
  const contactModal = document.getElementById('contact-modal');
  const contactModalClose = document.getElementById('contact-modal-close');
  const navContactBtn = document.getElementById('nav-contact-btn');
  const footerContactLink = document.getElementById('footer-contact-link');

  if ((navContactBtn || footerContactLink) && contactModal && contactModalClose) {
    const openContactModal = function(e) {
      e.preventDefault();
      contactModal.style.display = 'flex';
    };
    if (navContactBtn) navContactBtn.addEventListener('click', openContactModal);
    if (footerContactLink) footerContactLink.addEventListener('click', openContactModal);
    contactModalClose.addEventListener('click', function() {
      contactModal.style.display = 'none';
    });
    contactModal.addEventListener('click', function(e) {
      if (e.target === contactModal) {
        contactModal.style.display = 'none';
      }
    });
  }

  // Services Modal Logic
  const servicesModal = document.getElementById('services-modal');
  const servicesModalClose = document.getElementById('services-modal-close');
  const servicesModalLogo = document.getElementById('services-modal-logo');
  const navServicesBtn = document.getElementById('nav-services-btn');

  if (navServicesBtn && servicesModal && servicesModalClose && servicesModalLogo) {
    navServicesBtn.addEventListener('click', function(e) {
      e.preventDefault();
      servicesModal.style.display = 'flex';
    });
    servicesModalClose.addEventListener('click', function() {
      servicesModal.style.display = 'none';
    });
    servicesModal.addEventListener('click', function(e) {
      if (e.target === servicesModal) {
        servicesModal.style.display = 'none';
      }
    });
    servicesModalLogo.addEventListener('click', function() {
      servicesModal.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Features button logic (nav and footer)
  function handleFeaturesClick(e) {
    // If already on index.html, scroll to features section
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '/CTRLRUPEE/' || window.location.pathname.endsWith('/CTRLRUPEE/index.html')) {
      e.preventDefault();
      const featuresSection = document.querySelector('.features-section, #features, .features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on blog.html or any other page, go to index.html#features
      window.location.href = 'index.html#features';
    }
  }

  // Attach to nav and footer Features links
  function setupFeaturesLinks() {
    // Navigation
    const navLinks = document.querySelectorAll('.navigation a[href="#features"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleFeaturesClick);
    });
    // Footer
    const footerLinks = document.querySelectorAll('.footer-links a[href="#features"]');
    footerLinks.forEach(link => {
      link.addEventListener('click', handleFeaturesClick);
    });
  }
  setupFeaturesLinks();

  // Features tab switching logic
  document.querySelectorAll('.features-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.features-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(this.getAttribute('aria-controls')).classList.add('active');
    });
  });

  // Hamburger menu logic for mobile nav
  const navHamburger = document.getElementById('nav-hamburger');
  const navigation = document.querySelector('.navigation');
  const navLinks = navigation ? navigation.querySelectorAll('ul li a, ul li button') : [];

  if (navHamburger && navigation) {
    // navHamburger.style.display = 'block';
    navHamburger.addEventListener('click', function () {
      navigation.classList.toggle('open');
    });
    // Close menu when a link or button is tapped (on mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 700) {
          navigation.classList.remove('open');
        }
      });
    });
    
    // Close menu when clicking outside navigation
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navigation.contains(event.target);
      const isClickOnHamburger = navHamburger.contains(event.target);
      
      if (!isClickInsideNav && !isClickOnHamburger && navigation.classList.contains('open')) {
        navigation.classList.remove('open');
      }
    });
  }

  // --- Firebase Analytics for Download Now button clicks ---
  // Only run if running in a browser that supports ES modules (modern browsers)
  (async function() {
    try {
      // Dynamically import Firebase only if not already loaded
      if (!window.firebaseAppInitialized) {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js');
        const { getAnalytics, logEvent } = await import('https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js');
        const firebaseConfig = {
          apiKey: "AIzaSyDx7Clpx2AoAXPrJpaL8vSmrFbZ4syF61M",
          authDomain: "ctrlrupee-20412.firebaseapp.com",
          projectId: "ctrlrupee-20412",
          storageBucket: "ctrlrupee-20412.firebasestorage.app",
          messagingSenderId: "496761547196",
          appId: "1:496761547196:web:628123f5ddf317f0e7e3b9",
          measurementId: "G-Y7X8F8GQ6W"
        };
        const app = initializeApp(firebaseConfig);
        window.analytics = getAnalytics(app);
        window.logFirebaseEvent = logEvent;
        window.firebaseAppInitialized = true;
      }
    } catch (e) {
      // Firebase may not work on file:// protocol or in some browsers
      console.warn('Firebase Analytics not initialized:', e);
    }
  })();

  // Helper to log download click
  function logDownloadClick() {
    if (window.logFirebaseEvent && window.analytics) {
      window.logFirebaseEvent(window.analytics, 'download_now_click');
    }
  }

  // Attach click listeners to all Download Now buttons (banner and footer)
  function setupDownloadNowTracking() {
    // Banner button
    const bannerBtn = document.querySelector('.download-btn');
    if (bannerBtn) {
      bannerBtn.addEventListener('click', logDownloadClick);
    }
    // Footer button (if present)
    // Try to find a footer link with text 'Download' (case-insensitive)
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
      if (link.textContent.trim().toLowerCase() === 'download') {
        link.addEventListener('click', logDownloadClick);
      }
    });
  }
  setupDownloadNowTracking();
});