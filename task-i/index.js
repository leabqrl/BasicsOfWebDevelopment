// script.js

// Ajout d'une animation au scroll

// Accessibilité : focus sur les liens
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('focus', () => {
    link.style.outline = '2px solid #ff3131';
  });
  link.addEventListener('blur', () => {
    link.style.outline = 'none';
  });
});