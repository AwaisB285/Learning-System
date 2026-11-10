
/* =========================================
   EduPath AI - Login and Registration
   Backend: FastAPI + MySQL
   ========================================= */

const API_BASE_URL = 'http://127.0.0.1:8000';


/* =========================================
   1. LOGIN PAGE
   ========================================= */

const loginForm = document.getElementById('loginForm');

if (loginForm) {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');
  const statusMessage = document.getElementById('statusMessage');
  const togglePassword = document.getElementById('togglePassword');
  const forgotLink = document.getElementById('forgotLink');
  const registerLink = document.getElementById('registerLink');

  // Show or hide the password.
  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const showing = passwordInput.type === 'text';

      passwordInput.type = showing ? 'password' : 'text';
      togglePassword.textContent = showing ? 'Show' : 'Hide';
      togglePassword.setAttribute(
        'aria-label',
        showing ? 'Show password' : 'Hide password'
      );
    });
  }

  // Login form submission.
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    emailError.textContent = '';
    passwordError.textContent = '';
    statusMessage.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let valid = true;

    if (!email) {
      emailError.textContent = 'Please enter your email address.';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      valid = false;
    }

    if (!password) {
      passwordError.textContent = 'Please enter your password.';
      valid = false;
    } else if (password.length < 6) {
      passwordError.textContent =
        'Password must contain at least 6 characters.';
      valid = false;
    }

    if (!valid) return;

    const submitButton = loginForm.querySelector(
      'button[type="submit"]'
    );

    const originalButtonText = submitButton
      ? submitButton.textContent
      : 'Sign In';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Signing In...';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Login failed. Please try again.'
        );
      }

      statusMessage.textContent =
        'Login successful! Welcome, ' + result.user.full_name + '.';

    } catch (error) {
      statusMessage.textContent =
        error.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Make sure FastAPI is running.'
          : error.message || 'Login failed. Please try again.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });

  // Forgot-password message.
  if (forgotLink) {
    forgotLink.addEventListener('click', (event) => {
      event.preventDefault();
      statusMessage.textContent =
        'Password reset is not configured yet.';
    });
  }

  // Registration page link.
  if (registerLink) {
    registerLink.addEventListener('click', (event) => {
      event.preventDefault();
      window.location.href = 'register.html';
    });
  }

  // Social sign-in placeholders.
  document.querySelectorAll('.social-button').forEach((button) => {
    button.addEventListener('click', () => {
      statusMessage.textContent =
        `${button.dataset.provider || 'Social'} sign-in is not configured yet.`;
    });
  });
}


/* =========================================
   2. REGISTRATION PAGE
   ========================================= */

const registerForm = document.getElementById('registerForm');

if (registerForm) {
  const fullNameInput = document.getElementById('fullName');
  const registerEmailInput = document.getElementById('email');
  const registerPasswordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  const nameError = document.getElementById('nameError');
  const registerEmailError = document.getElementById('emailError');
  const registerPasswordError = document.getElementById('passwordError');
  const confirmError = document.getElementById('confirmError');
  const termsError = document.getElementById('termsError');
  const termsCheckbox = document.getElementById('terms');
  const registerStatus = document.getElementById('statusMessage');

  // Registration form submission.
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    nameError.textContent = '';
    registerEmailError.textContent = '';
    registerPasswordError.textContent = '';
    confirmError.textContent = '';
    termsError.textContent = '';
    registerStatus.textContent = '';

    const fullName = fullNameInput.value.trim();
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let valid = true;

    if (fullName.length < 2) {
      nameError.textContent = 'Please enter your full name.';
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      registerEmailError.textContent =
        'Please enter a valid email address.';
      valid = false;
    }

    if (password.length < 8) {
      registerPasswordError.textContent =
        'Password must contain at least 8 characters.';
      valid = false;
    }

    if (password !== confirmPassword) {
      confirmError.textContent = 'Passwords do not match.';
      valid = false;
    }

    if (!termsCheckbox.checked) {
      termsError.textContent =
        'Please agree to the Terms & Privacy Policy.';
      valid = false;
    }

    if (!valid) return;

    const submitButton = registerForm.querySelector(
      'button[type="submit"]'
    );

    const originalButtonText = submitButton
      ? submitButton.textContent
      : 'Create Account';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Creating Account...';
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof result.detail === 'string'
            ? result.detail
            : 'Registration failed. Please try again.'
        );
      }

      registerStatus.textContent =
        'Account created successfully! You can now sign in.';

      registerForm.reset();

    } catch (error) {
      registerStatus.textContent =
        error.message === 'Failed to fetch'
          ? 'Cannot connect to the server. Make sure FastAPI is running.'
          : error.message || 'Registration failed. Please try again.';
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
