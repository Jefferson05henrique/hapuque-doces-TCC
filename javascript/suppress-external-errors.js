// suppress-external-errors.js
// Suprime erros de recursos externos bloqueados por ad-blockers ou CSP
// Esses erros não afetam a funcionalidade do site

(function () {
  'use strict';

  // Intercepta erros de rede bloqueados (Google Maps, Translate, etc.)
  window.addEventListener('error', function(event) {
    if (!event.filename) return; // Ignora erros sem filename
    
    const blockedDomains = [
      'maps.googleapis.com',
      'translate.googleapis.com',
      'google.com/maps',
      'recaptcha.net'
    ];

    // Verifica se o erro vem de um domínio conhecido que pode ser bloqueado
    if (blockedDomains.some(domain => event.filename.includes(domain))) {
      // Suprime o erro (não faz nada, apenas ignora)
      event.preventDefault();
      return true;
    }
  }, true);

  // Também suprime erros em iframes (como Google Maps embed)
  window.addEventListener('error', function(event) {
    if (event.target && event.target.tagName === 'IFRAME') {
      // Ad-blockers podem bloquear iframe do Maps - isto é esperado
      console.warn('[Info] Iframe bloqueado (provável ad-blocker) - funcionalidade não afetada');
      event.preventDefault();
      return true;
    }
  }, true);
})();
