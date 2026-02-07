(function () {
  'use strict';

  // Secret admin: triple-click the logo to reveal the admin link
  var trigger = document.getElementById('secret-trigger');
  var hint = document.getElementById('admin-hint');
  var clickCount = 0;
  var resetTimer = null;

  if (trigger && hint) {
    trigger.addEventListener('click', function () {
      clickCount++;
      clearTimeout(resetTimer);
      if (clickCount >= 3) {
        hint.hidden = false;
        clickCount = 0;
      }
      resetTimer = setTimeout(function () {
        clickCount = 0;
      }, 600);
    });
  }
})();
