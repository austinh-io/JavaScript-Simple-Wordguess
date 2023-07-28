const primaryNav = document.querySelector('.primary-navigation');
const navToggle = document.querySelector('.mobile-nav-toggle');
const navToggleOpen = document.querySelector('.mobile-nav-toggle-open');
const navToggleClose = document.querySelector('.mobile-nav-toggle-close');

navToggle.addEventListener('click', () => {
  const visibility = primaryNav.getAttribute('data-visible');

  if (visibility === 'false') {
    primaryNav.setAttribute('data-visible', 'true');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggleClose.setAttribute('style', 'display: block');
    navToggleOpen.setAttribute('style', 'display: none');
  } else {
    primaryNav.setAttribute('data-visible', false);
    navToggle.setAttribute('aria-expanded', 'false');
    navToggleClose.setAttribute('style', 'display: none');
    navToggleOpen.setAttribute('style', 'display: block');
  }
});
