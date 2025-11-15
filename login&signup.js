/* auth.js - basic client-side validation for login & signup */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if(loginForm){
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email.value.trim();
      const pw = loginForm.password.value.trim();
      if(!email || !pw){ alert('Please enter email and password.'); return; }
      // Demo-only: show success
      alert('Login successful (demo).');
      loginForm.reset();
    });
  }

  if(signupForm){
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = signupForm.fullname.value.trim();
      const email = signupForm.email.value.trim();
      const pw = signupForm.password.value;
      const confirm = signupForm.confirm.value;
      if(!name || !email || !pw || !confirm){ alert('Please complete all fields.'); return; }
      if(pw !== confirm){ alert('Passwords do not match.'); return; }
      // Demo-only: show success
      alert('Account created (demo). You can now log in.');
      signupForm.reset();
      window.location.href = 'login.html';
    });
  }
});
