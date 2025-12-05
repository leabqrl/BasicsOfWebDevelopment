document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rental-order-form");
  if (!form) return;

  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const successMessage = document.getElementById("form-success");

  const today = new Date().toISOString().split("T")[0];
  if (startDateInput) startDateInput.min = today;
  if (endDateInput) endDateInput.min = today;

  const showError = (field, message) => {
    const row = field.closest(".form-row");
    if (!row) return;
    console.log("Error on field:", field.id || field.name);

    const errorElement = row.querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.color = "#b91c1c";
      errorElement.style.display = "block"; 
    }
    field.classList.add("is-invalid");
  };

  const clearError = (field) => {
    const row = field.closest(".form-row");
    if (!row) return;

    const errorElement = row.querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = "";
    }
    field.classList.remove("is-invalid");
  };

  const validateField = (field) => {
    if (!field) return true;

    clearError(field);

    // Checkbox
    if (field.type === "checkbox") {
      if (field.required && !field.checked) {
        showError(field, "You must accept the terms to send a request.");
        return false;
      }
      return true;
    }

    // Autres champs
    if (!field.checkValidity()) {
      if (field.validity.valueMissing) {
        showError(field, "This field is required.");
      } else if (field.type === "email" && field.validity.typeMismatch) {
        showError(field, "Please enter a valid email address.");
      } else if (field.type === "tel" && field.validity.patternMismatch) {
        showError(field, "Please enter a valid phone number.");
      } else if (
        field.type === "number" &&
        (field.validity.rangeUnderflow || field.validity.rangeOverflow)
      ) {
        const min = field.min ? `min ${field.min}` : "";
        const max = field.max ? `max ${field.max}` : "";
        showError(field, `Please enter a value between ${min} ${max}`.trim());
      } else {
        showError(field, "Please check this field.");
      }
      return false;
    }

    return true;
  };

  const validateDatesConsistency = () => {
    if (!startDateInput || !endDateInput) return true;
    clearError(startDateInput);
    clearError(endDateInput);

    if (startDateInput.value && endDateInput.value) {
      const start = new Date(startDateInput.value);
      const end = new Date(endDateInput.value);
      if (end < start) {
        showError(endDateInput, "End date must be after start date.");
        return false;
      }
    }
    return true;
  };

  // Validation au blur
  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  // Submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.textContent = "";

    let isFormValid = true;

    const fields = form.querySelectorAll("input[name], select[name], textarea[name]");

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid) isFormValid = false;
    });

    if (!validateDatesConsistency()) {
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }

    form.reset();
    form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
    form.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
    successMessage.textContent =
      "Thank you! Your rental request has been sent. We will contact you shortly.";
  });
});
