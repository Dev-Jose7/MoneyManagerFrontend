document.addEventListener("DOMContentLoaded", function(){
    let contador = 1;
    setInterval(() => {
        contador++;

        const fondo = new Image();
        fondo.src = `./img/banner${contador}.jpg`; //Precarga imagen

        fondo.addEventListener("load", function(){
            document.querySelector(".encabezado__banner").style.backgroundImage = `url('${fondo.src}')`;
        });

        if(contador == 4){
            contador = 0;
        }
        
    }, 10000);
});