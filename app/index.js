const URL = "http://localhost:3000"
const furnList = document.querySelector(".furniture-list ul")
const nameInput = document.querySelectorAll("input")[0]
const descInput = document.querySelectorAll("input")[1]
const priceInput = document.querySelectorAll("input")[2]
const editForm = document.querySelector("#furniture-edit-form")
const hiddenID = document.querySelectorAll("input")[3]

function parseJSON(res) {
  return res.json()
}

function appendLi(li) {
  furnList.appendChild(li)
}

function getLis(){
  return document.querySelectorAll("li")
}

function getArrayOfLis(){
  return Array.from(getLis())
}

function createLi(item){
  const li = document.createElement("li")
  const p = document.createElement("p")

  li.innerText = `${item.name} $${item.price}`
  li.dataset.id = `${item.id}`
  p.innerText = item.description
  p.style.display = "none"
  li.appendChild(p)
  li.addEventListener("click", fillForm)

  return li
}

function fillForm(event) {
  const [itemName, price] = event.target.innerText.split(" $")
  liActiveEffect(event.target)
  nameInput.value = itemName
  priceInput.value = price
  descInput.value = event.target.childNodes[1].innerText
  hiddenID.value = event.target.dataset.id
}

function liActiveEffect(targetLi){
  clearActiveLis()
  targetLi.style.background = "orange"
}

function clearActiveLis() {
  const lis = getLis()
  for (li of lis) { li.style.background = "" }
}

function clearForm(){
  for (element of [nameInput, priceInput, descInput, hiddenID]) { element.value = "" }
}

function orderLis(lis = getArrayOfLis()){
  const sorted = quicksort(lis)
  for (li of sorted) { appendLi(li) }
}

function quicksort(lis) {
  if (lis.length > 1) {
    const pivot = lis.pop()
    const pivotData = pivot.innerText.split("$")
    const pivotPrice = parseFloat(pivotData[1])
    const left = []
    const right = []

    for (li of lis) {
      const data = li.innerText.split("$")
      const price = parseFloat(data[1])

      price >= pivotPrice ? left.push(li) : right.push(li)
    }

    lis = quicksort(left).concat([pivot]).concat(quicksort(right))
  }
  return lis
}

function updateLi(item){
  const li = document.querySelector(`[data-id~='${item.id}']`)
  const p = document.createElement("p")
  
  li.innerText = `${item.name} $${item.price}`
  p.innerText = item.description
  p.style.display = "none"
  li.appendChild(p)
}

function editItem(event) {
  event.preventDefault()

  let configObj = {
    method: 'PATCH',
    headers: 
    {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ 
      "name": nameInput.value,
      "description": descInput.value,
      "price": priceInput.value
    })
  };

  fetch(URL + "/furniture/" + hiddenID.value, configObj)
    .then(parseJSON)
    .then(function(item) {
      updateLi(item)
      orderLis()
      clearActiveLis()
      clearForm()
    })
    .catch(function(error) {
      console.log(error.message)
    })
}

fetch(URL + "/furniture")
.then(parseJSON)
.then(function(furniture) {
  const lis = []
  for (item of furniture){ lis.push(createLi(item)) }
  orderLis(lis)
}) 

editForm.addEventListener("submit", editItem)
