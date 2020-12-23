
let searchButton = document.querySelector("#search");

searchButton.addEventListener("click", ()=>{
    let inputField = document.querySelector("#searchInput");
        if (inputField.value.length <= 0) {
            alert("Please insert a search term.")
        } else {
            sendApiRequest(inputField.value);
        }
})

///////FUCNTION FOR FETCH OF EDAMAM////////////
async function sendApiRequest(value){
    let user = config.APP_ID;
    let key = config.APP_KEY;
    let response = await fetch(`https://api.edamam.com/search?app_id=${user}&app_key=${key}&q=${value}`);
    console.log(response);
    let data = await response.json()
    console.log(data);
    useApiData(data)
}

///////GENERATES CARD WITH INFO FROM API/////////////////////
function useApiData(data){
    document.querySelector("#content").innerHTML = "";
    for (let i = 0;i < 5; i++) {
        let recipe = JSON.stringify(data.hits[i].recipe)
        document.querySelector("#content").innerHTML += ` 
            <img src="${data.hits[i].recipe.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${data.hits[i].recipe.label}</h5>
                <p class="card-text">Health Labels: ${data.hits[i].recipe.healthLabels.join(", ")}</p>
                <button onClick="renderModal(${JSON.stringify(recipe).split('"').join("&quot;")})" type="button" class="btn btn-primary" data-toggle="modal" data-target="#modal">Full Recipe</button>    
            </div>
            `
    }
}



//////////GENERATES MODAL BOX WHEN MORE INFO BUTTON IS CLICKED ON THE CARD//////////////
function renderModal(data) {
    let parseData = JSON.parse(data);
    document.querySelector("#modal").innerHTML = `
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${parseData.label}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <li>
                    ${parseData.ingredientLines}
                </li>
            </div>
            <div class="modal-body">
                <hr>
                <li>
                    Calories: ${Math.round(parseData.calories/parseData.yield)}
                </li>
                <li>
                    FAT: ${Math.round(parseData.totalDaily.FAT.quantity/parseData.yield)}%
                </li>
                <li>
                    Cholesterol: ${Math.round(parseData.totalDaily.CHOLE.quantity/parseData.yield)}%
                </li>
                <li>
                    Sodium: ${Math.round(parseData.totalDaily.NA.quantity/parseData.yield)}%
                </li>
                <li>
                    Carbs: ${Math.round(parseData.totalDaily.CHOCDF.quantity/parseData.yield)}%
                </li>
                <li>
                    Protein: ${Math.round(parseData.totalDaily.PROCNT.quantity/parseData.yield)}%
                </li>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="window.open('${parseData.url}');">Recipe Instructions</button>
            </div>
            </div>
            </div>
        
            `
}

