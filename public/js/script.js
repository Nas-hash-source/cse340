// Event listener for toggle button
document.getElementById('navbarToggle').addEventListener('click', toggleMenu);

// Toggle menu function
function toggleMenu() {
  const menu = document.getElementById('navigation');
  menu.classList.toggle('navigation-flex');
}
