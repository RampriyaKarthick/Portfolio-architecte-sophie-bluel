let apiUrl = "http://localhost:5678/api"
let categories = []


function getCategories(){
   fetch(apiUrl+"/categories")
    .then(response => response.json())
    .then(response =>  {
        console.log(response); 
        categories = response
        
})
    .then(() => {
       
        insertFilter()
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });

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
        let filteredWorks = response.filter(work => work.categoryId == parseInt(categoryId));
        console.log(filteredWorks);
        displayWorks(filteredWorks);
    })
    .catch(error => {
        console.error('Error fetching works by category ID:', error);
    });
}

getCategories();

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
