const togglePasswordFields = document.querySelectorAll(".toggle-password");

togglePasswordFields.forEach((togglePasswordButton) => {
  togglePasswordButton.addEventListener("click", function (e) {
    const passwordInput = togglePasswordButton.previousElementSibling;
    const isPreviousTypePassword =
      passwordInput.getAttribute("type") === "password";
    // toggle the type attribute
    const type = isPreviousTypePassword ? "text" : "password";
    passwordInput.setAttribute("type", type);
    // toggle the button text
    togglePasswordButton.textContent = isPreviousTypePassword ? "Hide" : "Show";
  });
});
