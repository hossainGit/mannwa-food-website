// Vanilla JS: render products, filter, modal, menu toggle
(function(){
  // DOM refs
  const grid = document.getElementById('productGrid');
  const pills = document.querySelectorAll('.pill');
  const modal = document.getElementById('productModal');
  const modalContent = modal.querySelector('.modal-content');
  const modalCloseBtns = modal.querySelectorAll('[data-close]');
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  // render
  function renderProducts(list){
    grid.innerHTML = '';
    list.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'product-card';
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.innerHTML = `
        <div class="product-media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
        <div class="card-body">
          <div class="meta">${p.tag}</div>
          <div class="product-title">${p.name}</div>
          <div class="product-sub">${p.subtitle}</div>
        </div>
      `;
      card.addEventListener('click', ()=> openModal(p));
      card.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') openModal(p) });
      grid.appendChild(card);
    });
  }

  // initial render: all
  renderProducts(PRODUCTS);

  // pills filter
  pills.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      pills.forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if(filter === 'all') renderProducts(PRODUCTS);
      else renderProducts(PRODUCTS.filter(x => x.category === filter));
      // announce
      grid.setAttribute('aria-busy','true');
      setTimeout(()=>grid.setAttribute('aria-busy','false'), 200);
    });
  });

  // modal
  function openModal(product){
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    modalContent.innerHTML = `
      <div class="modal-media"><img src="${product.image}" alt="${product.name}"></div>
      <div class="modal-meta">
        <div class="badge">${product.tag}</div>
        <h3>${product.name}</h3>
        <p class="muted">${product.subtitle}</p>
        <p>${product.description}</p>
        <p style="margin-top:12px"><strong>Inquiry:</strong> <a href="mailto:mannwa.food@gmail.com?subject=Inquiry%20about%20${encodeURIComponent(product.name)}">mannwa.food@gmail.com</a><br> • <a href="tel:+">+880 17084 80510</a></p>
      </div>
    `;
    // focus first focusable element
    setTimeout(()=>{
      const close = modal.querySelector('.modal-close');
      if(close) close.focus();
    }, 50);
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = ''; 
  }
  modalCloseBtns.forEach(b => b.addEventListener('click', closeModal));
  modal.addEventListener('click', (e)=>{
    if(e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape') closeModal();
  });

  // nav toggle
  navToggle.addEventListener('click', ()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if(siteNav.style.display === 'block') siteNav.style.display = '';
    else siteNav.style.display = 'block';
  });

  // inquiry form simple handler
  window.submitInquiry = function(e){
    // using mailto fallback: form has action mailto. We try to open mail with subject and body
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const subject = encodeURIComponent('Product inquiry — ' + name);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:mannwa.trading@gmail.com?subject=${subject}&body=${body}`;
    return false;
  }

  // fill year
  document.getElementById('year').textContent = new Date().getFullYear();

})();


/* ---------- Hero carousel JS (append to js/main.js) ---------- */
(function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  const total = slides.length;
  if (total <= 1) return;

  let index = 0;
  const delay = 3000; // ms between slides
  let timer = null;
  let isPaused = false;

  function goTo(i) {
    index = (i + total) % total;
    carousel.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function next() { goTo(index + 1); }

  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => { if (!isPaused) next(); }, delay);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // pause on hover / focus for accessibility
  carousel.addEventListener('mouseenter', () => { isPaused = true; });
  carousel.addEventListener('mouseleave', () => { isPaused = false; });
  carousel.addEventListener('focusin', () => { isPaused = true; });
  carousel.addEventListener('focusout', () => { isPaused = false; });

  // optional: create dots (unobtrusive)
  const dots = document.createElement('div');
  dots.className = 'hero-dots';
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'hero-dot';
    d.type = 'button';
    d.setAttribute('aria-label', `Show slide ${i + 1}`);
    d.addEventListener('click', () => { goTo(i); });
    dots.appendChild(d);
  });
  // attach dots to the hero-image container
  const heroImage = carousel.closest('.hero-image');
  if (heroImage) {
    heroImage.style.position = 'relative';
    heroImage.appendChild(dots);
  }

  function updateDots() {
    const nodeList = dots.querySelectorAll('.hero-dot');
    nodeList.forEach((n, i) => n.classList.toggle('is-active', i === index));
  }

  // init
  goTo(0);
  start();

  // visibility handling (stop when tab not visible)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  // be safe on unload
  window.addEventListener('beforeunload', stop);
})();
