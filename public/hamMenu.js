let ham = document.querySelector('.ham');
let hamMenu = document.querySelector('.ham-menu');
let section = document.getElementsByTagName('section')[0];

ham.addEventListener('click', () => { 
    hamMenu.classList.toggle('show');
})
hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('show');
})
section.addEventListener('click', () => {
    hamMenu.classList.remove('show');
})