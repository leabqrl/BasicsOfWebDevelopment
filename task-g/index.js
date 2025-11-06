// index.js
// Author: Léa Becquerel
// Date: 2025-11-06

document.addEventListener("DOMContentLoaded", () => {
  // Get form and table elements
  const form = document.getElementById("addPersonForm");
  const tableBody = document.getElementById("timetable").querySelector("tbody");
  const timestampInput = document.getElementById("timestamp");

  // Set timestamp when page loads
  updateTimestamp();

  // Update timestamp every second
  setInterval(updateTimestamp, 1000);

  // Form submission handler
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    
    console.log('Form submitted!'); // Debug
    
    // Clear previous errors
    clearErrors();
    
    // Get form values
    const formData = {
      timestamp: timestampInput.value,
      fullName: document.getElementById('fullName').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      birthDate: document.getElementById('birthDate').value,
      terms: document.getElementById('terms').checked
    };
    
    console.log('Form data:', formData); // Debug
    
    // Validate form
    const isValid = validateForm(formData);
    console.log('Is valid:', isValid); // Debug
    
    if (isValid) {
      addToTable(formData);
      form.reset();
      updateTimestamp();
      showSuccessMessage();
    }
  });

  // FUNCTIONS

  function updateTimestamp() {
    const now = new Date();
    timestampInput.value = formatDateTime(now);
  }

  function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  function clearErrors() {
    // Remove error class from all inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
    
    // Clear all error messages (if you add spans for errors)
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + 'Error');
    
    if (field) {
      field.classList.add('error');
    }
    
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }

  function validateForm(data) {
    let isValid = true; 
    
    // Validate Full Name (at least 2 words, each ≥ 2 chars)
    if (data.fullName === '') {
      showError('fullName', 'Full name is required');
      isValid = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(data.fullName)) {
      showError('fullName', 'The name can only contain letters, spaces, hyphens, and apostrophes.');
      isValid = false;
    } else {
      // Split by spaces and filter out empty strings
      const words = data.fullName.trim().split(/\s+/).filter(word => word.length > 0);
      
      if (words.length < 2) {
        showError('fullName', 'The full name must contain at least 2 words (first name and last name)');
        isValid = false;
      } else {
        // Check if each word has at least 2 characters
        const invalidWords = words.filter(word => word.length < 2);
        if (invalidWords.length > 0) {
          showError('fullName', 'Each word in the full name must contain at least 2 characters');
          isValid = false;
        }
      }
    }
    
    // Validate Email
    if (data.email === '') {
      showError('email', 'Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }
    
    // Validate Phone (Finnish format: +358 or 0, followed by 9-10 digits)
    if (data.phone === '') {
      showError('phone', 'A phone number is required');
      isValid = false;
    } else {
      // Remove all spaces, hyphens, and parentheses for validation
      const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
      
      // Finnish phone formats:
      // +358401234567 (international, 9-10 digits after +358)
      // 0401234567 (national, starts with 0, 9-10 digits total)
      const internationalPattern = /^\+358[1-9]\d{7,9}$/;
      const nationalPattern = /^0[1-9]\d{7,8}$/;
      
      if (!internationalPattern.test(cleanPhone) && !nationalPattern.test(cleanPhone)) {
        showError('phone', 'Invalid format. Use +358401234567 or 0401234567');
        isValid = false;
      }
    }
    
    // Validate Birth Date
    if (data.birthDate === '') {
      showError('birthDate', 'The date of birth is required');
      isValid = false;
    } else {
      const birthDate = new Date(data.birthDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      
      let actualAge = age;
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
      }
      
      if (birthDate > today) {
        showError('birthDate', 'The date of birth cannot be in the future.');
        isValid = false;
      } else if (actualAge < 13) {
        showError('birthDate', 'You must be at least 13 years old');
        isValid = false;
      } else if (actualAge > 120) {
        showError('birthDate', 'Please enter a valid date of birth');
        isValid = false;
      }
    }
    
    // Validate Terms
    if (!data.terms) {
      showError('terms', 'You must accept the terms of use');
      isValid = false;
    }
    
    // Show all errors if invalid
    if (!isValid) {
      showCustomAlert(errorMessages.join('\n'), 'error');
    }
    
    return isValid;
  }

  function addToTable(data) {
    console.log('Adding to table:', data); // Debug
    
    const row = tableBody.insertRow(0); // Insert at the beginning
    
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    const cell4 = row.insertCell(3);
    const cell5 = row.insertCell(4);
    
    cell1.textContent = data.timestamp;
    cell2.textContent = data.fullName;
    cell3.textContent = data.email;
    cell4.textContent = data.phone;
    cell5.textContent = formatDate(data.birthDate);
    
    // Add fade-in animation
    row.style.animation = 'fadeIn 0.5s ease';
    
    console.log('Row added successfully!'); // Debug
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
    
    input.error {
      border-color: #e74c3c !important;
      background-color: #ffe6e6 !important;
    }
  `;
  document.head.appendChild(style);

  console.log('Script loaded successfully!');

});
