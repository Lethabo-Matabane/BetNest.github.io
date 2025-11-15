/* announcements.js - supports Events + Announcements, add form, view toggles,
   search across both, counts, sorting, marking past events.
*/

document.addEventListener('DOMContentLoaded', () => {
  const filterInput = document.getElementById('eventFilter');
  const eventsGrid = document.getElementById('eventsGrid');
  const announcementsGrid = document.getElementById('announcementsGrid');

  const viewEvents = document.getElementById('viewEvents');
  const viewAnnouncements = document.getElementById('viewAnnouncements');
  const viewBoth = document.getElementById('viewBoth');

  const adminToggle = document.getElementById('adminToggle');
  const adminSection = document.getElementById('adminSection');
  const adminForm = document.getElementById('adminForm');
  const adminCancel = document.getElementById('adminCancel');

  const eventCounts = document.getElementById('eventCounts');

  // parse date function (supports data-datetime or time element)
  function parseDateFromCard(card){
    const dt = card.getAttribute('data-datetime') || card.querySelector('time')?.getAttribute('datetime');
    return dt ? new Date(dt) : null;
  }

  // mark past items (events & announcements)
  function markPastItems(){
    const now = new Date();
    document.querySelectorAll('.event-card, .announce-card').forEach(card => {
      const d = parseDateFromCard(card);
      if(!d) return;
      if(d < now) card.classList.add('past'); else card.classList.remove('past');
    });
  }

  // sort events by start date ascending
  function sortEventCards(){
    const cards = Array.from(eventsGrid.querySelectorAll('.event-card'));
    cards.sort((a,b) => {
      const da = parseDateFromCard(a) || new Date(8640000000000000);
      const db = parseDateFromCard(b) || new Date(8640000000000000);
      return da - db;
    });
    cards.forEach(c => eventsGrid.appendChild(c));
  }

  // sort announcements (newest first)
  function sortAnnouncementCards(){
    const cards = Array.from(announcementsGrid.querySelectorAll('.announce-card'));
    cards.sort((a,b) => {
      const da = parseDateFromCard(a) || new Date(0);
      const db = parseDateFromCard(b) || new Date(0);
      return db - da; // newest first
    });
    cards.forEach(c => announcementsGrid.appendChild(c));
  }

  function updateCounts(){
    const totalEvents = document.querySelectorAll('.event-card').length;
    const upcoming = document.querySelectorAll('.event-card:not(.past)').length;
    const pastE = document.querySelectorAll('.event-card.past').length;
    const totalAnn = document.querySelectorAll('.announce-card').length;
    const pastA = document.querySelectorAll('.announce-card.past').length;
    eventCounts.textContent = `Events: ${totalEvents} (${upcoming} upcoming, ${pastE} past) • Announcements: ${totalAnn} (${pastA} past)`;
  }

  // initial housekeeping
  markPastItems();
  sortEventCards();
  sortAnnouncementCards();
  updateCounts();

  // SEARCH - covers both events and announcements
  filterInput?.addEventListener('input', () => {
    const q = filterInput.value.trim().toLowerCase();
    document.querySelectorAll('.event-card, .announce-card').forEach(card => {
      const text = (card.textContent || '').toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // VIEW toggles
  function setActiveView(button){
    [viewEvents, viewAnnouncements, viewBoth].forEach(b => b.setAttribute('aria-selected', b === button ? 'true' : 'false'));
  }

  function showEventsOnly(){
    setActiveView(viewEvents);
    document.getElementById('eventsSection').style.display = '';
    document.getElementById('announcementsSection').style.display = 'none';
  }
  function showAnnouncementsOnly(){
    setActiveView(viewAnnouncements);
    document.getElementById('eventsSection').style.display = 'none';
    document.getElementById('announcementsSection').style.display = '';
  }
  function showBoth(){
    setActiveView(viewBoth);
    document.getElementById('eventsSection').style.display = '';
    document.getElementById('announcementsSection').style.display = '';
  }

  viewEvents.addEventListener('click', showEventsOnly);
  viewAnnouncements.addEventListener('click', showAnnouncementsOnly);
  viewBoth.addEventListener('click', showBoth);

  // ADMIN form toggling
  adminToggle.addEventListener('click', () => {
    const hidden = adminSection.classList.toggle('hidden');
    adminSection.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    if(!hidden) adminSection.querySelector('#itemType').focus();
  });
  adminCancel?.addEventListener('click', () => {
    adminSection.classList.add('hidden');
    adminSection.setAttribute('aria-hidden','true');
  });

  // Add new item (Event or Announcement)
  adminForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('itemType').value;
    const title = document.getElementById('itemTitle').value.trim();
    const desc = document.getElementById('itemDescription').value.trim();
    const startVal = document.getElementById('itemStart').value;
    const endVal = document.getElementById('itemEnd').value;
    const img = document.getElementById('itemImage').value.trim() || '../../Images/default.jpg';
    if(!title || !startVal) return alert('Please include a title and date/time');

    const startISO = new Date(startVal).toISOString();
    const id = (type === 'event' ? 'ev' : 'an') + Date.now();

    if(type === 'event'){
      const startStr = new Date(startVal).toLocaleString([], { dateStyle:'medium', timeStyle:'short' });
      const endStr = endVal ? new Date(endVal).toLocaleString([], { dateStyle:'medium', timeStyle:'short' }) : '';
      const timeHTML = endVal ? `${startStr} — ${endStr}` : startStr;

      const article = document.createElement('article');
      article.className = 'event-card';
      article.id = id;
      article.setAttribute('data-datetime', startISO);
      article.innerHTML = `
        <img src="${img}" alt="${escapeHtml(title)}">
        <div class="event-info">
          <h3>${escapeHtml(title)}</h3>
          <p class="ev-meta"><time datetime="${startISO}">${escapeHtml(timeHTML)}</time></p>
          <p class="description">${escapeHtml(desc)}</p>
          <div class="ev-actions">
            <button class="btn share-btn" data-url="${location.href}#${id}">Share</button>
            <a href="#" class="btn outline register-btn" data-event="${id}">Register</a>
          </div>
        </div>
      `;
      eventsGrid.appendChild(article);
      sortEventCards();
    } else {
      const article = document.createElement('article');
      article.className = 'announce-card';
      article.id = id;
      article.setAttribute('data-datetime', startISO);
      article.innerHTML = `
        <div class="announce-content">
          <h3>${escapeHtml(title)}</h3>
          <p class="announce-meta"><time datetime="${startISO}">${new Date(startISO).toLocaleString([], { dateStyle:'medium', timeStyle:'short' })}</time></p>
          <p>${escapeHtml(desc)}</p>
        </div>
      `;
      announcementsGrid.appendChild(article);
      sortAnnouncementCards();
    }

    // housekeeping
    markPastItems();
    updateCounts();

    // reset form and hide
    e.target.reset();
    adminSection.classList.add('hidden');
    adminSection.setAttribute('aria-hidden','true');
  });

  // delegated interaction: share & register placeholders
  document.addEventListener('click', (e) => {
    const share = e.target.closest('.share-btn');
    if(share){
      const url = share.dataset.url || location.href;
      if(navigator.share){
        navigator.share({ title: document.title, url }).catch(()=>{});
      } else {
        navigator.clipboard.writeText(url).then(()=> alert('Link copied to clipboard'));
      }
    }
    if(e.target.closest('.register-btn')){
      e.preventDefault();
      alert('Registration flow is not connected in demo. Link to booking or implement backend for real signups.');
    }
  });

  // auto-update every minute
  setInterval(() => {
    markPastItems();
    updateCounts();
  }, 60_000);

  // helper to escape strings for innerHTML insertion
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
});
