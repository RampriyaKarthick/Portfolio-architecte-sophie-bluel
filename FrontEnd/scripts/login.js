

const loginForm = document.getElementById("loginForm");
console.log(loginForm)
loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if(email !== "" && password !== ""){
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(response => {if(response.token){localStorage.setItem("token",response.token);
    window.location.href ="/index.html"
    }
else{
    console.log("Identifiant ou password n'est pas correct")
   let loginError =  document.getElementById("login-error")
   loginError.innerText = "Identifiant ou password n'est pas correct"

}
})
    
        .catch(error => console.error(error))
    }
 

});
