// Validation rules matching backend
export const validationRules = {
  name: {
    required: true,
    pattern: /^[A-Za-z ]{3,50}$/,
    minLength: 3,
    maxLength: 50,
    message: 'Name must be 3-50 characters and contain only alphabets and spaces'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 6,
    maxLength: 16,
    message: 'Password must be 6-16 characters'
  },
  mobile: {
    required: true,
    pattern: /^[6-9]\d{9}$/,
    message: 'Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9'
  }
};

// Validation function
export const validateField = (field, value) => {
  const rule = validationRules[field];
  if (!rule) return null;

  if (rule.required && (!value || value.trim() === '')) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
  }

  if (value && rule.pattern && !rule.pattern.test(value)) {
    return rule.message;
  }

  if (value && rule.minLength && value.length < rule.minLength) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
  }

  if (value && rule.maxLength && value.length > rule.maxLength) {
    return `${field.charAt(0).toUpperCase() + field.slice(1)} must not exceed ${rule.maxLength} characters`;
  }

  return null;
};

// Validate all fields
export const validateForm = (formData, fields) => {
  const errors = {};
  let isValid = true;

  fields.forEach(field => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};