const nav = document.getElementById('top_nav');
const links = document.getElementsByClassName('home-nav-list-item-link');
const menuIconBox  = document.querySelector('.menu_home');

const phoneSize = window.matchMedia("(max-width:56.5em)");


let currentColor = nav.style.backgroundColor;
function checkScroll(el) {
    let scrollHeight = el.scrollHeight;
    let scrollPosY  =  window.pageYOffset;

    // console.log(scrollHeight + 'is here' + scrollPosY);
    if(scrollPosY>scrollHeight){
        el.style.backgroundColor = 'white';
        el.style.width = window.innerWidth.toString();


            el.style.boxShadow = '0 10px 30px rgba(0,0,0,.1)';
        for (let element of links){
            changeColor(element, 'dark');
        }
        if (phoneSize.matches){
            for (let element of links){
                changeColor(element, 'dark');
            }
        }

    }else {
        // menuIcon.style.backgroundColor = 'black';
        // menuIcon.classList.toggle('menu_home-bar-w');
            el.style.backgroundColor = currentColor;
        el.style.boxShadow = 'none';
        for (let element of links){
            changeColor(element, 'grey_color');
        }
        if (phoneSize.matches){
            for (let element of links){
                changeColor(element, 'dark');
            }
        }



    }

}



/////Pseudo element
// var color =  window.getComputedStyle(menuIcon,':before');


function changeColor(el,color){
    const clName = 'home-nav-list-item-link';
        el.className = `${clName} ${color}`;
}
if (phoneSize.matches){

    // window.getComputedStyle(menuIcon,':before').setProperty('background-color','white');
    for (let element of links){
        changeColor(element, 'dark');
    }
}
window.addEventListener('resize',()=>{
    if (phoneSize.matches){
        for (let element of links){
            changeColor(element, 'dark');
        }
    }else{
        for (let element of links){
            changeColor(element, 'grey_color');
        }
    }
})
window.addEventListener('scroll',()=>checkScroll(nav));