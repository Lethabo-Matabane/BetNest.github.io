/* contact.js - contact form validation and simulated auto-response */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if(!form) return;
  const auto = document.getElementById('contact-auto-response');
  const businessStatus = document.getElementById('business-status');

  // show business open/closed status (reuse same hours)
  (function setBusinessStatus(){
    const now = new Date();
    const hour = now.getHours();
    const open = (hour >= 8 && hour < 20);
    if(businessStatus) businessStatus.textContent = open ? 'We are open — send us a message!' : 'We are currently closed — we will reply when open.';
  })();

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.fullName.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if(!name || !email || !message || !/\S+@\S+\.\S+/.test(email)){
      auto.textContent = 'Please complete the form with a valid email.';
      auto.style.color = 'var(--accent-red)';
      return;
    }
    // Simulated auto-response
    auto.style.color = 'var(--accent-blue)';
    auto.textContent = `Thanks ${name}! We received your message and will reply to ${email} shortly.`;
    form.reset();
  });
});
