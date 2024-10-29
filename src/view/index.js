import { endSession, findUser, instanceTest } from "../../assets/js/util.js";
import User from "../controllers/account/User.js";

document.addEventListener("DOMContentLoaded", function(){
    let user = {};
    let url = document.location.href;
    let page = url.substring(url.lastIndexOf('/') + 1);

    if(!sessionStorage.getItem("database")){
        instanceTest(); //Crea las instancias de prueba solo una vez siempre y cuando no existan 
    } else{
        User.loadDataSession();
    }

    if(page == "index.html" || page == "index"){
        menuSessionUser("./assets/html/dashboard.html", "./assets/html/login.html");
        backgroundImage(); //Función genera imagenes en el encabezado del index

        function backgroundImage(){
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
        }
    }

    if(page == "nosotros.html" || page == "nosotros"){
        menuSessionUser("./dashboard.html", "./login.html");
    }

    function menuSessionUser(dashboard, logout){
        if(sessionStorage.getItem("account")){ //Si hay un usuario logeado, en la barra principal del index.html se cambiará la menu para indicar que hay un usuario registrado
            user = findUser();
            
            document.querySelector(".encabezado__usuario").style.display = "none";
            document.getElementById("barra").innerHTML += `
                <div class="header-right">
                    <button class="btn-icon" title="Dashboard" id="dashboard">
                        <i class="fas fa-user-circle fa-lg"></i>
                        <p>${user.getName()}</p>
                    </button>
                    <button class="btn-icon" title="Cerrar sesión" id="logout">
                        <i class="fas fa-sign-out-alt fa-lg"></i>
                        <p>Cerrar sesión</p>
                    </button>
                </div>`
        }

        if(document.querySelector(".header-right")){
            document.getElementById("dashboard").addEventListener("click", function(){
                window.location.href = dashboard;
            });
        
            document.getElementById("logout").addEventListener("click", function(){
                endSession(logout);
            });
        }
    }

    document.getElementById("menuButton").addEventListener("click", function(){ //Logica menu movil
        const sidebar = document.getElementById("menu")
        
        if(sidebar.style.display == "" || sidebar.style.display == "none"){
            sidebar.style.display = "flex";

            setTimeout(() => {
                sidebar.classList.add("efect");
            }, 10);
        } else if(sidebar.style.display == "flex"){
            sidebar.classList.remove("efect");

            sidebar.addEventListener('transitionend', function() { //Cuando la transición finalice, se cambiará el display al sidebar
                sidebar.style.display = ""; // Oculta completamente después de la transición
            }, { once: true }); // Solo una vez
        }
    });
});