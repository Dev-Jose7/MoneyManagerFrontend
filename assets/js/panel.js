import User from "../../src/controllers/account/User.js";
import Transaccion from "../../src/controllers/operation/Transaccion.js";
import Category from "../../src/controllers/tag/Category.js";
import { pageAccount } from "../../src/view/account.js";
import { pageDashboard } from "../../src/view/dashboard.js";
import { pageStatistics } from "../../src/view/statistics.js";
import { pageTransaction } from "../../src/view/transactions.js";
import { endSession, findUser, textCurrency } from "./util.js";

export let user = {};
export let tipo = document.getElementById("tipo");
export let fecha = document.getElementById("fecha");
export let valor = document.getElementById("valor");
export let descripcion = document.getElementById("descripcion");
export let categoria = document.getElementById("categoria");

export let sizePage = document.getElementById("sizePage");
let pageCategoria = document.getElementById("pageCategoria");

export let month = document.getElementById("month");
export let transactionByMonth = [];
export let ingresosByMonth = [];
export let gastosByMonth = [];

User.loadDataSession(); //Crea las instancias de prueba solo una vez siempre y cuando no existan 
Transaccion.loadDataSession(); //Carga todas las transacciones
Category.loadDataSession(); //Carga todas las categorias
    

user = findUser(); // Encuentra al usuario actual.

// Actualiza las listas de transacciones y categorías del usuario.

//Imprime el nombre del usuario en el header
export function printNameUser(){
    document.getElementById("nameUser").textContent = user.getName();
}

// Redirige al usuario a la página de cuenta.
// document.getElementById("account").addEventListener("click", function() {
//     window.location.href = "account.html";
// });

// Cierra la sesión y redirige al login.
export function logout(){
    document.getElementById("logout").addEventListener("click", function() {
        document.getElementById("titleMain").textContent = `Hasta luego, ${user.getName()}`;
        user = null;
        endSession("./login.html");
    });
}


export function menuButton(){
    document.getElementById("menuButton").addEventListener("click", function(){
        const sidebar = document.getElementById("sidebar");
        
        if(sidebar.style.display == ""){
            sidebar.style.display = "block";
    
            setTimeout(() => {
                sidebar.classList.add("efect");
            }, 10);
        } else if(sidebar.style.display == "block"){
            sidebar.classList.remove("efect");
    
            sidebar.addEventListener('transitionend', function() { //Cuando la transición finalice, se cambiará el display al sidebar
                sidebar.style.display = ""; // Oculta completamente después de la transición
            }, { once: true }); // Solo una vez
        }
    });
}

export function monthLoad(){
    let date = new Date();
    month.value = date.getMonth() + 1;

    if(pageDashboard.includes("dashboard") || pageTransaction.includes("transaction") || pageAccount.includes("transaction")){
        month.addEventListener("change", function(){
            updateValues();
        });
    }
} 

export function updateListUser(){
    user.getTransactions().updateListUser(user.getId());
    user.getCategories().updateListUser(user.getId());
}

export function updateValues(){ //Shorthand para filtrar y calcular las transacciones del mes en curso
    dataByMonth(user.getTransactions().getListTransaction()); //Obtiene las transacciones del usuario de acuerdo al mes en curso
    calculateBalance(ingresosByMonth, gastosByMonth); // Calcula el balance entre ingresos y gastos.
}

//Captura la fecha de las transacciones por usuario y las filtra por el mes actual, de esta manera se obtendran las transacciones del usuario correspondiente al mes en curso
export function dataByMonth(data){
    transactionByMonth = data.filter(transaction => {
        const fecha = transaction.getDate()
        if(fecha.substring(fecha.indexOf("-")+1, fecha.lastIndexOf("-")) == month.value){
            return true;
        }
    });

    //Organiza las transacciones de acuerdo al dia de la fecha de su registro (mayor a menor)
    transactionByMonth.sort((a, b) => b.getDate().substring(b.getDate().lastIndexOf("-")+1) - a.getDate().substring(a.getDate().lastIndexOf("-")+1));

    ingresosByMonth = transactionByMonth.filter(transaction => transaction.getType() == "Ingreso");
    gastosByMonth = transactionByMonth.filter(transaction => transaction.getType() == "Gasto");
    console.log(transactionByMonth);
    console.log(ingresosByMonth);
    console.log(gastosByMonth);
}

// Función que calcula el balance total entre ingresos y gastos.
export function calculateBalance(ingresos, gastos) {
    let ingresoTotal = document.getElementById("valorIngreso");
    let gastoTotal = document.getElementById("valorGasto");
    let saldoTotal = document.getElementById("saldo")

    ingresoTotal.textContent = user.getBalance(ingresos);
    gastoTotal.textContent = user.getBalance(gastos);

    saldoTotal.textContent = Number(ingresoTotal.textContent) - Number(gastoTotal.textContent);
    ingresoTotal.textContent = textCurrency(+ingresoTotal.textContent);
    gastoTotal.textContent = textCurrency(+gastoTotal.textContent);
    saldoTotal.textContent = textCurrency(+saldoTotal.textContent);
}


//Función que convierte el texto de los valores de la transacciones impresas a formato moneda usando la función textCurrency
export function textFormat(container){
    [...container.children].forEach(page => { //Recorre los hijos del contenedor, los hijos son los elementos paginas
        [...page.children].forEach(transaction => { //Recorre los hijos de la página, estos son las transacciones
            if(transaction.dataset.id){ //Solo realiza el formato de texto si la transacción tiene id y no para las estructuras de transacciones que vienen vacias en la útlma página
                let value = textCurrency(+transaction.querySelector(".titleValue").textContent);
                transaction.querySelector(".titleValue").textContent = value;

                if(container.id != "campoTransacciones" && window.innerWidth >= 768){
                    let category = transaction.querySelector(".titleCategory").textContent.slice(0, 9);
                    let date  = transaction.querySelector(".titleDate").textContent.slice(5);

                    transaction.querySelector(".titleCategory").textContent = category;
                    transaction.querySelector(".titleDate").textContent = date;

                    [...transaction.children].forEach(title => {
                        if(title.textContent.length >= 9 && (title.className == "titleCategory" || title.className == "titleDescription")){
                            title.textContent += "...";
                            title.innerHTML += `<i class="fa-solid fa-circle-info" fa-lg></i>`
                        }
                    });
                }
            }
            
        });
    });
}

// Imprime las categorías disponibles para el usuario.
export function printCategory() {
    if(pageDashboard.includes("dashboard")){
        user.getCategories().printCategories(categoria);
    }
    
    user.getCategories().printCategories(categoria); // En sección de añadir.
    if(pageTransaction.includes("transaction")){
        user.getCategories().printCategories(document.getElementById("categoriaFilter")); // En sección de filtrar. //pagina transacciones
    }

    if(pageAccount.includes("account")){
        user.getCategories().getCategoriesUser().sort((a, b) => {return getTotalCategory(b) - getTotalCategory(a)}); //Se ordena el arreglo de categorias de mayor a menor de acuerdo a la cantidad de transacciones que tenga cada una
        pagination(categoria, pageCategoria, user.getCategories().getCategoriesUser(), 3, user.getCategories().printCategories);
    }

    if(pageStatistics.includes("estadisticas")){
        
    }
}



//Método que se encarga de imprimir la páginación (maquetarla)
export function pagination(container, buttonContainer, vector, size, callback){
    container.innerHTML = ""; // Limpia el contenedor.
    let counterTransaction = 0;

    //Después de limpiar el contenedor, se crea la primer página 
    createPage(); //Es necesario crear una primer página antes de iniciar el ciclo, esto para que el contenedor de páginas tenga elementos hijos y así el ciclo tenga elementos por recorrer
    let section = container.children;
    
    if(vector.length != 0){ //Si hay objetos se procederá con la impresión por página, si no hay objetos se imprimirá estructuras de objetos vacíos para que el contenedor de páginas tenga un tamaño definido por tamaño de página.
        for (let page = 0; page < section.length; page++) { //Recorre el contenedor de las paginas (ciclo de páginas)
        
            for (let i = 0; i < size; i++) { //Hace referencia a la cantidad de veces que debe de imprimir un objeto a una página (ciclo de objetos por página)
                let elemento = "";

                if(container.id == "categoria"){
                    let transaction = getTotalCategory(vector[counterTransaction]);
                    elemento = callback(container, vector, true, counterTransaction, transaction);//Se invoca un método proveniente de la instancia la cual obtiene la estructura de cada objeto 
                } else {
                    elemento = callback(container, vector, true, counterTransaction);//Se invoca un método proveniente de la instancia la cual obtiene la estructura de cada objeto 
                }
                

                section[page].innerHTML += elemento;
                counterTransaction++

                if(counterTransaction == vector.length){ //Si todas los objetos fueron añadidas procederá a terminar el ciclo principal para que no se creen más páginas
                    break;
                }
            }

            createPage();
        }
    }

    function createPage(){ //Esta función es importante ya que crea y añade paginas al elemento contenedor de estas además es motor del primer ciclo ya que si añade páginas el ciclo podrá ejecutarse una vez más, imprimiendo transacciones en esta nueva página
        if(counterTransaction < vector.length || vector.length == 0){ //Valida si hay transacciones por imprimir para así crear una pagina nueva o si no hay más transacciones, entonces creará una página vacía
            let page = document.createElement("div");
            page.className = "pagina"
            container.appendChild(page);
            console.log("Se crea pagina")
        }
    }

    paginationDefault(container, buttonContainer, size);
}

//Función que se encarga de crear el funcionamiento de la páginación (lógica)
export function paginationDefault(container, buttonContainer, size){
    let lastPage = container.lastChild;
        console.log(lastPage)
    
    if(lastPage.children.length < size){ //Esta condición se encarga de llenar los espacios vacíos en las últimas páginas con una estructura base de una transacción para que de esta manera se cree un tamaño fijo a cada uno de los tamaño de página. De igual forma, si no hay transacciones imprimirá estructuras de transacciones en la primer página (que será también la última) para generar un tamaño fijo
        let diference = size - lastPage.children.length;
        for (let i = 0; i < diference; i++) {
            let elemento =`
                <div class="list">
                    <p></p>
                    <p></p>
                    <p></p>
                    <p></p>
                </div>`

            lastPage.innerHTML += elemento;
        }
    }

    if(lastPage.children.length == 0){
        lastPage.children[0].textContent = "Sin transacciones";
    }
    
    container.firstChild.style.display = "unset" //La primer página del elemento contenedor de páginas se mostrará por defecto

    //Limpia el elemento contenedor de los botones para que se puedan crear nuevamente sin repetirse cuando se elija el tamaño de página 
    buttonContainer.innerHTML = "";

    //Ciclo que se encarga de crear los botones de acuerdo a la cantidad de páginas del elemento contenedor de páginas
    for (let i = 0; i < container.children.length; i++) {
        let pageButton = document.createElement("button");
        pageButton.textContent = i + 1;

        //De acuerdo al id del elemento contenedor de páginas se irá agregando los botones al elemento contenedor de botones correspondiente
        buttonContainer.appendChild(pageButton);
        paginationButtons(container, buttonContainer);
        
    }
}

//Una vez creados y añadidos los botones de cada página se registra un evento al elemento contenedor de estos botones y a través de la delegación de eventos asignar un botón a cada página
export function paginationButtons(container, buttonContainer){
    buttonContainer.addEventListener("click", function(e){
        if(e.target.tagName == "BUTTON"){ //Previene a que la lógica de los botones solo ocurra cuando se haga click en elementos <button> y que no comience actuar cuando se haga click en el elemento contenedor de botones 
            
            [...container.children].forEach(page => { //Oculta a todas las páginas, esto para despejar al elemento contenedor de páginas y así poder mostrar otra página elegida por el usuario previniendo combinar la información de páginas anteriormente vista
                page.style.display = "none";
            });

            [...buttonContainer.children].forEach(button => { //Oculta a todas las páginas, esto para despejar al elemento contenedor de páginas y así poder mostrar otra página elegida por el usuario previniendo combinar la información de páginas anteriormente vista
                button.style.transform = "none"
                button.style.fontWeight = "unset";
            });

            //De acuerdo al texto del boton clickeado, este se ajustará en forma de indice para hacer referencia a la pagina que se encuentrá en el elemento contenedor de páginas y así mostrarla
            container.children[e.target.textContent-1].style.display = "unset";
            buttonContainer.children[e.target.textContent-1].style.transform = "scale(1.05)"
            buttonContainer.children[e.target.textContent-1].style.fontWeight = "bold"
        }   
    });
}



export function getTotalCategory(tag){
    let filter = user.getTransactions().getFilter().filter("", "", "Tipo", tag, "", user.getTransactions().getListTransaction());
    return filter.length
}

export function filterData(data){
    let filter = [];

    if(data == "Ingreso" || data == "Gasto"){
        filter = user.getTransactions().getFilter().filter("", "", data, "Categoría", "", transactionByMonth);
    }

    if(user.getCategories().getCategoriesUser().find(tag => tag == data)){
        filter = user.getTransactions().getFilter().filter("", "", "Tipo", data, "", transactionByMonth);
    }

    if(data.includes("-")){
        filter = user.getTransactions().getFilter().filter("", "", "Tipo", "Categoría", data, transactionByMonth);
    }

    return filter;
}

export function modalCancel(){
    [...document.querySelectorAll(".cancelar")].forEach(element => {
        element.addEventListener("click", function(e){
            console.log("click")
            e.target.closest(".modal").style.display = "none";
        });
    });
}

//Función que permite crear y programar un alert de confirmación  
export async function alertConfirm(title, text, id, functions){
    await confirmShow(title, text, id); //Se crea el alert pasando estos valores

    //Se registra un evento de tipo click al boton de confirmación del alert mediante un id establecido como parametro (id que se asigno al boton al momento de crear el alert) para que cuando ocurra, ejecuté todas las funciones que fueron pasadas mediante un arreglo 
    document.getElementById(id).addEventListener("click", function(){ 
        functions.forEach(method => method()); //Las funciones o métodos almacenados en el arreglo se encuentrán adentro de funciones anonimas, esto permite que dichos elementos puedan ser asignados en el arreglo con sus argumentos necesarios sin invocarse inmediatamente, permitiendo así que las funciones o métodos sean invocados cuando se recorra el arreglo que las contiene, es decir llamando a cada una de las funciones anonimas que las contiene
    });
}

//Función que crea un alert de confirmación doble, ajustando un id al boton confirmar del primer alert (boton: SI)
export function confirmShow(heading, message, id){
    return new Promise((resolve) => { //Retorna una promesa, esto debido ya que se esta ejecutando una operación asincrónica (event click)
        Swal.fire({
            title: heading,
            text: "¿Deseas continuar? Esta acción no se puede deshacer",
            icon: "warning",
            showDenyButton: true,
            confirmButtonColor: "#4CAF50",
            denyButtonColor: "#d33",
            confirmButtonText: "Si",
            didOpen: () => { //Esta propiedad es un callback, el cual permite manipular el DOM del modal una vez se haya cargado completamente en el DOM 
                Swal.getConfirmButton().id = id;
                resolve(true); //Se invoca el callback resolve después de asignar un id al botón confirmar para que de esta manera podamos registrarle un evento mediante su id, es necesario invocar esta función por async/await
            }
        }).then((result) => {
            
            if (result.isConfirmed) {
                Swal.fire({
                    title: heading,
                    text: message,
                    icon: "success",
                    timer: 5000
                });
            } 
        });
    });
}