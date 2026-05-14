// Funcionalidad del formulario de registro

const registrationForm = document.getElementById('registrationForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const emailInput = document.getElementById('email');
const confirmEmailInput = document.getElementById('confirmEmail');
const instructionsInput = document.getElementById('instructions');
const charCountSpan = document.getElementById('charCount');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

// INDICADOR DE FUERZA DE CONTRASEÑA
if (passwordInput) {
  passwordInput.addEventListener('input', updatePasswordStrength);
}

function updatePasswordStrength() {
  const password = passwordInput.value;
  let strength = 0;
  let strengthLabel = '';
  let strengthColor = '';

  // Calcular fuerza de la contraseña
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  // Determinar nivel de fuerza
  if (strength === 0) {
    strengthLabel = '';
    strengthColor = '#e5e7eb';
  } else if (strength <= 1) {
    strengthLabel = 'Débil';
    strengthColor = '#dc2626';
  } else if (strength <= 2) {
    strengthLabel = 'Baja';
    strengthColor = '#f59e0b';
  } else if (strength <= 3) {
    strengthLabel = 'Media';
    strengthColor = '#eab308';
  } else if (strength <= 4) {
    strengthLabel = 'Fuerte';
    strengthColor = '#84cc16';
  } else {
    strengthLabel = 'Muy fuerte';
    strengthColor = '#22c55e';
  }

  // Actualizar barra visual
  const strengthPercentage = (strength / 5) * 100;
  strengthBar.style.setProperty('--width', strengthPercentage + '%');
  strengthBar.style.setProperty('background-color', strengthColor);

  // Actualizar pseudo-elemento (::after)
  strengthBar.innerHTML = '';
  const bar = document.createElement('div');
  bar.style.height = '100%';
  bar.style.width = strengthPercentage + '%';
  bar.style.backgroundColor = strengthColor;
  bar.style.borderRadius = '3px';
  bar.style.transition = 'width 0.3s ease, background-color 0.3s ease';

  // Mejor forma usando CSS
  strengthBar.setAttribute('data-strength', strengthPercentage);
  
  strengthText.textContent = strengthLabel;
  strengthText.style.color = strengthColor;
}

// CONTAR CARACTERES EN TEXTAREA
if (instructionsInput && charCountSpan) {
  instructionsInput.addEventListener('input', updateCharCount);
  
  function updateCharCount() {
    const count = instructionsInput.value.length;
    charCountSpan.textContent = count;
    
    // Cambiar color si se acerca al límite
    if (count > 180) {
      charCountSpan.parentElement.style.color = '#f59e0b';
    } else {
      charCountSpan.parentElement.style.color = '#6b7280';
    }
  }
}

// VALIDACIÓN DE COINCIDENCIA DE CONTRASEÑA
if (confirmPasswordInput) {
  confirmPasswordInput.addEventListener('blur', validatePasswordMatch);
}

if (passwordInput) {
  passwordInput.addEventListener('blur', validatePasswordMatch);
}

function validatePasswordMatch() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (confirmPassword && password !== confirmPassword) {
    confirmPasswordInput.classList.add('error');
    showErrorMessage(confirmPasswordInput, 'Las contraseñas no coinciden');
  } else {
    confirmPasswordInput.classList.remove('error');
    hideErrorMessage(confirmPasswordInput);
  }
}

// VALIDACIÓN DE COINCIDENCIA DE EMAIL
if (confirmEmailInput) {
  confirmEmailInput.addEventListener('blur', validateEmailMatch);
}

if (emailInput) {
  emailInput.addEventListener('blur', validateEmailMatch);
}

function validateEmailMatch() {
  const email = emailInput.value;
  const confirmEmail = confirmEmailInput.value;

  if (confirmEmail && email !== confirmEmail) {
    confirmEmailInput.classList.add('error');
    showErrorMessage(confirmEmailInput, 'Los correos electrónicos no coinciden');
  } else {
    confirmEmailInput.classList.remove('error');
    hideErrorMessage(confirmEmailInput);
  }
}

// FUNCIONES AUXILIARES PARA MOSTRAR/OCULTAR MENSAJES DE ERROR
function showErrorMessage(input, message) {
  let errorMsg = input.parentElement.querySelector('.error-message');
  
  if (!errorMsg) {
    errorMsg = document.createElement('span');
    errorMsg.className = 'error-message show';
    errorMsg.textContent = message;
    input.parentElement.appendChild(errorMsg);
  } else {
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
  }
}

function hideErrorMessage(input) {
  const errorMsg = input.parentElement.querySelector('.error-message');
  if (errorMsg) {
    errorMsg.classList.remove('show');
  }
}

// VALIDACIÓN AL ENVIAR EL FORMULARIO
if (registrationForm) {
  registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;

    // Validar que las contraseñas coincidan
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.classList.add('error');
      showErrorMessage(confirmPasswordInput, 'Las contraseñas no coinciden');
      isValid = false;
    } else {
      confirmPasswordInput.classList.remove('error');
      hideErrorMessage(confirmPasswordInput);
    }

    // Validar que los emails coincidan
    if (emailInput.value !== confirmEmailInput.value) {
      confirmEmailInput.classList.add('error');
      showErrorMessage(confirmEmailInput, 'Los correos electrónicos no coinciden');
      isValid = false;
    } else {
      confirmEmailInput.classList.remove('error');
      hideErrorMessage(confirmEmailInput);
    }

    // Si es válido, aquí irían las acciones (enviar a servidor, etc.)
    if (isValid) {
      console.log('Formulario válido. Datos listos para enviar.');
      // En una aplicación real, se enviaría a un servidor
      alert('¡Registro completado exitosamente! (Este es un mensaje de demostración)');
      // this.submit(); // Descomentar para enviar realmente
    } else {
      console.log('Formulario inválido. Por favor, revisa los campos.');
    }
  });
}

// Actualizar barra de fuerza usando estilo CSS dinámico
window.addEventListener('load', function() {
  if (strengthBar) {
    // Crear estilo dinámico para la barra
    const style = document.createElement('style');
    style.textContent = `
      #strengthBar::after {
        content: '';
        display: block;
        height: 100%;
        width: var(--width, 0%);
        background-color: var(--strength-color, #dc2626);
        border-radius: 3px;
        transition: width 0.3s ease, background-color 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
});

// Mejorar la visualización de la barra de fuerza usando un div interno
function improveStrengthBar() {
  if (strengthBar && !strengthBar.querySelector('.strength-fill')) {
    const fill = document.createElement('div');
    fill.className = 'strength-fill';
    fill.style.height = '100%';
    fill.style.width = '0%';
    fill.style.backgroundColor = '#dc2626';
    fill.style.borderRadius = '3px';
    fill.style.transition = 'width 0.3s ease, background-color 0.3s ease';
    strengthBar.appendChild(fill);
  }
}

improveStrengthBar();

// Actualizar la barra de fuerza correctamente
function updatePasswordStrengthImproved() {
  const password = passwordInput.value;
  let strength = 0;
  let strengthLabel = '';
  let strengthColor = '';

  // Calcular fuerza de la contraseña
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  // Determinar nivel de fuerza
  if (strength === 0) {
    strengthLabel = '';
    strengthColor = '#e5e7eb';
  } else if (strength <= 1) {
    strengthLabel = 'Débil';
    strengthColor = '#dc2626';
  } else if (strength <= 2) {
    strengthLabel = 'Baja';
    strengthColor = '#f59e0b';
  } else if (strength <= 3) {
    strengthLabel = 'Media';
    strengthColor = '#eab308';
  } else if (strength <= 4) {
    strengthLabel = 'Fuerte';
    strengthColor = '#84cc16';
  } else {
    strengthLabel = 'Muy fuerte';
    strengthColor = '#22c55e';
  }

  // Actualizar barra visual
  const strengthPercentage = (strength / 5) * 100;
  const fill = strengthBar.querySelector('.strength-fill');
  if (fill) {
    fill.style.width = strengthPercentage + '%';
    fill.style.backgroundColor = strengthColor;
  } else {
    strengthBar.style.width = strengthPercentage + '%';
    strengthBar.style.backgroundColor = strengthColor;
  }

  strengthText.textContent = strengthLabel;
  strengthText.style.color = strengthColor;
}

// Actualizar referencia de función
if (passwordInput) {
  passwordInput.removeEventListener('input', updatePasswordStrength);
  passwordInput.addEventListener('input', updatePasswordStrengthImproved);
}
