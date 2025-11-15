/* about.js - makes the "Our Values" flip cards keyboard-accessible:
   clicking or pressing Enter/Space toggles the flipped state.
*/
document.addEventListener('DOMContentLoaded', () => {
  const flipButtons = Array.from(document.querySelectorAll('.flip-btn'));

  flipButtons.forEach(btn => {
    // Toggle function
    const toggle = () => {
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
      // add/remove 'flipped' class on parent container if desired for CSS hooks
      const parent = btn.closest('.flip-card');
      if(parent) parent.classList.toggle('flipped', !pressed);
    };

    // Click handler
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });

    // Keyboard handler (Enter / Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
});
