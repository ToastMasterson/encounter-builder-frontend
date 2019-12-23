const mainDiv = document.createElement('div')
    mainDiv.id = "main-div"

const mainEncounterDiv = document.createElement('div')
mainEncounterDiv.id = "main-encounter-div"


const headerAndSearch = document.createElement('div')
const logInButton = document.querySelector('#log-in-button')
const logInInput = document.querySelector('#log-in-input')
const encounterDiv = document.createElement('div')
    encounterDiv.id = "encounter-div"

const encounterSubmit = document.createElement('button')
    encounterSubmit.textContent = "Create Encounter"
    encounterSubmit.id = "encounter-submit"

    encounterSubmit.addEventListener('click', event => {
        event.preventDefault()
        const encounterInput = document.querySelector('#encounter-input').value
        const masterId = document.querySelector('#master-id').value
        postEncounter(encounterInput, masterId)
    })

logInButton.addEventListener('click', event => {
    event.preventDefault()

    const getSearch = document.querySelector('#search-bar')

    getSearch.style.visibility = "visible"

    postLogIn()
})


function postLogIn(){
    fetch("https://dnd-encounter-builder.herokuapp.com/masters/log_in", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify ({
            username: logInInput.value
        })
    }).then(response => response.json())
    .then(result => {
        loadCreateEncounter(result)
        loadEncounters(result)
        loadEncounterSelect(result)
    })
}

function loadCreateEncounter(result){
    mainEncounterDiv.innerHTML = `
    <div id="create-encounter-div">
        <h1 id="encounter-header">~ Your Encounters ~</h1>
        <div id="create-encounter-form">
        <input type="hidden" id="master-id" value=${result.master.id}>
        <input placeholder="Encounter Name" id="encounter-input">
        </div>
        <div id="get-search"></div>
    </div>`
    document.body.appendChild(mainEncounterDiv)
    const createEncounterDiv = document.querySelector('#create-encounter-form')
    createEncounterDiv.append(encounterSubmit)
}

function loadEncounters(result){
    encounterDiv.innerHTML = ""
    const encounters = result.encounters

    encounters.forEach(encounter => {
        const encounterListItem = document.createElement('div')
        encounterListItem.className = "encounter-list-item"
        const encounterTitle = document.createElement('h4')
        encounterTitle.textContent = encounter.title
        encounterTitle.className = "encounter-title"
        const showEncounterMonsters = document.createElement('button')
        showEncounterMonsters.className = "encounter-button"
        showEncounterMonsters.textContent = "See Monsters"
        showEncounterMonsters.id = encounter.id
        const deleteEncounterButton = document.createElement('button')
        deleteEncounterButton.className = "encounter-delete-button"
        deleteEncounterButton.textContent = "Delete"

        encounterListItem.id = encounter.id
        encounterListItem.class = "enc-list-item"

        showEncounterMonsters.addEventListener('click', event => {
            event.preventDefault()
            postToGetEncounters(encounterListItem.id)
        })

        deleteEncounterButton.addEventListener('click', event => {
            event.preventDefault()
            encounterToDelete = event.target.parentNode
            fetchToDeleteEncounter(encounterListItem.id, encounterToDelete)
        })
        encounterListItem.append(encounterTitle, showEncounterMonsters, deleteEncounterButton)
        encounterDiv.appendChild(encounterListItem)

    })
    document.body.appendChild(encounterDiv)
}

function loadEncounterSelect(result){
    const encounterSelectDiv = document.createElement('div')
    encounterSelectDiv.id = "encounter-select-div"
    const encounterSelect = document.createElement('select')
    encounterSelect.id = "encounter-select"
    const encounters = result.encounters
    const encSelectLabel = document.createElement('label')
    encSelectLabel.textContent = "Encounter To Add To: "
    encounters.forEach(encounter => {
        const encOption = document.createElement('option')
        encOption.value = encounter.id
        encOption.textContent = encounter.title
        encounterSelect.appendChild(encOption)
    })
    encounterSelectDiv.append(encSelectLabel,encounterSelect)
    queryForm.appendChild(encounterSelectDiv)
    queryForm.appendChild(formSubmitDiv)
}

function postEncounter(input, id){
    fetch("https://dnd-encounter-builder.herokuapp.com/encounters", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            title: input,
            master_id: id
        })
    }).then(response => response.json())
    .then(result => {
        createTempCard(result)
        const encOption = document.createElement('option')
        const encounterSelect = document.querySelector('#encounter-select')
        encOption.value = result.id
        encOption.textContent = result.title
        encounterSelect.appendChild(encOption)
    })
}

function createTempCard(encounter){
    const encounterListItem = document.createElement('div')
        const encounterTitle = document.createElement('h4')
        encounterTitle.textContent = encounter.title
        encounterTitle.className = "encounter-title"
        const showEncounterMonsters = document.createElement('button')
        showEncounterMonsters.textContent = "See Monsters"
        showEncounterMonsters.id = encounter.id
        const deleteEncounterButton = document.createElement('button')
        deleteEncounterButton.textContent = "Delete"

        encounterListItem.id = encounter.id
        encounterListItem.class = "enc-list-item"

        showEncounterMonsters.addEventListener('click', event => {
            event.preventDefault()
            postToGetEncounters(encounterListItem.id)
        })

        deleteEncounterButton.addEventListener('click', event => {
            event.preventDefault()
            encounterToDelete = event.target.parentNode
            fetchToDeleteEncounter(encounterListItem.id, encounterToDelete)
        })
        encounterListItem.append(encounterTitle, showEncounterMonsters, deleteEncounterButton)
        encounterDiv.appendChild(encounterListItem)
}

function postToGetEncounters(id){
    fetch("https://dnd-encounter-builder.herokuapp.com/encounters/get_monsters", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            id
        })
    }).then(response => response.json())
    .then(result => displayEncounterMonsters(result))
}

function displayEncounterMonsters(result){
    resultDiv.innerHTML = ""
    result.monsters.forEach(monster => {
      createEncounterMonsterCards(monster, result.encounter)  
    })
    document.body.appendChild(resultDiv)
}

function fetchToDeleteEncounter(id, encounterToDelete){
    fetch(`https://dnd-encounter-builder.herokuapp.com/encounters/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type":"application/json"
        }
    }).then(encounterToDelete.remove())
}

function createEncounterMonsterCards(monsterObj, encounter){
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
            <li> Challenge Rating: <span> ${monsterObj.challenge_rating} </span></li>
    </div>
    <div class="card-stats-list">
        
            <li>Armor Class:<span>${monsterObj.armor_class}</span></li>
            <li>Hit Points:<span>${monsterObj.hit_points}</span></li>
            <li>Hit Dice:<span>${monsterObj.hit_dice}</span></li>
            <li>Str:<span>${monsterObj.strength}</span></li>
            <li>Dex:<span>${monsterObj.dexterity}</span></li>
            <li>Con:<span>${monsterObj.constitution}</span></li>
            <li>Int:<span>${monsterObj.intelligence}</span></li>
            <li>Wis:<span>${monsterObj.wisdom}</span></li>
            <li>Cha:<span>${monsterObj.charisma}</span></li>
            <input type="hidden" id="${monsterObj.id}" value="${monsterObj.id}" />
    </div>`
    const removeMonsterButton = document.createElement('button')
    removeMonsterButton.className = "remove-button"
    removeMonsterButton.id = monsterObj.id
    removeMonsterButton.textContent = "Remove Monster"
    removeMonsterButton.addEventListener('click', event => {
        event.preventDefault()
        cardToRemove = event.target.parentNode
        monsterToRemove = event.target.id
        encounterId = encounter.id
        removeMonster(encounterId, monsterToRemove, cardToRemove)
    })
    card.appendChild(removeMonsterButton)
    resultDiv.appendChild(card)
}

function removeMonster(encounterId, monsterId, cardToRemove){
    fetch("https://dnd-encounter-builder.herokuapp.com/encounters/remove_monster", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        body: JSON.stringify({
            encounterId,
            monsterId
        })
    }).then(response => response.json())
    .then(cardToRemove.remove())
}