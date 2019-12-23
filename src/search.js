const mainSearchDiv = document.createElement('div')
mainSearchDiv.id = "main-search-div"

const searchBar = document.createElement('div')
const searchHeaderDiv = document.createElement('div')
const searchHeader = document.createElement('h2')
searchHeader.textContent = "Search For Monsters"
searchHeaderDiv.appendChild(searchHeader)
const resultDiv = document.createElement('div')
const queryForm = document.createElement('form')
    searchBar.id = "search-bar"
    resultDiv.id = "result-div"
    queryForm.id = "query-form"
queryForm.appendChild(searchHeaderDiv)
const formSubmitDiv = document.createElement('div')
formSubmitDiv.id = "form-submit-div"
const formSubmit = document.createElement('button')
    formSubmit.textContent = "Get Some Monsters!"
    formSubmit.id = "form-submit"
    formSubmitDiv.appendChild(formSubmit)

queryForm.addEventListener('submit', event => {
    event.preventDefault()
    let allSelects = document.querySelectorAll('select')
    const selections = []
    allSelects.forEach(selection => {
        selections.push(selection.value)
    })
    fetchResults(selections)
    document.body.appendChild(resultDiv)
})



function fetchResults(selections){
    fetch("https://dnd-encounter-builder.herokuapp.com/monsters/search/", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            party_size: selections[0],
            party_level: selections[1],
            monster_size: selections[2],
            monster_alignment: selections[3],
            monster_difficulty: selections[4]
        })
    }).then(response => response.json())
    .then(result => {
        document.getElementById('result-div').innerHTML = ""
        if (result.message == "No Results Found, Please Try Again") {
            displayNoResults(result.message)
        }
        else {
        result.forEach(monsterObj => {
            createMonsterCard(monsterObj)
        })
        }
    })
}

function displayNoResults(results){
    let noResults = document.createElement('h3')
    noResults.id = "no-results"
    noResults.textContent = results
    resultDiv.appendChild(noResults)
}

const selectDictionary = 
{
    partySizeOptions: [1,2,3,4,5,6,7,8,9,10],
    partyLevelOptions: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    monsterSizeOptions: ["Any", "Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"],
    monsterAlignmentOptions: ["Any", "lawful evil", "any alignment", "chaotic evil", "chaotic good", "lawful good", 
    "neutral", "lawful neutral", "unaligned", "any non-good alignment", "any non-lawful alignment", 
    "neutral evil", "any chaotic alignment", "neutral good", "chaotic neutral", 
    "neutral good (50%) or neutral evil (50%)", "any evil alignment"],
    monsterDifficultyOptions: ["Easy", "Medium", "Hard", "Challenging"]
}

for(var key in selectDictionary){
    let selection = selectDictionary[key]
    let formSelectDiv = document.createElement('div')
    formSelectDiv.className = "search-select-div"
    let select = document.createElement('select')
    let label = document.createElement('label')
    formSelectDiv.append(label,select)
    label.setAttribute("for", key)
    label.id = key
    selection.forEach(value => {
        let option = document.createElement('option')
        option.value = value
        option.textContent = value
        select.appendChild(option)
        queryForm.append(formSelectDiv)
    })
}

searchBar.appendChild(queryForm)
mainSearchDiv.appendChild(searchBar)
document.body.appendChild(mainSearchDiv)

function createMonsterCard(monsterObj){
    const card = document.createElement('div')
    card.className = "card"
    card.id = monsterObj.name
    card.innerHTML = `
    <div class="card-header">
    <h3 class="card-title">${monsterObj.name}</h3>
    </div>
    <div class="card-list">
            <li> Type: <span> ${monsterObj.style} </span></li>
            <li> Size: <span> ${monsterObj.size} </span></li>
            <li> Alignment: <span> ${monsterObj.alignment} </span></li>
            <li class="challenge-list-item"> Challenge Rating: <span> ${monsterObj.challenge_rating} </span></li>
    </div>
    <div class="card-stats-list">
        
            <li>Armor Class:<span>${monsterObj.armor_class}</span></li>
            <li>Hit Points:<span>${monsterObj.hit_points}</span></li>
            <li>Hit Dice:<span>${monsterObj.hit_dice}</span></li>
            <li>Strength:<span>${monsterObj.strength}</span></li>
            <li>Dexterity:<span>${monsterObj.dexterity}</span></li>
            <li>Constitution:<span>${monsterObj.constitution}</span></li>
            <li>Intelligence:<span>${monsterObj.intelligence}</span></li>
            <li>Wisdom:<span>${monsterObj.wisdom}</span></li>
            <li>Charisma:<span>${monsterObj.charisma}</span></li>
            <input type="hidden" id="${monsterObj.id}" value="${monsterObj.id}" />
    </div>`
    const addMonsterButton = document.createElement('button')
    addMonsterButton.className = "add-button"
    addMonsterButton.id = monsterObj.id
    addMonsterButton.textContent = "Add To Encounter"
    addMonsterButton.addEventListener('click', event => {
        event.preventDefault()
        monsterToAdd = event.target.id
        encounterId = document.querySelector('#encounter-select').value
        addMonster(encounterId, monsterToAdd)
    })
    card.appendChild(addMonsterButton)
    resultDiv.appendChild(card)
}



function addMonster(encounterId, monsterToAdd){
    fetch(`https://dnd-encounter-builder.herokuapp.com/encounters/add_monster`, {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            encounterId,
            monsterToAdd
        })
    })
}

const pSizeLabel = document.querySelector("#partySizeOptions")
pSizeLabel.textContent = "Party Size: "
const pLevelLabel = document.querySelector("#partyLevelOptions")
pLevelLabel.textContent = "Party Level: "
const mSizeLabel = document.querySelector("#monsterSizeOptions")
mSizeLabel.textContent = "Monster Size: "
const mAlignmentLabel = document.querySelector("#monsterAlignmentOptions")
mAlignmentLabel.textContent = "Monster Alignment: "
const mDifficultyLabel = document.querySelector("#monsterDifficultyOptions")
mDifficultyLabel.textContent = "Monster Difficulty: "