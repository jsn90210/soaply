/**
 * SOAPLY Landing Page - Client Interactivity
 * High performance vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. HOW IT WORKS - INTERACTIVE 3-STEP SWITCHER
     ========================================================================== */
  const stepCards = document.querySelectorAll('.step-card');
  const previewStepBadge = document.getElementById('preview-step-badge');
  const previewStepTitle = document.getElementById('preview-step-title');
  const previewStepDesc = document.getElementById('preview-step-desc');
  const previewStepFact = document.getElementById('preview-step-fact');
  const previewProgressFill = document.getElementById('preview-progress-fill');

  const stepDetails = {
    1: {
      badge: 'Steg 1 av 3',
      title: 'Fyll på med 300 ml kranvatten',
      desc: 'Använd vanligt ljummet vatten direkt från badrumskranen upp till flaskans markering. Du slipper betala för att frakta 90% vatten över landet i plastflaskor.',
      fact: 'Vanlig flytande handtvål i butik består till nio tiondelar av vanligt vatten i engångsplast.',
      progress: '33.3%'
    },
    2: {
      badge: 'Steg 2 av 3',
      title: 'Släpp ner 1 SOAPLY-tablett',
      desc: 'Lägg i en tablett i flaskan. Den brusar igång direkt och löses upp på bara 3–5 minuter utan att du behöver skaka kraftigt eller vänta i 40 minuter.',
      fact: 'Tabletten innehåller dermatologiskt testade växttensider och vårdande glycerin.',
      progress: '66.6%'
    },
    3: {
      badge: 'Steg 3 av 3',
      title: 'Tvätta händerna med SOAPLY',
      desc: 'När tabletten har lösts upp, skruva på pumpen. Dosera skumtvålen i fuktiga händer, tvätta noggrant och skölj med vatten. Fyll på samma flaska när tvålen tar slut.',
      fact: 'Skumtvål använder mindre vätska per tvätt vilket sparar både pengar och miljö.',
      progress: '100%'
    }
  };

  stepCards.forEach(card => {
    card.addEventListener('click', () => {
      const stepNumber = card.getAttribute('data-step');
      
      // Update active states
      stepCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      // Update preview card
      if (stepDetails[stepNumber]) {
        const data = stepDetails[stepNumber];
        previewStepBadge.textContent = data.badge;
        previewStepTitle.textContent = data.title;
        previewStepDesc.textContent = data.desc;
        previewStepFact.textContent = data.fact;
        previewProgressFill.style.width = data.progress;
      }
    });
  });

  // Auto-rotate steps every 6 seconds if user hasn't clicked
  let autoStepIndex = 1;
  let userInteracted = false;
  stepCards.forEach(c => c.addEventListener('click', () => { userInteracted = true; }));

  setInterval(() => {
    if (!userInteracted) {
      autoStepIndex = autoStepIndex >= 3 ? 1 : autoStepIndex + 1;
      const targetCard = document.getElementById(`step-card-${autoStepIndex}`);
      if (targetCard) targetCard.click();
    }
  }, 7000);


  /* ==========================================================================
     2. SUSTAINABILITY & SAVINGS CALCULATOR
     ========================================================================== */
  const peopleSlider = document.getElementById('calc-people-slider');
  const peopleDisplay = document.getElementById('calc-people-display');
  const plasticSavedEl = document.getElementById('calc-plastic-saved');
  const waterSavedEl = document.getElementById('calc-water-saved');
  const moneySavedEl = document.getElementById('calc-money-saved');

  function updateCalculator(people) {
    const p = parseInt(people, 10);
    peopleDisplay.textContent = p >= 6 ? '6+ personer' : `${p} ${p === 1 ? 'person' : 'personer'}`;

    // Calculation formulas based on research data
    // Avg person uses ~6 bottles (300ml) liquid soap per year
    const bottlesPerYear = p * 6;
    const kgWaterTransport = (bottlesPerYear * 0.3).toFixed(1).replace('.', ',');
    // Average saving per person per year in household: ~115 kr
    const krSaved = p * 115;

    plasticSavedEl.textContent = `${bottlesPerYear} st`;
    waterSavedEl.textContent = `${kgWaterTransport} kg`;
    moneySavedEl.textContent = `${krSaved} kr`;
  }

  if (peopleSlider) {
    peopleSlider.addEventListener('input', (e) => {
      updateCalculator(e.target.value);
    });
  }


  /* ==========================================================================
     3. PRODUCT CONFIGURATOR (Color & Scent)
     ========================================================================== */
  const colorSwatches = document.querySelectorAll('.swatch-btn');
  const selectedColorLabel = document.getElementById('selected-color-label');
  let selectedBottleColor = document.querySelector('.swatch-btn.active')?.getAttribute('data-color') || 'Pine Green';

  colorSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      colorSwatches.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedBottleColor = btn.getAttribute('data-color');
      if (selectedColorLabel) {
        selectedColorLabel.textContent = selectedBottleColor;
      }
      showToast(`Vald flaskfärg: ${selectedBottleColor}`);
    });
  });


  /* ==========================================================================
     4. SHOPPING CART STATE & SLIDEOUT DRAWER
     ========================================================================== */
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartTrigger = document.getElementById('cart-trigger');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Initial Cart State
  let cart = [
    {
      id: 'starter-kit',
      name: 'SOAPLY Startpaket',
      price: 199,
      quantity: 1,
      variant: 'Pine Green • Ocean Breeze & Sensitiv Trio'
    }
  ];

  function openCart() {
    cartDrawer.classList.add('active');
    cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadgeCount.textContent = totalItems;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-secondary);">
          <p style="font-size: 2.5rem; margin-bottom: 0.5rem;">🛍️</p>
          <h4 style="font-size: 1.15rem; margin-bottom: 0.5rem;">Din varukorg är tom</h4>
          <p style="font-size: 0.875rem; margin-bottom: 1.5rem;">Upptäck vårt startpaket och gör badrummet plastfritt.</p>
          <a href="#products" class="btn btn-primary btn-sm" onclick="document.getElementById('cart-close-btn').click();">Välj produkt</a>
        </div>
      `;
      cartSubtotalEl.textContent = '0 kr';
      cartTotalEl.textContent = '0 kr';
      return;
    }

    let subtotal = 0;
    cartItemsContainer.innerHTML = cart.map((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-meta">${item.variant}</div>
            <div class="cart-item-price">${itemTotal} kr</div>
            <div class="cart-qty-ctrls">
              <button class="qty-btn dec-qty" data-index="${index}">-</button>
              <span style="font-size: 0.875rem; font-weight: 600;">${item.quantity}</span>
              <button class="qty-btn inc-qty" data-index="${index}">+</button>
              <button class="cart-item-remove" data-index="${index}">Ta bort</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    cartSubtotalEl.textContent = `${subtotal} kr`;
    cartTotalEl.textContent = `${subtotal} kr`;

    // Bind quantity and remove events
    document.querySelectorAll('.dec-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        if (cart[idx].quantity > 1) {
          cart[idx].quantity--;
        } else {
          cart.splice(idx, 1);
        }
        renderCart();
      });
    });

    document.querySelectorAll('.inc-qty').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        cart[idx].quantity++;
        renderCart();
      });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        cart.splice(idx, 1);
        renderCart();
        showToast('Produkten togs bort från varukorgen');
      });
    });
  }

  // Add to Cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);

      let variant = '';
      if (id === 'starter-kit') {
        const scentRadio = document.querySelector('input[name="starter-scent"]:checked');
        const scentVal = scentRadio ? scentRadio.value.split(' (')[0] : 'Signatur Trio';
        variant = `${selectedBottleColor} • ${scentVal}`;
      } else if (id === 'refill-6') {
        const sel = document.getElementById('refill-6-scent');
        variant = sel ? sel.value : 'Mixpaket';
      } else if (id === 'refill-18') {
        const sel = document.getElementById('refill-18-scent');
        variant = sel ? sel.value : 'Familjemix';
      }

      // Check if already in cart
      const existing = cart.find(i => i.id === id && i.variant === variant);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ id, name, price, quantity: 1, variant });
      }

      renderCart();
      openCart();
      showToast(`Tillagd: ${name}`);
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showToast('🚀 Omdirigerar till säker Klarna / Swish kassa...');
    });
  }

  // Initial cart render
  renderCart();


  /* ==========================================================================
     5. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add('open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* ==========================================================================
     6. MOBILE MENU
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ==========================================================================
     7. B2B MODAL
     ========================================================================== */
  const openB2bBtn = document.getElementById('open-b2b-modal-btn');
  const b2bModal = document.getElementById('b2b-modal');
  const b2bBackdrop = document.getElementById('b2b-modal-backdrop');
  const b2bCloseBtn = document.getElementById('b2b-close-btn');
  const b2bForm = document.getElementById('b2b-form');
  const b2bFeedback = document.getElementById('b2b-feedback');

  function openB2bModal() {
    b2bModal.classList.add('active');
    b2bBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeB2bModal() {
    b2bModal.classList.remove('active');
    b2bBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openB2bBtn) openB2bBtn.addEventListener('click', openB2bModal);
  if (b2bCloseBtn) b2bCloseBtn.addEventListener('click', closeB2bModal);
  if (b2bBackdrop) b2bBackdrop.addEventListener('click', closeB2bModal);

  if (b2bForm) {
    b2bForm.addEventListener('submit', (e) => {
      e.preventDefault();
      b2bFeedback.textContent = 'Tack för er förfrågan! Vår B2B-ansvarige återkommer inom 24 timmar.';
      b2bForm.reset();
      setTimeout(closeB2bModal, 3000);
      showToast('Offertförfrågan skickad!');
    });
  }


  /* ==========================================================================
     8. NEWSLETTER FORM
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterFeedback.textContent = 'Tack! Använd rabattkoden VARDAGSLUGN10 i kassan för 10% rabatt.';
      newsletterForm.reset();
      showToast('Rabattkod genererad: VARDAGSLUGN10');
    });
  }


  /* ==========================================================================
     9. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }


  /* ==========================================================================
     10. MÖRKT LÄGE
     Slår på och av klassen "morkt" på body. Färgerna byts i styles.css.
     ========================================================================== */
  const temaKnapp = document.getElementById('tema');

  function vaxlaTema() {
    const arMorkt = document.body.classList.toggle('morkt');

    // Knappen visar vilket läge man byter TILL
    temaKnapp.textContent = arMorkt ? 'Ljust läge' : 'Mörkt läge';
    temaKnapp.setAttribute('aria-pressed', arMorkt ? 'true' : 'false');
  }

  if (temaKnapp) {
    temaKnapp.addEventListener('click', vaxlaTema);
  }

});
