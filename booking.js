/* booking.js - booking form validation, countdown timer and confirmation popup */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  if(!form) return;

  function showConfirmation(details){
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h3>Booking confirmed</h3>
        <p>Thanks, ${details.fullName}. Your booking for ${details.session} on ${details.date} at ${details.time} is recorded.</p>
        <p id="countdown">Redirecting to bookings in 10s...</p>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button id="closeConf" class="btn">Close</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    let seconds = 10;
    const cd = setInterval(()=>{
      seconds -= 1;
      const el = document.getElementById('countdown');
      if(el) el.textContent = `Redirecting to bookings in ${seconds}s...`;
      if(seconds <= 0) { clearInterval(cd); overlay.remove(); window.location.href = 'booking.html'; }
    }, 1000);
    document.getElementById('closeConf').addEventListener('click', () => { clearInterval(cd); overlay.remove(); });
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    // client-side validation
    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const session = form.session.value;
    const date = form.date.value;
    const time = form.time.value;
    const errors = [];

    if(!fullName) errors.push('Enter full name');
    if(!email || !/\S+@\S+\.\S+/.test(email)) errors.push('Enter valid email');
    if(!session) errors.push('Select session');
    if(!date) errors.push('Select date');
    if(!time) errors.push('Select time');

    // display errors inline
    const existingErr = document.querySelector('.form-error');
    if(existingErr) existingErr.remove();
    if(errors.length){
      const errDiv = document.createElement('div');
      errDiv.className = 'form-error';
      errDiv.textContent = errors.join('. ');
      form.prepend(errDiv);
      return;
    }

    // simulate booking confirmation
    showConfirmation({fullName, email, session, date, time});
    form.reset();
  });
});
