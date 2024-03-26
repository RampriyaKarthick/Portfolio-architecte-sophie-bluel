const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
   
});
