// Event listener for toggle button
document.getElementById('navbarToggle').addEventListener('click', toggleMenu);

// Toggle menu function
function toggleMenu() {
  const menu = document.getElementById('navigation');
  menu.classList.toggle('navigation-flex');
}

// check validity of form when the user writes in the input

const inputs = document.querySelectorAll('input, textarea');

inputs.forEach(input => {
  input.addEventListener('input', function() {
    if (input.checkValidity()) {
      input.classList.remove('invalid-input');
      input.classList.add('valid-input');
    } else {
      input.classList.remove('valid-input');
      input.classList.add('invalid-input');
    }
  });
});


//Toggle show and hide for password
const pswdBtn = document.querySelector("#pswdBtn");
if (pswdBtn) {
  pswdBtn.addEventListener("click", function() {
    const pswdInput = document.getElementById("account_password");
    const type = pswdInput.getAttribute("type");
    if (type == "password") {
      pswdInput.setAttribute("type", "text");
      pswdBtn.innerHTML = "Hide";
    } else {
      pswdInput.setAttribute("type", "password");
      pswdBtn.innerHTML = "Show";
    }
  });
}


