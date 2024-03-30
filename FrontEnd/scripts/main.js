

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




function getWorks() {
    return fetch(apiUrl + "/works")
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching works');
            }
            return response.json();
        })
        .then(works => {
            return works;
        })
        .catch(error => {
            console.error('Error fetching works:', error);
            return []; // Return an empty array in case of an error
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



// function displayWorks(works) {
//     document.getElementById("works-container").innerHTML = "";
//     for (let i = 0; i < works.length; i++) {
//         let work = works[i];
//         let workElement = document.createElement("div");
//         workElement.classList.add("work-class"); 
//         workElement.innerHTML = `
//             <figure>
//                 <img src="${work.imageUrl}" alt="${work.title}">
//                 <figcaption>${work.title}</figcaption>
//             </figure>
//         `;
//         document.getElementById("works-container").appendChild(workElement);
//     }
// }

function displayWorks(works) {
    const modalDisplayStyle = getComputedStyle(modal).display; // Get the display style of the modal
    
    document.getElementById("works-container").innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        let work = works[i];
        let workElement = document.createElement("div");
        workElement.classList.add("work-class"); 
        
        // Create the image element
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        // Create the delete icon element
        const deleteIcon = document.createElement("div");
        deleteIcon.classList.add("delete-icon");
        deleteIcon.innerHTML = "&times;";

        // Add event listener to the delete icon
        deleteIcon.addEventListener("click", function() {
            deleteWork(work.id);
        });

        // Append image and delete icon to work element
        workElement.appendChild(img);

        // Conditionally append delete icon based on modal display style
        if (modalDisplayStyle !== "none") {
            workElement.appendChild(deleteIcon);
        }

        // Append work element to container
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

document.addEventListener("DOMContentLoaded", function(){
const modal = document.getElementById("modal")
const galleryVue = document.getElementById("galerie")
const closeButton = document.getElementsByClassName("close")[0]
const AjoutProjetButton = document.getElementById("ajout-projet-btn")

function openModal(){
    modal.style.display = "block"
    getWorks().then(works => displayWorks(works));
}
function closeModal() {
    modal.style.display = "none";
}

document.getElementById("edit-icon").addEventListener("click", openModal);
closeButton.addEventListener("click", closeModal);

window.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

let childModal = document.getElementById("child-modal");

AjoutProjetButton.addEventListener("click", function() {
    childModal.style.display = "block";
});

function displayWorks(works) {
    galleryVue.innerHTML = "";
    works.forEach(work => {
        const container = document.createElement("div");
        container.classList.add("work-container");
        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
        container.appendChild(img);
        container.appendChild(deleteIcon);
        galleryVue.appendChild(container);
   });
}

})


function goBack() {
    document.getElementById('child-modal').style.display = 'none';
    document.getElementById('modal').style.display = 'block';
}

function closeChildModal() {
    const childModal = document.getElementById('child-modal');
    childModal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    const photoInput = document.getElementById("photo-input");
    const ajoutClass = document.getElementById("ajout_class");

    photoInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = document.createElement("img");
            img.src = event.target.result;
            img.alt = "Uploaded Image";
            ajoutClass.innerHTML = ''; 
            ajoutClass.appendChild(img); 
        };

   
        reader.readAsDataURL(file);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const categories = ["General","Objets", "Appartments", "Hotels & Restaurants"];
    const categorySelect = document.getElementById("project-category");

    categories.forEach(category => {
        const option = document.createElement("option");
      
        option.text = category;
        categorySelect.appendChild(option);
    });
});

