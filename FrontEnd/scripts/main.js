

let apiUrl = "http://localhost:5678/api"
let categories = []
let token;

function getCategories(){
    fetch(apiUrl+"/categories")
        .then(response => response.json())
        .then(response =>  {
            console.log(response); 
            categories = response;
            insertFilter(); // Call insertFilter only when categories are fetched successfully
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

function reloadCategories() {
    getCategories();
}


function insertFilter(){
    let filterOption = document.getElementById("filter-options");
    let tous = document.createElement("button");
    tous.innerText ="Tous";
    tous.id = 0;
    filterOption.appendChild(tous);
    
    tous.addEventListener('click', function() {
        getWorks();
    });

    for(let i = 0; i < categories.length; i++){
        let filterBtn = document.createElement("button");
        filterBtn.innerText = categories[i].name;
        filterBtn.id = categories[i].id;
        filterOption.appendChild(filterBtn);

        filterBtn.addEventListener('click', function() {
            let categoryId = this.id;
            getWorksByCategoryId(categoryId);
        });
      
    }
}


function deleteFilter() {
    let filterOption = document.getElementById("filter-options");
    if (filterOption) {
        filterOption.remove(); 
        filterOption.innerHTML = '';
    }
}





function getWorks(){
    fetch(apiUrl+"/works")
    .then(response => response.json())
    .then(response =>  {
        console.log(response); 
        displayWorks(response);
    })
    .catch(error => {
        console.error('Error fetching works:', error);
    });
}

function getWorksByCategoryId(categoryId){
    fetch(apiUrl+"/works")
    .then(response => response.json())
    .then(response =>  {
        let filteredWorks = response.filter(work => work.categoryId === parseInt(categoryId));
        console.log(filteredWorks);
        displayWorks(filteredWorks);
    })
    .catch(error => {
        console.error('Error fetching works by category ID:', error);
    });
}



function displayWorks(works) {
    document.getElementById("works-container").innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        let work = works[i];
        let workElement = document.createElement("div");
        workElement.classList.add("work-class"); 
        workElement.innerHTML = `
            <figure>
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            </figure>
        `;
        document.getElementById("works-container").appendChild(workElement);
    }
}

function getToken(){
    if(localStorage.getItem("token")){
        return localStorage.getItem("token")
    }
    else{
        return false
    }
}

function deleteToken(){
        localStorage.removeItem("token")
        revertModeEdition()
     
    }

function modeEdition(){

   let bodyElement = document.getElementById("mode_edition")
  
bodyElement.innerHTML = '<div class="body_class">'+
'<i class="fas fa-edit"></i>'+
'<h4><span>Mode édition</span></h4>'+
'</div>'
let bodyElement1 = document.getElementById("mode_edition1")
bodyElement1.innerHTML = '<div id="modify_class" class="modify_class">'+
'<h2>Mes Projets</h2>'+
'<i class="fas fa-edit" id="edit-icon"><span>modifier</span></i>'+
'</div>'
let editIcon = document.getElementById("edit-icon");
console.log(editIcon)
editIcon.addEventListener("click", function formGalleryAndAddOption(){
    let form = document.createElement("form");

    form.innerHTML =   `
    <button type="button" onclick="displayWorks()">Display Works</button>
    <button type="submit">Add Project</button>

    `
    console.log(form)
    document.getElementById('mode_edition1')
    let editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");
    editContainer.appendChild(form);

});
deleteFilter()

}



function resetModifyButton(){
    let bodyElement1 = document.getElementById("mode_edition1")
bodyElement1.innerHTML = '<div id="modify_class" class="modify_class">'+
'<h2>Mes Projets</h2>'+

'</div>'
}

function revertModeEdition() {
    let bodyElement = document.getElementById("mode_edition");
    bodyElement.innerHTML = ''
    let header = document.querySelector('header');
        let anchorTag = header.querySelector('a');
        anchorTag.innerHTML = "login";
        anchorTag.setAttribute('href', '/login.html');
      
getCategories()
resetModifyButton()

   
}

function logOutButton(){
    let header = document.querySelector('header');
    let anchorTag = header.querySelector('a');
    let token = getToken()
    if(token){
        anchorTag.innerHTML = "logout"
        anchorTag.addEventListener('click', function(e){
            e.preventDefault()
            deleteToken()
        })
        return true;
    }
   
    return false;
}

logOutButton();



function tokenExist(){
   let token = getToken()
   if(token){
    modeEdition()
   }
   else{
    revertModeEdition()
   }
}
tokenExist()

