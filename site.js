/* site.js - site-wide behavior: theme toggle, contrast, zoom, nav highlight, keyboard focus helper
   This is included site-wide on every page.
*/

(function(){
  const LS_THEME = 'betnest_theme';
  const LS_CONTRAST = 'betnest_contrast';
  const LS_ZOOM = 'betnest_zoom';

  const DEFAULT_ZOOM = 1;
  const MIN_ZOOM = 0.75;
  const MAX_ZOOM = 1.5;
  const ZOOM_STEP = 0.05;

  const qs = sel => document.querySelector(sel);
  const qsa = sel => Array.from(document.querySelectorAll(sel));

  function applyTheme(theme){
    document.body.classList.remove('dark-theme');
    if(theme === 'dark') document.body.classList.add('dark-theme');
    const btn = qs('#themeToggle');
    if(btn){
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
    try{ localStorage.setItem(LS_THEME, theme); } catch(e){}
  }

  function applyContrast(enabled){
    if(enabled) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
    const btn = qs('#contrastToggle');
    if(btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    try{ localStorage.setItem(LS_CONTRAST, enabled ? '1' : '0'); } catch(e){}
  }

  function applyZoom(value){
    value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
    document.body.style.zoom = value;
    document.documentElement.style.setProperty('--zoom-level', String(value));
    try{ localStorage.setItem(LS_ZOOM, String(value)); } catch(e){}
    const zin = qs('#zoomIn'), zout = qs('#zoomOut');
    if(zin) zin.disabled = value >= MAX_ZOOM;
    if(zout) zout.disabled = value <= MIN_ZOOM;
  }

  function initPreferences(){
    let theme = 'light';
    try{ theme = localStorage.getItem(LS_THEME) || 'light' } catch(e){}
    applyTheme(theme);

    let contrast = false;
    try{ contrast = localStorage.getItem(LS_CONTRAST) === '1' } catch(e){}
    applyContrast(contrast);

    let zoom = DEFAULT_ZOOM;
    try{ zoom = parseFloat(localStorage.getItem(LS_ZOOM) || DEFAULT_ZOOM) } catch(e){}
    applyZoom(isNaN(zoom)? DEFAULT_ZOOM : zoom);
  }

  function setupControls(){
    const themeBtn = qs('#themeToggle');
    if(themeBtn) themeBtn.addEventListener('click', () => {
      const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    const contrastBtn = qs('#contrastToggle');
    if(contrastBtn) contrastBtn.addEventListener('click', () => {
      const enabled = document.body.classList.contains('high-contrast');
      applyContrast(!enabled);
    });

    const zin = qs('#zoomIn'), zout = qs('#zoomOut'), zreset = qs('#zoomReset');
    if(zin) zin.addEventListener('click', () => applyZoom(parseFloat(localStorage.getItem(LS_ZOOM) || DEFAULT_ZOOM) + ZOOM_STEP));
    if(zout) zout.addEventListener('click', () => applyZoom(parseFloat(localStorage.getItem(LS_ZOOM) || DEFAULT_ZOOM) - ZOOM_STEP));
    if(zreset) zreset.addEventListener('click', () => applyZoom(DEFAULT_ZOOM));

    // keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if(e.ctrlKey && e.shiftKey && e.code === 'KeyL'){
        const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
      }
      if(e.ctrlKey && e.shiftKey && e.code === 'KeyC'){
        applyContrast(!document.body.classList.contains('high-contrast'));
      }
      if(e.ctrlKey && (e.key === '=' || e.key === '+')){
        e.preventDefault();
        applyZoom(parseFloat(localStorage.getItem(LS_ZOOM) || DEFAULT_ZOOM) + ZOOM_STEP);
      }
      if(e.ctrlKey && e.key === '-'){
        e.preventDefault();
        applyZoom(parseFloat(localStorage.getItem(LS_ZOOM) || DEFAULT_ZOOM) - ZOOM_STEP);
      }
      if(e.ctrlKey && e.key === '0'){
        e.preventDefault();
        applyZoom(DEFAULT_ZOOM);
      }
    });
  }

  function highlightNav(){
    const current = window.location.pathname.split('/').pop().toLowerCase();
    qsa('nav#navbar a').forEach(link=>{
      const href = (link.getAttribute('href') || '').toLowerCase();
      if(href === current || (current === '' && href.includes('index'))){
        link.classList.add('active');
        link.setAttribute('aria-current','page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function focusHelper(){
    window.addEventListener('keydown', (e) => { if(e.key === 'Tab') document.body.classList.add('user-is-tabbing'); });
    window.addEventListener('mousedown', () => document.body.classList.remove('user-is-tabbing'));
  }

  // init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initPreferences();
    setupControls();
    highlightNav();
    focusHelper();
    // Smooth-scroll for internal links with class scroll-link
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a.scroll-link');
      if(link && link.getAttribute('href').startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior:'smooth', block:'start' });
      }
    });
  });

})();

