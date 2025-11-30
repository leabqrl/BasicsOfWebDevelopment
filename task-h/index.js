// index.js
// Author: Léa Becquerel
// Date: 2025-11-13

document.addEventListener("DOMContentLoaded", () => {
  // Get form and table elements
  const form = document.getElementById("addPersonForm");
  const tableBody = document.getElementById("timetable").querySelector("tbody");
  const timestampInput = document.getElementById("timestamp");

  // Set timestamp when page loads
  updateTimestamp();

  // Update timestamp every second
  setInterval(updateTimestamp, 1000);

  // Add input listeners to clear errors on change
  const inputFields = ['fullName', 'email', 'phone', 'birthDate', 'terms'];
  inputFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', () => clearFieldError(fieldId));
      field.addEventListener('change', () => clearFieldError(fieldId));
    }
  });

  // Form submission handler
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    
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
    // Remove error classes from all inputs
    const inputs = form.querySelectorAll('input');

    inputs.forEach(input => {
      input.classList.remove('!border-[#e74c3c]', '!bg-[#ffe6e6]');
    });
        
    // Clear all error messages
    const errorMessages = form.querySelectorAll('[id$="Error"]');

    errorMessages.forEach(msg => {
      msg.textContent = '';
    });
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + 'Error');

    if (field) {    
      field.classList.remove('!border-[#e74c3c]', '!bg-[#ffe6e6]');
    }
    
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.add('hidden');
    }
  }

  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(fieldId + 'Error');
    
    if (field) {
      field.classList.add('error');
    }
    
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.remove('hidden');
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
    
    // Validate Phone (Finnish format)
    if (data.phone === '') {
      showError('phone', 'A phone number is required');
      isValid = false;
    } else {
      // Remove all spaces, hyphens, and parentheses for validation
      const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
      
      // Finnish phone format: 0401234567 (national, starts with 0, 9-10 digits total)
      const nationalPattern = /^0[1-9]\d{7,8}$/;
      
      if (!nationalPattern.test(cleanPhone)) {
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
    const cell6 = row.insertCell(5);
    
    // Apply classes to cells
    cell1.className = 'p-[0.6rem_0.75rem] border-b border-[#d0d7e2] w-[17%]';
    cell2.className = 'p-[0.6rem_0.75rem] border-b border-[#d0d7e2] w-[17%] text-center';
    cell3.className = 'p-[0.6rem_0.75rem] border-b border-[#d0d7e2] w-[17%] text-center';
    cell4.className = 'p-[0.6rem_0.75rem] border-b border-[#d0d7e2] w-[17%] text-center';
    cell5.className = 'p-[0.6rem_0.75rem] border-b border-[#d0d7e2] w-[17%] text-center';
    cell6.className = 'p-[0.6rem_0.75rem] border-b border-[#d0d7e2] w-[15%] text-center';
        
    cell1.textContent = data.timestamp;
    cell2.textContent = data.fullName;
    cell3.textContent = data.email;
    cell4.textContent = data.phone;
    cell5.textContent = formatDate(data.birthDate);
    cell6.textContent = data.terms ? 'Accepted' : 'Declined';
    
    // Add fade-in animation
    row.style.animation = 'fadeIn 0.5s ease';
    
    console.log('Row added successfully!'); // Debug
    
    // Apply alternating row colors
    updateRowColors();
  }

  function updateRowColors() {
    const rows = tableBody.querySelectorAll('tr');
  
    rows.forEach((row, idx) => {
  
      if (idx % 2 === 1) {
        row.className = 'bg-[#eef3ff]';
      } 
      else {
        row.className = 'bg-white';
      }
  
      row.style.animation = 'fadeIn 0.5s ease';
    });
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
  `;
  document.head.appendChild(style);

  console.log('Script loaded successfully!');

});



