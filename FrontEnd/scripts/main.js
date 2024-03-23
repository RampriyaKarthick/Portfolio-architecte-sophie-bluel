let apiUrl = "http://localhost:5678/api"
let categories = []
function getCategories(){
    fetch(apiUrl+"/categories")
    .then(response => response.json())
    .then(response => categories = response)
    .then(() => {
       
        insertFilter()
    })
    
}
function insertFilter(){
    let filterOption = document.getElementById("filter-options")
    let tous = document.createElement("button")
    tous.innerText ="Tous"
    tous.id = 0
    filterOption.appendChild(tous)
    for(let i=0; i<categories.length ; i++){
        // console.log(categories[i].name)
        let filterBtn = document.createElement("button")
        filterBtn.innerText = categories[i].name
        filterBtn.id = categories[i].id
        filterOption.appendChild(filterBtn)
    }
}

getCategories();

function loginUser(token){
    fetch(apiUrl+"/users/login")
}