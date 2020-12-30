
let searchButton = document.querySelector("#search");
let searchButton1 = document.querySelector("#search1");

searchButton.addEventListener("click", ()=>{
    let inputField = document.querySelector("#searchInput");
        if (inputField.value.length <= 0) {
            alert("Please insert a search term.")
        } else {
            sendApiRequest(inputField.value);
        }
})

searchButton1.addEventListener("click", ()=>{
    let inputField = document.querySelector("#searchInput1");
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
        
            <div class="card" style="width: 18rem;">
                <img src="${data.hits[i].recipe.image}" class="card-img-top" alt="...">
                <div class="card-body cp-bg-gold text-white d-flex flex-column justify-content-between">
                <div>
                    <h3 class="card-title">${data.hits[i].recipe.label}</h3>
                    <p class="card-text">Health Labels: ${data.hits[i].recipe.healthLabels.join(", ")}</p>
                </div>
                    <button onClick="renderModal(${JSON.stringify(recipe).split('"').join("&quot;")})" type="button" class="btn btn-primary cp-bg-blue" data-toggle="modal" data-target="#modal">Full Recipe</button>
                </div>
            </div>
        
            `
    }
}

function generateIngList(ingList) {
    return ingList
            .map(element => `<li>${element}</li>`)
            .join('');  
}


//////////GENERATES MODAL BOX WHEN MORE INFO BUTTON IS CLICKED ON THE CARD//////////////
function renderModal(data) {
    let parseData = JSON.parse(data);
    document.querySelector("#modal").innerHTML = `
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header cp-bg-gold">
                <h4 class="modal-title" id="exampleModalLabel">${parseData.label}</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body cp-bg-blue cp-text-white">
                <ul>
                    ${generateIngList(parseData.ingredientLines)}                 
                </ul>
            </div>
            <div class="modal-body cp-bg-blue cp-text-white">
                <hr class="cp-bg-white">
                <ul>
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
                </ul>
            </div>
            <div class="modal-footer cp-bg-gold">
                <button type="button" class="btn cp-bg-blue cp-text-white" data-dismiss="modal">Close</button>
                <button type="button" class="btn cp-bg-blue cp-text-white" onclick="window.open('${parseData.url}');">Recipe Instructions</button>
            </div>
            </div>
            </div>
        
            `
}

