import User from "../controllers/account/User.js";
import { alertShow, checkSession, completeInput, confirmPassword, endSession, findUser, textCurrency } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";
import Category from "../controllers/tag/Category.js";
import { categoria, descripcion, fecha, menuButton, monthLoad, printCategory, printNameUser, updateValues, tipo, transactionByMonth, user, valor, updateListUser, modalCancel, logout } from "../../assets/js/panel.js";

checkSession(); //Revisa si hay un usuario en el sessionStorage para continuar

export let pageDashboard = document.location.href;

// Cuando el contenido del documento está listo, se cargan los datos de sesión de usuarios, transacciones y categorías y se declarán las variables necesarias.
document.addEventListener("DOMContentLoaded", function() {
    // Obtiene la URL actual y el nombre de la página.
    if(pageDashboard.includes("dashboard")){
        //Funciones bases
        menuButton();
        printNameUser();
        updateListUser();
        logout();
        modalCancel();
        
        //Funciones importadas especificas
        printWelcome();
        monthLoad(); //Carga el mes actual al dashboard y le registra un evento de tipo change para imprimir la información del mes correspondiente
        updateValues() //Se encarga de filtrar, calcular las transacciones del usuario
        printCategory();
        recentTransaction();

        // Carga los datos de sesión al cargar el documento.
        console.log("Usuario: ", user);
        
        console.log("DB usuarios", User.getUserData());
        console.log("DB transacciones", Transaccion.getTransactionData());

        // // Muestra el nombre del usuario en la bienvenida.
        // document.getElementById("titleMain").innerHTML = `Bienvenido <span>${user.getName()}</span>`
        

        // Añade una nueva transacción cuando se hace clic en el botón de añadir.
        document.getElementById("añadir").addEventListener("click", function(e) {
            e.preventDefault();
            
            //Valida si los siguientes campos se encuentran vacíos, esto con el fin de poder crear transacciones correctamente e indicarle al usuario si le hace falta campos por completar 
            if(tipo.value != "Tipo" && categoria.value != "Categoría" && valor.value != "" && fecha.value != ""){
                user.getTransactions().getManager().createTransaction(user.getId(), tipo.value, +valor.value, descripcion.value, categoria.value, fecha.value);
                user.getTransactions().updateListUser(user.getId());
                updateValues() //Actualiza la lista filtrada por mes, actualiza la lista de transacciones y recalcula el balance.
                recentTransaction();
                formatearCampo(); // Limpia el formulario.

                alertShow("Hecho!", "Transacción registrada", "success");
                console.log(user);
            } else{
                alertShow("Error!", "Ingrese todos los campos faltantes", "warning");
            }
        });

        function recentTransaction(){
            document.getElementById("recentTransactions").innerHTML = "";
            transactionByMonth.sort((a, b) => b.getId() - a.getId()); //Organiza las transacciones por id (mayor a menor), de esta forma se determina las transacciones más recientes
            if(transactionByMonth.length != 0){ //Se aplica condición para que no genere error en caso de estar vacio el arreglo
                for (let i = 0; i < 5; i++) {
                    document.getElementById("recentTransactions").innerHTML += `<tr data-tipo="${transactionByMonth[i].getType()}">
                                    <td>${transactionByMonth[i].getType()}</td>
                                    <td>${textCurrency(transactionByMonth[i].getValue())}</td>
                                    <td>${transactionByMonth[i].getCategory()}</td>
                                    <td>${transactionByMonth[i].getDate()}</td>
                                </tr>`;
        
                                if(transactionByMonth.length == i+1){
                                    break;
                                }
                }
            } else {
                document.getElementById("recentTransactions").style.color = "#000";
                document.getElementById("recentTransactions").innerHTML = `<tr class="nodata"> 
                        <td colspan="4" rowspan="5">Sin transacciones</td> 
                    </tr>`
            }
        }

        // Limpia los campos del formulario.
        function formatearCampo() {
            document.getElementById("tipo").selectedIndex = 0;
            valor.value = "";
            descripcion.value = ""; 
            categoria.selectedIndex = 0;
            fecha.value = "";
            document.getElementById("añadir").style.display = "inline";
            // document.getElementById("confirmar").style.display = "none";
        }

        function printWelcome(){
            if(!sessionStorage.getItem("welcome")){
                document.getElementById("titleMain").innerHTML = `¡Bienvenido de nuevo, <span>${user.getName()}!</span>`
    
                setTimeout(() => {
                    document.getElementById("titleMain").innerHTML = `Panel <span>principal</span>`
                }, 3000);
            } else {
                document.getElementById("titleMain").innerHTML = `Panel <span>principal</span>`
            }

            sessionStorage.setItem("welcome", JSON.stringify("welcome"));
        }
    }
});