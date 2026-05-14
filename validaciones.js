document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const fields = {
    fullName: document.getElementById('fullName'),
    birthDate: document.getElementById('birthDate'),
    rut: document.getElementById('rut'),
    gender: document.getElementById('gender'),
    nationality: document.getElementById('nationality'),
    email: document.getElementById('email'),
    confirmEmail: document.getElementById('confirmEmail'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    phone: document.getElementById('phone'),
    deliveryCountry: document.getElementById('deliveryCountry'),
    state: document.getElementById('state'),
    city: document.getElementById('city'),
    street: document.getElementById('street'),
    postalCode: document.getElementById('postalCode'),
    instructions: document.getElementById('instructions'),
    termsConditions: document.getElementById('termsConditions'),
    privacyPolicy: document.getElementById('privacyPolicy')
  };

  const categories = Array.from(document.querySelectorAll('input[name="categories"]'));
  const clientType = Array.from(document.querySelectorAll('input[name="clientType"]'));
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const charCount = document.getElementById('charCount');

  const successContainer = document.createElement('div');
  successContainer.id = 'successMessage';
  successContainer.className = 'success-message hidden';
  form.parentNode.insertBefore(successContainer, form.nextSibling);

  const validators = {
    fullName: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'El nombre completo es obligatorio.';
      if (trimmed.length < 3 || trimmed.length > 60) return 'Debe tener entre 3 y 60 caracteres.';
      if (!/^[A-Za-z�������������� ]+$/.test(trimmed)) return 'El nombre solo puede contener letras y espacios.';
      return '';
    },
    birthDate: value => {
      if (!value) return 'La fecha de nacimiento es obligatoria.';
      const birth = new Date(value);
      const now = new Date();
      const adultDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
      if (birth > adultDate) return 'Debes ser mayor de 18 a�os.';
      return '';
    },
    rut: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'El RUT es obligatorio.';
      const cleaned = trimmed.replace(/[\.\s]/g, '');
      const digitsOnly = cleaned.replace(/-/g, '');
      if (!/^[0-9kK]+$/.test(digitsOnly)) return 'El RUT solo puede contener n�meros y la letra k.';
      if (digitsOnly.length < 7 || digitsOnly.length > 9) return 'El RUT debe tener entre 7 y 8 d�gitos num�ricos, opcionalmente con d�gito verificador.';
      if (cleaned.includes('-')) {
        const parts = cleaned.split('-');
        if (parts.length !== 2) return 'El formato del RUT no es v�lido.';
        const number = parts[0];
        const dv = parts[1];
        if (!validateChileRut(number, dv)) return 'El RUT no es v�lido.';
      }
      return '';
    },
    gender: value => (!value ? 'Debes seleccionar un g�nero.' : ''),
    nationality: value => (!value ? 'Debes seleccionar una nacionalidad.' : ''),
    email: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'El correo electr�nico es obligatorio.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'El email no tiene un formato v�lido.';
      return '';
    },
    confirmEmail: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'Debes confirmar el correo.';
      if (trimmed !== fields.email.value.trim()) return 'Los correos deben coincidir exactamente.';
      return '';
    },
    password: value => {
      if (!value) return 'La contrase�a es obligatoria.';
      if (value.length < 8) return 'La contrase�a debe tener al menos 8 caracteres.';
      if (!/[A-Z]/.test(value)) return 'La contrase�a debe contener al menos una letra may�scula.';
      if (!/[0-9]/.test(value)) return 'La contrase�a debe contener al menos un n�mero.';
      if (!/[!@#$%^&*]/.test(value)) return 'La contrase�a debe contener al menos un car�cter especial (!@#$%^&*).';
      return '';
    },
    confirmPassword: value => {
      if (!value) return 'Debes confirmar la contrase�a.';
      if (value !== fields.password.value) return 'Las contrase�as deben coincidir exactamente.';
      return '';
    },
    phone: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'El tel�fono es obligatorio.';
      if (!/^[0-9+\-\s]+$/.test(trimmed)) return 'El tel�fono solo puede incluir d�gitos, espacios, + y guiones.';
      const digits = trimmed.replace(/[^0-9]/g, '');
      if (digits.length < 8) return 'El tel�fono debe tener al menos 8 d�gitos num�ricos.';
      return '';
    },
    deliveryCountry: value => (!value ? 'Debes seleccionar un pa�s de entrega.' : ''),
    state: value => (!value.trim() ? 'La provincia o estado es obligatorio.' : ''),
    city: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'La ciudad es obligatoria.';
      if (trimmed.length < 2) return 'La ciudad debe tener al menos 2 caracteres.';
      if (!/^[A-Za-z�������������� ]+$/.test(trimmed)) return 'La ciudad solo puede contener letras y espacios.';
      return '';
    },
    street: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'La calle y n�mero son obligatorios.';
      if (trimmed.length < 5) return 'La calle y n�mero deben tener al menos 5 caracteres.';
      return '';
    },
    postalCode: value => {
      const trimmed = value.trim();
      if (!trimmed) return 'El c�digo postal es obligatorio.';
      if (!/^[A-Za-z0-9]+$/.test(trimmed)) return 'El c�digo postal solo puede contener caracteres alfanum�ricos.';
      if (trimmed.length < 4 || trimmed.length > 10) return 'El c�digo postal debe tener entre 4 y 10 caracteres.';
      return '';
    },
    instructions: value => {
      if (!value) return '';
      return value.length > 200 ? 'La referencia no puede superar los 200 caracteres.' : '';
    }
  };

  function validateChileRut(number, dv) {
    const cleanNumber = number.replace(/\D/g, '');
    if (!/^\d+$/.test(cleanNumber)) return false;
    let sum = 0;
    let multiplier = 2;
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      sum += Number(cleanNumber[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    const remainder = 11 - (sum % 11);
    const expected = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);
    return expected === dv.toUpperCase();
  }

  function getErrorContainer(field) {
    const group = field.closest('.form-group') || field.parentElement;
    let msg = group.querySelector('.error-message');
    if (!msg) {
      msg = document.createElement('small');
      msg.className = 'error-message';
      group.appendChild(msg);
    }
    return msg;
  }

  function setFieldStatus(field, error) {
    const msg = getErrorContainer(field);
    if (error) {
      field.classList.add('campo-error');
      field.classList.remove('campo-ok');
      msg.textContent = error;
      msg.classList.add('show');
    } else {
      field.classList.remove('campo-error');
      field.classList.add('campo-ok');
      msg.textContent = '';
      msg.classList.remove('show');
    }
  }

  function clearFieldStatus(field) {
    const group = field.closest('.form-group') || field.parentElement;
    const msg = group.querySelector('.error-message');
    field.classList.remove('campo-error');
    field.classList.remove('campo-ok');
    if (msg) {
      msg.textContent = '';
      msg.classList.remove('show');
    }
  }

  function setGroupError(container, message) {
    let msg = container.querySelector('.error-message');
    if (!msg) {
      msg = document.createElement('small');
      msg.className = 'error-message';
      container.appendChild(msg);
    }
    msg.textContent = message;
    msg.classList.add('show');
    container.classList.add('campo-error-group');
  }

  function clearGroupError(container) {
    const msg = container.querySelector('.error-message');
    if (msg) {
      msg.textContent = '';
      msg.classList.remove('show');
    }
    container.classList.remove('campo-error-group');
  }

  function validateField(fieldName) {
    const field = fields[fieldName];
    const error = validators[fieldName](field.value);
    setFieldStatus(field, error);
    return !error;
  }

  function validateSelect(fieldName) {
    return validateField(fieldName);
  }

  function validateGroupCheckboxes(inputs, message) {
    const checked = inputs.some(input => input.checked);
    const container = inputs[0].closest('.form-subsection') || inputs[0].parentElement;
    if (!checked) {
      setGroupError(container, message);
      inputs.forEach(input => input.classList.add('campo-error'));
      return false;
    }
    inputs.forEach(input => input.classList.remove('campo-error'));
    clearGroupError(container);
    return true;
  }

  function validateGroupRadios(inputs, message) {
    const checked = inputs.some(input => input.checked);
    const container = inputs[0].closest('.form-subsection') || inputs[0].parentElement;
    if (!checked) {
      setGroupError(container, message);
      inputs.forEach(input => input.classList.add('campo-error'));
      return false;
    }
    inputs.forEach(input => input.classList.remove('campo-error'));
    clearGroupError(container);
    return true;
  }

  function validateTerms() {
    const termsContainer = fields.termsConditions.closest('.form-subsection');
    let valid = true;
    if (!fields.termsConditions.checked) {
      setGroupError(termsContainer, 'Debes aceptar los T�rminos y Condiciones.');
      fields.termsConditions.classList.add('campo-error');
      valid = false;
    } else {
      fields.termsConditions.classList.remove('campo-error');
    }
    if (!fields.privacyPolicy.checked) {
      setGroupError(termsContainer, 'Debes aceptar la Pol�tica de Privacidad.');
      fields.privacyPolicy.classList.add('campo-error');
      valid = false;
    } else {
      fields.privacyPolicy.classList.remove('campo-error');
    }
    if (valid) {
      clearGroupError(termsContainer);
    }
    return valid;
  }

  function updatePasswordStrength(value) {
    const checks = [
      value.length >= 8,
      /[A-Z]/.test(value),
      /[0-9]/.test(value),
      /[!@#$%^&*]/.test(value)
    ];
    const score = checks.filter(Boolean).length;
    const width = (score / checks.length) * 100;
    strengthBar.style.width = `${width}%`;
    if (score <= 1) {
      strengthBar.style.background = '#dc2626';
      strengthText.textContent = 'Muy d�bil';
    } else if (score === 2) {
      strengthBar.style.background = '#f59e0b';
      strengthText.textContent = 'D�bil';
    } else if (score === 3) {
      strengthBar.style.background = '#3b82f6';
      strengthText.textContent = 'Buena';
    } else {
      strengthBar.style.background = '#16a34a';
      strengthText.textContent = 'Excelente';
    }
  }

  function updateCharCount() {
    const length = fields.instructions.value.length;
    charCount.textContent = length.toString();
    if (length > 200) {
      setFieldStatus(fields.instructions, 'La referencia no puede superar los 200 caracteres.');
    } else if (fields.instructions.classList.contains('campo-error')) {
      clearFieldStatus(fields.instructions);
    }
  }

  function showSuccess() {
    const name = fields.fullName.value.trim();
    form.style.display = 'none';
    successContainer.classList.remove('hidden');
    successContainer.innerHTML = `
      <div class="success-card">
        <h2>�Registro completado!</h2>
        <p>Gracias por registrarte, <strong>${name}</strong>. Tu cuenta ha sido creada correctamente.</p>
        <button type="button" class="btn btn-primary btn-large" id="backHome">Volver al inicio</button>
      </div>
    `;
    document.getElementById('backHome').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  function validateAll() {
    let valid = true;
    valid = validateField('fullName') && valid;
    valid = validateField('birthDate') && valid;
    valid = validateField('rut') && valid;
    valid = validateSelect('gender') && valid;
    valid = validateSelect('nationality') && valid;
    valid = validateField('email') && valid;
    valid = validateField('confirmEmail') && valid;
    valid = validateField('password') && valid;
    valid = validateField('confirmPassword') && valid;
    valid = validateField('phone') && valid;
    valid = validateSelect('deliveryCountry') && valid;
    valid = validateField('state') && valid;
    valid = validateField('city') && valid;
    valid = validateField('street') && valid;
    valid = validateField('postalCode') && valid;
    valid = validateField('instructions') && valid;
    valid = validateGroupCheckboxes(categories, 'Selecciona al menos una categor�a de inter�s.') && valid;
    valid = validateGroupRadios(clientType, 'Selecciona el tipo de cliente.') && valid;
    valid = validateTerms() && valid;
    return valid;
  }

  Object.keys(fields).forEach(fieldName => {
    const field = fields[fieldName];
    if (!field) return;
    field.addEventListener('blur', () => {
      if (['termsConditions', 'privacyPolicy'].includes(fieldName)) return;
      if (fieldName === 'instructions') {
        updateCharCount();
      }
      validateField(fieldName);
    });
    field.addEventListener('input', () => {
      if (fieldName === 'password') {
        updatePasswordStrength(field.value);
      }
      if (fieldName === 'instructions') {
        updateCharCount();
      }
      if (field.classList.contains('campo-error')) {
        clearFieldStatus(field);
      }
    });
  });

  [fields.gender, fields.nationality, fields.deliveryCountry].forEach(select => {
    if (!select) return;
    select.addEventListener('change', () => {
      validateSelect(select.id);
    });
  });

  categories.forEach(item => item.addEventListener('change', () => validateGroupCheckboxes(categories, 'Selecciona al menos una categor�a de inter�s.')));
  clientType.forEach(item => item.addEventListener('change', () => validateGroupRadios(clientType, 'Selecciona el tipo de cliente.')));
  [fields.termsConditions, fields.privacyPolicy].forEach(input => input.addEventListener('change', validateTerms));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (validateAll()) {
      showSuccess();
    } else {
      const firstError = form.querySelector('.campo-error, .campo-error-group');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  updateCharCount();
  updatePasswordStrength(fields.password.value);
});
