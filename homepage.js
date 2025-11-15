/* homepage.js - open/closed indicator, live clock, greeting, homepage search */
document.addEventListener('DOMContentLoaded', () => {
  const statusIndicator = document.getElementById('status-indicator');
  const greeting = document.getElementById('greeting');
  const clock = document.getElementById('live-clock');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  const OPEN_HOUR = 8, CLOSE_HOUR = 20;

  function updateOpenStatus(){
    if(!statusIndicator) return;
    const hour = new Date().getHours();
    if(hour >= OPEN_HOUR && hour < CLOSE_HOUR){
      statusIndicator.textContent = '✅ We’re open now!';
      statusIndicator.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-lime') || '#2fa84f';
    } else {
      statusIndicator.textContent = '❌ Closed (Open: 08:00 – 20:00)';
      statusIndicator.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-red') || '#d6453b';
    }
  }

  function updateClock(){
    if(!clock) return;
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  }

  function updateGreeting(){
    if(!greeting) return;
    const hour = new Date().getHours();
    if(hour < 12) greeting.textContent = '🌅 Good morning — ready to game?';
    else if(hour < 18) greeting.textContent = '🎮 Good afternoon — play on!';
    else greeting.textContent = '🌙 Good evening — welcome back!';
  }

  const searchMap = {
    'home':'index.html','about':'about.html','services':'services.html','gaming':'services.html','games':'services.html',
    'book':'booking.html','booking':'booking.html','contact':'contact.html','announcement':'announcements.html','announcements':'announcements.html',
    'login':'login.html','signup':'signup.html','register':'signup.html'
  };

  if(searchForm && searchInput){
    searchForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const q = (searchInput.value || '').trim().toLowerCase();
      if(!q){ searchInput.focus(); return alert('Please type something to search (e.g., "services", "booking").'); }
      let found = null;
      for(const key in searchMap){
        if(q === key || q.includes(key) || key.includes(q)){ found = searchMap[key]; break; }
      }
      if(found) window.location.href = found;
      else {
        if(q.includes('game') || q.includes('service') || q.includes('console') || q.includes('pc')){
          const services = document.getElementById('services');
          if(services) services.scrollIntoView({ behavior:'smooth' });
          else alert(`No results found for "${q}". Try: services, booking, contact.`);
        } else alert(`No results found for "${q}". Try: services, booking, contact.`);
      }
    });
  }

  // init
  updateOpenStatus(); updateGreeting(); updateClock();
  setInterval(updateClock, 60 * 1000);
  setInterval(updateOpenStatus, 60 * 1000);
});