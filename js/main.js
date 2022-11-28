const elDarkBtn = document.querySelector(".js-dark-btn");

// Dark mode 
elDarkBtn.addEventListener("click", function(){
    const elBody = document.body
    elBody.classList.toggle("dark-theme");

    let theme; 

    if(elBody.classList.contains("dark-theme")){
        theme = "DARK"
    }else{
        theme = "LIGHT"
    }

    localStorage.setItem("theme", theme);
});

let getTheme = localStorage.getItem("theme");
if(getTheme == "DARK"){
    document.body.classList = "dark-theme";
}



const DEFAULT_URL = "https://restcountries.com/v3.1/all";

// get search form
const elSearchForm = document.querySelector(".hero-form");
const elSearchInput = elSearchForm.querySelector(".hero-input");
const elSelectRegion = elSearchForm.querySelector(".hero-select");

// get countries template 
const elCountriesTemplate = document.querySelector(".countries-template").content;
const elCountriesList = document.querySelector(".countries-list");

// get modal 
const elModal = document.querySelector(".modal-wrap");
const elModalList = document.querySelector(".modal-info-wrapp");
const elMdalCloseBtn = document.querySelector(".modal-back-btn");

// global Fragment
const globalFragment = new DocumentFragment();

// render Countries
function renderCountries(arr, node){
    elCountriesList.innerHTML = "";
    arr.forEach(item => {
        const templateClone = elCountriesTemplate.cloneNode(true);
        templateClone.querySelector(".countries-images").src = item.flags.png;
        templateClone.querySelector(".countries-images").alt = item.name.common;
        templateClone.querySelector(".countries-name").textContent = item.name.common;
        templateClone.querySelector(".countries-population-description").textContent = item.population;
        templateClone.querySelector(".countries-region-description").textContent = item.region;
        templateClone.querySelector(".countries-capital-description").textContent = item.capital;
        templateClone.querySelector(".more-info-btn").dataset.id = item.name.common

        globalFragment.appendChild(templateClone);
    });

    node.appendChild(globalFragment);
}

// all countries arr
const allCountries = [];
async function getAllCountries(url){
    try {
        const res = await fetch(url);
        const data = await res.json();
        data.forEach(item => {
            allCountries.push(item)
        });
        renderCountries(data, elCountriesList)
    } catch (error) {
        console.log(error);
    }
}

// modal render countries
function modalInfo(obj){
    document.querySelector(".modal-flag-img").src = obj.flags.svg;
    document.querySelector(".modal-title").textContent = obj.name.common;
    document.querySelector(".modal-native-name").textContent = obj.name.official;
    document.querySelector(".modal-population").textContent = obj.population;
    document.querySelector(".modal-region").textContent = obj.region;
    document.querySelector(".modal-sub-region").textContent = obj.subregion;
    document.querySelector(".modal-capital").textContent = obj.capital;
    document.querySelector(".modal-area-info").textContent = obj.area;
    // document.querySelector(".modal-currency").textContent = obj.currencies.MRU?.symbol;
    obj.borders?.forEach(item => {
        const newItem = document.querySelector("li");
        newItem.classList.add("modal-border-countries");
        newItem.textContent = item;
        document.querySelector(".modal-borders-list").appendChild(newItem)
    })

    // node.append(globalFragment)
}

// Debounce function
function debounce(callback, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(callback, delay)
    }
}

function check() {
    let searchInputValue = elSearchInput.value;
    let searchUrl = `https://restcountries.com/v3.1/name/${searchInputValue}`
    console.log(searchUrl);
    if(searchInputValue === ""){
        getAllCountries(DEFAULT_URL)
    }else{
        getAllCountries(searchUrl)
    }
}
elSearchForm.addEventListener("keyup", debounce(check, 500));

// region select
elSelectRegion.addEventListener("click", () => {
    const selectRegionValue = elSelectRegion.value
    getAllCountries(`https://restcountries.com/v3.1/region/${selectRegionValue}`)
});

// event delegation
elCountriesList.addEventListener("click", evt => {
    if (evt.target.matches(".more-info-btn")) {
        const btnId = evt.target.dataset.id
        const findObj = allCountries.find(item => btnId === item.name.common);
        modalInfo(findObj)
        elModal.classList.add("d-block")
    }
});

// Modal close 
elMdalCloseBtn.addEventListener("click", () => {
   window.location.reload()
});

getAllCountries(DEFAULT_URL);