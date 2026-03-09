document.getElementById("sign-btn").addEventListener("click", function () {
  const name = document.getElementById("input-name").value;
  const password = document.getElementById("input-password").value;

  if (name !== "admin") {
    alert("invalid userName");
    return;
  }

  if (password !== "admin123") {
    alert("invalid password");
    return;
  }
  alert("login successful");
  window.location.assign("home.html")

})