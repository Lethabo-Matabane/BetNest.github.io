/* services.js - accordions, price calculator, and game-card lightbox interactions */

document.addEventListener('DOMContentLoaded', () => {
  // --- ACCORDIONS ---
  document.querySelectorAll('.accordion-head').forEach(head => {
    const panel = head.nextElementSibling;
    head.setAttribute('aria-expanded', 'false');
    head.addEventListener('click', () => {
      const expanded = head.getAttribute('aria-expanded') === 'true';
      head.setAttribute('aria-expanded', String(!expanded));
      if(!expanded){
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = null;
      }
    });
  });

  // --- PRICE CALCULATOR ---
  const form = document.getElementById('priceCalculator');
  if(form){
    const priceMap = { 'pc':20, 'ps4':25, 'ps5':35 };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const platform = form.platform.value;
      const hours = Math.max(1, Math.min(8, parseInt(form.hours.value || '1', 10)));
      const price = (priceMap[platform] || 0) * hours;
      const res = document.getElementById('calcResult');
      if(res) res.textContent = `Estimated price: R${price.toFixed(2)}`;
    });
  }

  // --- GAME CARD LIGHTBOX ---
  // Create a lightbox when a card is clicked (image + title).
  function openLightbox(title, imgSrc, altText){
    // prevent duplicates
    if(document.querySelector('.lightbox-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="${title} preview">
        <div class="lightbox-inner">
          <img src="${imgSrc}" alt="${altText || title}">
          <h3>${title}</h3>
          <button class="close-btn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // close handlers
    overlay.addEventListener('click', (e) => {
      if(e.target === overlay) overlay.remove();
    });
    overlay.querySelector('.close-btn').addEventListener('click', () => overlay.remove());

    // keyboard escape to close
    const onKey = (ev) => {
      if(ev.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);
  }

  // Attach click and keyboard handlers to all cards
  document.querySelectorAll('.game-card').forEach(card => {
    const img = card.querySelector('img');
    const title = card.getAttribute('data-title') || (card.querySelector('h4') ? card.querySelector('h4').textContent : 'Preview');
    const imgSrc = card.getAttribute('data-img') || (img ? img.src : '');
    const alt = img ? img.alt : title;

    // click
    card.addEventListener('click', () => openLightbox(title, imgSrc, alt));

    // keyboard: Enter or Space should open
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openLightbox(title, imgSrc, alt);
      }
    });
  });

  const filterInput = document.getElementById('serviceFilter');
  if(filterInput){
    filterInput.addEventListener('input', () => {
      const q = filterInput.value.trim().toLowerCase();
      document.querySelectorAll('.game-card').forEach(card => {
        const label = (card.getAttribute('data-title') || card.textContent || '').toLowerCase();
        card.style.display = label.includes(q) ? '' : 'none';
      });
    });
  }
});

