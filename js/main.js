/* MENU MOBILE */

const menuToggle = document.createElement("div")

menuToggle.innerHTML = "☰"

menuToggle.classList.add("menu-toggle")

document.querySelector("nav").appendChild(menuToggle)

menuToggle.addEventListener("click",()=>{

document.querySelector(".nav-links").classList.toggle("active")

})