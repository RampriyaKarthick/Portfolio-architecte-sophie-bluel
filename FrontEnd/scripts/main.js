let apiUrl = "http://localhost:5678/api";
let categories = [];
let token;
let filterInserted = false;

function getCategories() {
  fetch(apiUrl + "/categories")
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      categories = response;
      let token = getToken()
      if(!token){
        insertFilter(); 
      }
      
    })
    .then(() =>{ const categorySelect = document.getElementById("project-category");
console.log(categorySelect)
console.log(document.getElementById("project-category"))

    categories.forEach((category) => {
        console.log(category)
      const option = document.createElement("option");
  option.value = category.id
      option.text = category.name;
      categorySelect.appendChild(option);
    });
})
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}



function insertFilter() {
  let filterOption = document.getElementById("filter-options");
  let tous = document.createElement("button");
  tous.innerText = "Tous";
  tous.id = 0;
  filterOption.appendChild(tous);

  tous.style.backgroundColor = "#1D6154";
  tous.style.color = "white";

  let buttonClickedBefore = tous;

  tous.addEventListener("click", function () {
    getWorks().then((works) => {
      displayWorks(works);

      tous.style.backgroundColor = "#1D6154";
      tous.style.color = "white";

      buttonClickedBefore.style.backgroundColor = "";
      buttonClickedBefore.style.color = "#1D6154";

      buttonClickedBefore = tous;
    });
  });

  for (let i = 0; i < categories.length; i++) {
    let filterBtn = document.createElement("button");
    filterBtn.innerText = categories[i].name;
    filterBtn.id = categories[i].id;
    filterOption.appendChild(filterBtn);

    filterBtn.addEventListener("click", function () {
      let categoryId = this.id;
      getWorksByCategoryId(categoryId);
      filterBtn.style.backgroundColor = "#1D6154";
      filterBtn.style.color = "white";
      buttonClickedBefore.style.backgroundColor = "";
      buttonClickedBefore.style.color = "#1D6154";
      buttonClickedBefore = filterBtn;
    });
  }
}

function deleteFilter() {
  let filterOption = document.getElementById("filter-options");
  if (filterOption) {
    filterOption.remove();
    filterOption.innerHTML = "";
  }
}

function getWorks() {
  return fetch(apiUrl + "/works")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching works");
      }
      return response.json();
    })
    .then((works) => {
      return works;
    })
    .catch((error) => {
      console.error("Error fetching works:", error);
      return []; // Return an empty array in case of an error
    });
}

function getWorksByCategoryId(categoryId) {
  fetch(apiUrl + "/works")
    .then((response) => response.json())
    .then((response) => {
      let filteredWorks = response.filter(
        (work) => work.categoryId === parseInt(categoryId)
      );
      console.log(filteredWorks);
      displayWorks(filteredWorks);
    })
    .catch((error) => {
      console.error("Error fetching works by category ID:", error);
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
  

  document.getElementById("works-container").innerHTML = "";
  for (let i = 0; i < works.length; i++) {
    let work = works[i];
    let workElement = document.createElement("div");
    workElement.classList.add("work-class");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    workElement.appendChild(img);

    document.getElementById("works-container").appendChild(workElement);
    
  }
}

function getToken() {
  if (localStorage.getItem("token")) {
    return localStorage.getItem("token");
  } else {
    return false;
  }
}

function deleteToken() {
  localStorage.removeItem("token");
  revertModeEdition();
}

function modeEdition() {
  let bodyElement = document.getElementById("mode_edition");

  bodyElement.innerHTML =
    '<div class="body_class">' +
    '<i class="fas fa-edit"></i>' +
    "<h4><span>Mode édition</span></h4>" +
    "</div>";
  let bodyElement1 = document.getElementById("mode_edition1");
  bodyElement1.innerHTML =
    '<div id="modify_class" class="modify_class">' +
    "<h2>Mes Projets</h2>" +
    '<i class="fas fa-edit" id="edit-icon"><span>modifier</span></i>' +
    "</div>";
  deleteFilter();
  closeChildModal();
  //   getWorks().then((works) => displayWorks(works));
  getUpdatedWorks();
}

function getUpdatedWorks() {
  getWorks().then((works) => {
    // Check if the mode edition is active
    if (document.getElementById("mode_edition").innerHTML !== "") {
      displayWorks(works);
    }
  });
}

function resetModifyButton() {
  let bodyElement1 = document.getElementById("mode_edition1");
  bodyElement1.innerHTML =
    '<div id="modify_class" class="modify_class">' +
    "<h2>Mes Projets</h2>" +
    "</div>";
}




function revertModeEdition() {
  let bodyElement = document.getElementById("mode_edition");
  bodyElement.innerHTML = "";
  let header = document.querySelector("header");
  let anchorTag = header.querySelector("a");
  anchorTag.innerHTML = "login";
  anchorTag.setAttribute("href", "/login.html");

 
  closeModal();
  closeChildModal();
  resetModifyButton();
}

function logOutButton() {
  let header = document.querySelector("header");
  let anchorTag = header.querySelector("a");
  let token = getToken();
  if (token) {
    anchorTag.innerHTML = "logout";
    anchorTag.addEventListener("click", function (e) {
      e.preventDefault();
      deleteToken();
    });
    return true;
  }

  return false;
}

logOutButton();

function tokenExist() {
  let token = getToken();
  if (token) {
    modeEdition();
  } else {
    revertModeEdition();
  }
}
tokenExist();

document.addEventListener("DOMContentLoaded", function () {
    getCategories();
  const modal = document.getElementById("modal");
  const childModal = document.getElementById("child-modal");

  const token = getToken();

  const editIcon = document.getElementById("edit-icon");
  let editIconClicked = false;

  editIcon.addEventListener("click", function () {
    editIconClicked = true;
    if (token) {
      openModal();
    }
  });
  if (token && editIconClicked) {
    modal.style.display = "block";
    getWorks().then((works) => displayWorks(works));
  } else {
    modal.style.display = "none";
    childModal.style.display = "none";
  }

  const galleryVue = document.getElementById("galerie");
  const closeButton = document.getElementsByClassName("close")[0];
  const AjoutProjetButton = document.getElementById("ajout-projet-btn");

  function openModal() {
    modal.style.display = "block";
    getWorks().then((works) => displayWorks(works));
  }

  let closeModal = function closeModal() {
    modal.style.display = "none";
  };

  document.getElementById("edit-icon").addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  AjoutProjetButton.addEventListener("click", function () {
    childModal.style.display = "block";
  });

  function displayWorks(works) {
    
   
const galleryVue = document.getElementById("galerie");
    galleryVue.innerHTML = "";
    works.forEach((work) => {
      const container = document.createElement("div");
      container.classList.add("work-container");
      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.alt = work.title;
      const deleteIcon = document.createElement("i");
      deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
      deleteIcon.addEventListener("click", function () {
        const workIdToDelete = work.id;

        // api to delete the work
        const apiUrl = "http://localhost:5678/api/works/" + workIdToDelete;
        const token = getToken();

        fetch(apiUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete work entry");
            }
            console.log("Work entry deleted successfully");

            container.remove();
          })
          .catch((error) => {
            console.error("Error deleting work entry:", error);
          });
      });

      container.appendChild(img);
      container.appendChild(deleteIcon);

      galleryVue.appendChild(container);
    });
  }
});

function closeModal() {
  modal.style.display = "none";
}

function goBack() {
  document.getElementById("child-modal").style.display = "none";
  document.getElementById("modal").style.display = "block";
}

function closeChildModal() {
  const childModal = document.getElementById("child-modal");
  childModal.style.display = "none";
}
let photoInput = document.getElementById("photo-input");

document.addEventListener("DOMContentLoaded", function () {
  
  const ajoutClass = document.getElementById("ajout_class");

  photoInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = document.createElement("img");
      img.src = event.target.result;
      img.alt = "Uploaded Image";
      ajoutClass.innerHTML = "";
      ajoutClass.appendChild(img);
    };

    reader.readAsDataURL(file);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  
  
});

document.addEventListener("DOMContentLoaded", function () {
    const validerButton = document.getElementById("valider_btn");
    const worksForm = document.getElementById("add-photos-form");

    worksForm.addEventListener("submit", function (event) {
        event.preventDefault(); 
console.log(event)
        // Checking if the form is filled completely
        
        console.log(photoInput.files[0])
        const title = document.getElementById("project-title").value;
        console.log(title)
        const category = document.getElementById("project-category").value;
        console.log(category)
        
        if (title && category && photoInput) {
            validerButton.style.backgroundColor = "#1D6154"; 
        } else {
          
            validerButton.style.backgroundColor = ""; 
        }
let formData = new FormData()
formData.append("title", title)
formData.append("category", category)
formData.append("image", photoInput.files[0])
const token = getToken();
        fetch(apiUrl+"/works", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to add work entry");
              }
              
              console.log(response)
  
    
            })
            .catch((error) => {
              console.error("Error deleting work entry:", error);
            });
    });
});


console.log(document.getElementById("photo-input"))