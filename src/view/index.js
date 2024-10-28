import { instanceTest } from "../../assets/js/util.js";

document.addEventListener("DOMContentLoaded", function(){
    if(!sessionStorage.getItem("database")){
        instanceTest(); //Crea las instancias de prueba solo una vez siempre y cuando no existan 
    }

    let contador = 1;
    setInterval(() => {
        contador++;

        const fondo = new Image();
        fondo.src = `./assets/img/banner${contador}.jpg`; //Precarga imagen

        fondo.addEventListener("load", function(){
            document.querySelector(".encabezado__banner").style.backgroundImage = `url('${fondo.src}')`;
        });

        if(contador == 4){
            contador = 0;
        }
        
    }, 6000);
});