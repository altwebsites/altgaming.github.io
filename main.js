(function () {
  'use strict';

  // ----- Toast -----
  function toast(message) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-8px)';
      setTimeout(function () { el.remove(); }, 300);
    }, 3500);
  }

  // ----- Modals -----
  var overlay = document.getElementById('modal-overlay');
  var modalLogin = document.getElementById('modal-login');
  var modalJoin = document.getElementById('modal-join');
  var modalDownload = document.getElementById('modal-download');

  function openModal(modal) {
    if (!overlay || !modal) return;
    overlay.hidden = false;
    overlay.setAttribute('aria-hidden', 'false');
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var firstInput = modal.querySelector('input, button');
    if (firstInput) firstInput.focus();
  }

  function closeModals() {
    if (overlay) {
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    }
    if (modalLogin) modalLogin.hidden = true;
    if (modalJoin) modalJoin.hidden = true;
    if (modalDownload) modalDownload.hidden = true;
    document.body.style.overflow = '';
  }

  function setupModal(openBtn, modal, closeBtn) {
    if (openBtn) openBtn.addEventListener('click', function () { openModal(modal); });
    if (closeBtn) closeBtn.addEventListener('click', closeModals);
  }

  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModals();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModals();
  });

  setupModal(document.getElementById('btn-login'), modalLogin, document.getElementById('close-login'));
  setupModal(document.getElementById('btn-join'), modalJoin, document.getElementById('close-join'));

  var btnDownloadHero = document.getElementById('btn-download-hero');
  var btnDownloadWindows = document.getElementById('btn-download-windows');
  var linkDownloadMac = document.getElementById('link-download-mac');
  var linkDownloadLinux = document.getElementById('link-download-linux');

  function openDownloadModal(platform) {
    if (!modalDownload) return;
    openModal(modalDownload);
    var options = modalDownload.querySelectorAll('.download-option');
    var confirmBtn = document.getElementById('btn-download-confirm');
    platform = platform || 'Windows';
    options.forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-platform') === platform);
    });
    if (confirmBtn) {
      confirmBtn.textContent = 'Download for ' + platform;
      confirmBtn.setAttribute('data-platform', platform);
    }
  }

  if (btnDownloadHero) btnDownloadHero.addEventListener('click', function () { openDownloadModal('Windows'); });
  if (btnDownloadWindows) btnDownloadWindows.addEventListener('click', function () { openDownloadModal('Windows'); });
  if (linkDownloadMac) {
    linkDownloadMac.addEventListener('click', function (e) { e.preventDefault(); openDownloadModal('macOS'); });
  }
  if (linkDownloadLinux) {
    linkDownloadLinux.addEventListener('click', function (e) { e.preventDefault(); openDownloadModal('Linux'); });
  }

  if (modalDownload) {
    modalDownload.querySelectorAll('.download-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        modalDownload.querySelectorAll('.download-option').forEach(function (o) { o.classList.remove('active'); });
        opt.classList.add('active');
        var platform = opt.getAttribute('data-platform');
        var confirmBtn = document.getElementById('btn-download-confirm');
        if (confirmBtn) {
          confirmBtn.textContent = 'Download for ' + platform;
          confirmBtn.setAttribute('data-platform', platform);
        }
      });
    });
  }

  var btnDownloadConfirm = document.getElementById('btn-download-confirm');
  if (btnDownloadConfirm) {
    btnDownloadConfirm.addEventListener('click', function () {
      var platform = btnDownloadConfirm.getAttribute('data-platform') || 'Windows';
      toast('Download started for ' + platform + '. Check your downloads folder.');
      closeModals();
    });
  }

  setupModal(null, modalDownload, document.getElementById('close-download'));

  // ----- Forms -----
  var formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      toast('Welcome back! (Demo — no server connected)');
      closeModals();
    });
  }

  var formJoin = document.getElementById('form-join');
  if (formJoin) {
    formJoin.addEventListener('submit', function (e) {
      e.preventDefault();
      toast('Account created! Check your email to verify. (Demo)');
      closeModals();
    });
  }

  // ----- Nav: smooth scroll to sections -----
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----- Browse games -----
  var btnBrowseGames = document.getElementById('btn-browse-games');
  if (btnBrowseGames) {
    btnBrowseGames.addEventListener('click', function () {
      var games = document.getElementById('games');
      if (games) games.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ----- Play now (game cards) -----
  document.querySelectorAll('.game-play-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var game = btn.getAttribute('data-game') || 'Game';
      toast('Launching ' + game + '… Install the launcher to play.');
    });
  });
  // ----- Placeholder links: prevent default, show toast -----
  document.querySelectorAll('.link-arrow').forEach(function (a) {
    if (a.getAttribute('href') === '#') {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        toast('Coming soon!');
      });
    }
  });

  document.querySelectorAll('.footer-links a').forEach(function (a) {
    if (a.getAttribute('href') === '#') {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        toast('Page coming soon.');
      });
    }
  });

  // ----- Secret admin: triple-click logo -----
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

  // ----- PWA: Register service worker (only over http/https) -----
  if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function () {
        // Registered
      }).catch(function () {
        // Ignore
      });
    });
  }
})();
