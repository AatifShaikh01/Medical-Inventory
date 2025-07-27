import { auth, signInWithEmailAndPassword, signOut } from './firebase-config.js';

// Auth Elements
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userEmailSpan = document.getElementById('userEmail');
const appContent = document.getElementById('appContent');
const loginScreen = document.getElementById('loginScreen');

// Login Handler
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  });
}

// Logout Handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    signOut(auth);
  });
}

// Auth State Listener
auth.onAuthStateChanged(user => {
  if (user) {
    // User logged in
    loginScreen.style.display = 'none';
    appContent.style.display = 'block';
    userEmailSpan.textContent = user.email;
    document.getElementById('lastSync').textContent = new Date().toLocaleString();
  } else {
    // No user
    loginScreen.style.display = 'block';
    appContent.style.display = 'none';
  }
});