import User from "../controllers/account/User.js";
import { endSession, findUser, instanceTest } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";
import Category from "../controllers/tag/Category.js";




// Obtiene la URL actual y el nombre de la página.
let url = document.location.href;
let page = url.substring(url.lastIndexOf('/') + 1);

// Cuando el contenido del documento está listo, se cargan los datos de sesión de usuarios, transacciones y categorías y se declarán las variables necesarias.
document.addEventListener("DOMContentLoaded", function() {
    let id = 0;
    let user = {};
    let dataFilter = [];
    let statusFilter = false;

    let tipo = document.getElementById("tipo");
    let fecha = document.getElementById("fecha");
    let valor = document.getElementById("valor");
    let descripcion = document.getElementById("descripcion");
    let categoria = document.getElementById("categoria");
    let campoIngresos = document.getElementById("campoIngresos");
    let campoGastos = document.getElementById("campoGastos");
    let campoTransacciones = document.getElementById("campoTransacciones");
    
    let minimoFilter = document.getElementById("minimoFilter");
    let maximoFilter = document.getElementById("maximoFilter");
    let tipoFilter = document.getElementById("tipoFilter");
    let categoriaFilter = document.getElementById("categoriaFilter");
    let fechaFilter = document.getElementById("fechaFilter");

    let sizePage = document.getElementById("sizePage");
    let pageIngresos = document.getElementById("pageIngresos");
    let pageGastos = document.getElementById("pageGastos");
    let pageTransacciones = document.getElementById("pageTransacciones");

    let month = document.getElementById("month");
    let transactionByMonth = [];
    let ingresosByMonth = [];
    let gastosByMonth = [];

    User.loadDataSession();
    Transaccion.loadDataSession();
    Category.loadDataSession();
        
    user = findUser(); // Encuentra al usuario actual.

    // Actualiza las listas de transacciones y categorías del usuario.
    user.getTransactions().updateListUser(user.getId());
    user.getCategories().updateListUser(user.getId());
    refreshTransaction() //Se encarga de filtrar, calcular e imprimir las transacciones del usuario
    printCategory();
    

    if(page == "dashboard.html"){
        // Carga los datos de sesión al cargar el documento.
        console.log("Usuario: ", user);
        
        console.log("DB usuarios", User.getUserData());
        console.log("DB transacciones", Transaccion.getTransactionData());

        printCategory();

        // Muestra el nombre del usuario en la bienvenida.
        document.getElementById("titleMain").innerHTML = `Bienvenido <span>${user.getName()}</span>`

        // Añade una nueva transacción cuando se hace clic en el botón de añadir.
        document.getElementById("añadir").addEventListener("click", function(e) {
            e.preventDefault();
            //Si el valor de descripcion es vacío le añade un espacio al value del input para que se pueda crear la transacción
            if(descripcion.value == ""){
                descripcion.value = " ";
            }
            
            //Valida si los siguientes campos se encuentran vacíos, esto con el fin de poder crear transacciones correctamente e indicarle al usuario si le hace falta campos por completar 
            if(tipo.value != "Tipo" && categoria.value != "Categoría" && valor.value != "" && fecha.value != ""){
                user.getTransactions().getManager().createTransaction(user.getId(), tipo.value, +valor.value, descripcion.value, categoria.value, fecha.value);
                user.getTransactions().updateListUser(user.getId());
                refreshTransaction() //Actualiza la lista filtrada por mes, actualiza la lista de transacciones y recalcula el balance.
                formatearCampo(); // Limpia el formulario.

                Swal.fire({
                    customClass: {
                        confirmButton: 'swalBtnColor'
                    },
                    title: 'Hecho!',
                    text: 'Transacción registrada',
                    icon: 'success'
                })
                console.log(user);
            } else{
                Swal.fire({
                    customClass: {
                        confirmButton: 'swalBtnColor'
                    },
                    title: 'Error!',
                    text: 'Ingrese todos los campos faltantes',
                    icon: 'warning',
                    confirmButtonText: 'Ok'
                })
            }
        });

        

        // Restablece los campos cuando se cancela la modificación.
        document.getElementById("cancelar").addEventListener("click", function() {
            formatearCampo();
        });

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

        // Imprime un mensaje por defecto si no hay transacciones.
        // function printDefault(container, vector) {
        //     if(vector.length == 0){
        //         container.children[0].children[0].children[0].style.color = "#000";
        //         container.children[0].children[0].children[0].textContent = "Sin datos"
        //     }
        // }
    }

    if(page == "transaction.html"){
        console.log(user);
        
        // Evento para modificar o eliminar transacciones al hacer clic en un botón de acción.
        document.querySelector(".transacciones").addEventListener("click", function(e) {
            if (e.target.tagName == "I") {
                console.log("verdadero")
                let button = e.target;

                if (button.classList.contains("modificar")) {
                    console.log("Modificando");
                    document.getElementById("editModal").style.display = "unset";
                    id = button.closest(".transaccion").dataset.id; // Captura el ID de la transacción.
                    console.log(id);
                    editTransaction(button); // Llama a la función para editar la transacción.
                }
            
                if (button.classList.contains("eliminar")) {
                    console.log("Eliminando");
                    id = button.closest(".transaccion").dataset.id;
                    user.getTransactions().getManager().deleteTransaction(id, button.closest(".transaccion")); // Elimina la transacción.
                    user.getTransactions().updateListUser(user.getId());
                    Transaccion.saveDataSession(); // Guarda los cambios en la sesión.
                    refreshTransaction()
                    Swal.fire({
                        customClass: {
                            confirmButton: 'swalBtnColor'
                        },
                        title: 'Hecho!',
                        text: 'Transacción eliminada',
                        icon: 'success'
                    });

                    if (!statusFilter) {
                        refreshTransaction(); // Imprime las transacciones nuevamente si no hay filtro.
                    } else if (statusFilter){
                        resultFilter();
                    }
                }
            }
        }); //pagina transacciones

        // Confirma la modificación de una transacción.
        document.getElementById("confirmar").addEventListener("click", function(e) {
            e.preventDefault()
            user.getTransactions().getManager().updateTransaction(id); // Actualiza la transacción.
            user.getTransactions().updateListUser(user.getId());
            Transaccion.saveDataSession(); // Guarda los cambios.

            Swal.fire({
                customClass: {
                    confirmButton: 'swalBtnColor'
                },
                title: 'Hecho!',
                text: 'Transacción actualizada',
                icon: 'success'
            });

            document.getElementById("editModal").style.display = "none";

            if (!statusFilter) {
                refreshTransaction();
            } else if (statusFilter) {
                resultFilter() // Aplica el filtro nuevamente si está activado.
            }
        }); //pagina transacciones

        // Aplica el filtro cuando se hace clic en el botón de filtrar.
        document.getElementById("filter").addEventListener("click", function(e) {
            refreshTransaction(); //Refresca nuevamente las transacciones del mes antes de realizar un filtro para que pueda obtener resultados con que actualizar
            statusFilter = true;
            
            // Aplica el filtro de acuerdo a los valores ingresados en los campos de mínimo y máximo.
            if (minimoFilter.value == "" && maximoFilter.value == "" || minimoFilter.value != "" && maximoFilter.value != "") {
                e.preventDefault();
                resultFilter(); // Aplica el filtro.
            }

            // Si no hay valor mínimo, establece el valor mínimo en 0.
            if (minimoFilter.value == "" && maximoFilter.value != "") {
                e.preventDefault();
                minimoFilter.value = 0;
                resultFilter(); // Aplica el filtro.
            }

            // Si se ingresa valor mínimo pero no máximo, se requiere el valor máximo.
            if (minimoFilter.value != "" && maximoFilter.value == "") {
                maximoFilter.required = true;
            }
            
            // user.getTransactions().updateListUser(user.getId());
        }); //pagina transacciones

        // Limpia el filtro y restaura la lista de transacciones.
        document.getElementById("cleanFilter").addEventListener("click", function(e) {
            e.preventDefault();
            user.getTransactions().updateListUser(user.getId()); //Se actualiza debido a que el filtro altera el arreglo de ingresos y gastos del usuario, aquí se reestablece la información de dichos arreglos
            refreshTransaction();

            // Limpia los campos del filtro.
            minimoFilter.value = "";
            maximoFilter.value = "";
            tipoFilter.value = "Tipo";
            categoriaFilter.value = "Categoría";
            fechaFilter.value = "";
        }); //pagina transacciones

        document.getElementById("viewAll").addEventListener("click", function(e){
            if(e.target.textContent == "Ver todas"){
                campoIngresos.closest(".transactions-container").style.display = "none";
                campoGastos.closest(".transactions-container").style.display = "none";
                campoTransacciones.closest(".transactions-container").style.display = "unset";

                e.target.textContent = "Ingreso/Gasto"

            } else if (e.target.textContent == "Ingreso/Gasto"){
                campoIngresos.closest(".transactions-container").style.display = "unset";
                campoGastos.closest(".transactions-container").style.display = "unset";
                campoTransacciones.closest(".transactions-container").style.display = "none";

                e.target.textContent = "Ver todas";
            }
        }); //pagina transacciones

        sizePage.addEventListener("change", function(){
            if(!statusFilter){
                refreshTransaction();
                printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth)
            } else if(statusFilter){
                resultFilter()
            }
        }); //pagina transacciones

        // Función que establece los valores de una transacción a editar.
        function editTransaction(button) {
            let transactionNode = document.querySelectorAll(".transaccion");
            let transactionList = [...transactionNode];
            transactionList.forEach(transaction => transaction.style.color = "#000");

            // Establece el valor de los campos del formulario con los datos de la transacción seleccionada.
            if (button.closest(".transaccion").dataset.tipo == "Ingreso") {
                document.getElementById("tipo").selectedIndex = 1;
            } else if (button.closest(".transaccion").dataset.tipo == "Gasto") {
                document.getElementById("tipo").selectedIndex = 2;
            }

            categoria.value = button.closest(".transaccion").querySelector(".titleCategory").textContent;
            valor.value = button.closest(".transaccion").querySelector(".titleValue").textContent;
            descripcion.value = button.closest(".transaccion").querySelector(".titleDescription").textContent;
            fecha.value = button.closest(".transaccion").querySelector(".titleDate").textContent;
        
            document.getElementById("cancelar").addEventListener("click", function (e) {
                // button.closest(".transaccion").style.color = "unset"; // Restaura el color de la transacción.
                document.getElementById("editModal").style.display = "none"
            });
        }

        // Aplica el filtro sobre las transacciones.
        function resultFilter() {
            dataFilter = user.getTransactions().getFilter().filter(minimoFilter.value, maximoFilter.value, tipoFilter.value, categoriaFilter.value, fechaFilter.value, transactionByMonth);
            user.getTransactions().updateListFilter(dataFilter); //Actualiza el arreglo de filtros del usuario
            console.log(dataFilter);

            dataByMonth(user.getTransactions().getListFilter()); //En base al arreglo de filtros del usuario se obtiene todas las transacciones filtradas correspondiente al mes en curso
            calculateBalance(ingresosByMonth, gastosByMonth);  // Calcula el balance entre ingresos y gastos.
            printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); // Imprime las transacciones filtradas.
            
        }
    }

    // Redirige al usuario a la página de cuenta.
    document.getElementById("account").addEventListener("click", function() {
        window.location.href = "account.html";
    });

    // Cierra la sesión y redirige al login.
    document.getElementById("logout").addEventListener("click", function() {
        document.getElementById("titleMain").textContent = `Hasta luego, ${user.getName()}`;
        user = null;
        endSession();
    });

    month.addEventListener("change", function(){
        refreshTransaction();
    });

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

    function refreshTransaction(){ //Shorthand para filtrar, calcular e imprimir las transacciones del mes en curso
        dataByMonth(user.getTransactions().getListTransaction()); //Obtiene las transacciones del usuario de acuerdo al mes en curso
        calculateBalance(ingresosByMonth, gastosByMonth); // Calcula el balance entre ingresos y gastos.
        printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); //Imprime todas las transacciones del mes en curso
        if(page == "dashboard.html"){
            recentTransaction();
        }
        console.log(user.getTransactions().getListTransaction())
    }

    //Captura la fecha de las transacciones por usuario y las filtra por el mes actual, de esta manera se obtendran las transacciones del usuario correspondiente al mes en curso
    function dataByMonth(data){
        transactionByMonth = data.filter(transaction => {
            const fecha = transaction.getDate()
            if(fecha.substring(fecha.indexOf("-")+1, fecha.lastIndexOf("-")) == month.value){
                return true;
            }
        });

        transactionByMonth.sort((a, b) => b.getId() - a.getId());

        ingresosByMonth = transactionByMonth.filter(transaction => transaction.getType() == "Ingreso");
        gastosByMonth = transactionByMonth.filter(transaction => transaction.getType() == "Gasto");
        console.log(transactionByMonth);
        console.log(ingresosByMonth);
        console.log(gastosByMonth);
    }

    // Función que calcula el balance total entre ingresos y gastos.
    function calculateBalance(ingresos, gastos) {
        let ingresoTotal = document.getElementById("valorIngreso");
        let gastoTotal = document.getElementById("valorGasto");
        let saldoTotal = document.getElementById("saldo")

        user.getBalance(ingresos, ingresoTotal);
        user.getBalance(gastos, gastoTotal);

        saldoTotal.textContent = Number(ingresoTotal.textContent) - Number(gastoTotal.textContent);
        ingresoTotal.textContent = textCurrency(+ingresoTotal.textContent);
        gastoTotal.textContent = textCurrency(+gastoTotal.textContent);
        saldoTotal.textContent = textCurrency(+saldoTotal.textContent);
    }

    function textCurrency(value) {
        return value.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    // Imprime las transacciones de ingresos y gastos.
    function printTransactions(ingresos, gastos, transacciones) { //pagina transacciones
        if(page == "transaction.html"){
            user.getTransactions().getManager().printTransaction(campoIngresos, ingresos, sizePage.value);
            user.getTransactions().getManager().printTransaction(campoGastos, gastos, sizePage.value);
            user.getTransactions().getManager().printTransaction(campoTransacciones, transacciones, sizePage.value);

            pagination(campoIngresos, pageIngresos); //Programa los botones de la páginación para los ingresos
            pagination(campoGastos, pageGastos); //Programa los botones de la páginación para los gastos
            pagination(campoTransacciones, pageTransacciones);

            // printDefault(campoIngresos, ingresos); // Imprime el mensaje por defecto si no hay transacciones.
            // printDefault(campoGastos, gastos); // Imprime el mensaje por defecto si no hay transacciones.
            // printDefault(campoTransacciones, transacciones);
        }
        
    }

    // Imprime las categorías disponibles para el usuario.
    function printCategory() {
        user.getCategories().printCategories(categoria); // En sección de añadir.
        if(page == "transaction.html"){
            user.getCategories().printCategories(document.getElementById("categoriaFilter")); // En sección de filtrar. //pagina transacciones
        }
    }

    function recentTransaction(){
        document.getElementById("recentTransactions").innerHTML = "";
        if(transactionByMonth.length != 0){ //Se aplica condición para que no genere error en caso de estar vacio el arreglo
            for (let i = 0; i < 5; i++) {
                document.getElementById("recentTransactions").innerHTML += `<tr>
                                <td>${transactionByMonth[i].getType()}</td>
                                <td>${transactionByMonth[i].getValue()}</td>
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

    //Función que se encarga de crear el funcionamiento de la páginación de las transacciones
    function pagination(container, buttonContainer){
        let lastPage = container.lastChild;
        
        if(lastPage.children.length < sizePage.value){ //Esta condición se encarga de llenar los espacios vacíos en las últimas páginas con una estructura base de una transacción para que de esta manera se cree un tamaño fijo a cada uno de los tamaño de página. De igual forma, si no hay transacciones imprimirá estructuras de transacciones en la primer página (que será también la última) para generar un tamaño fijo
            let diference = sizePage.value - lastPage.children.length;
            for (let i = 0; i < diference; i++) {
                let elemento =`
                    <div class="transaccion">
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                    </div>`

                lastPage.innerHTML += elemento;
            }
        }

        // if(lastPage.children.length == 0){
        //     lastPage.children[0].textContent = "Sin transacciones";
        // }
        
        container.firstChild.style.display = "unset" //La primer página del elemento contenedor de páginas se mostrará por defecto

        //Limpia el elemento contenedor de los botones para que se puedan crear nuevamente sin repetirse cuando se elija el tamaño de página 
        if(container.id == "campoIngresos" || container.id == "campoGastos" || container.id == "campoTransacciones"){
            buttonContainer.innerHTML = "";
        }

        //Ciclo que se encarga de crear los botones de acuerdo a la cantidad de páginas del elemento contenedor de páginas
        for (let i = 0; i < container.children.length; i++) {
            let pageButton = document.createElement("button");
            pageButton.textContent = i + 1;

            //De acuerdo al id del elemento contenedor de páginas se irá agregando los botones al elemento contenedor de botones correspondiente
            if(container.id == "campoIngresos" || container.id == "campoGastos" || container.id == "campoTransacciones"){
                buttonContainer.appendChild(pageButton);
                paginationButtons(buttonContainer, container);
            }
        }
    }

    //Una vez creados y añadidos los botones de cada página se registra un evento al elemento contenedor de estos botones y a través de la delegación de eventos asignar un botón a cada página
    function paginationButtons(buttons, container){
        buttons.addEventListener("click", function(e){
            if(e.target.tagName == "BUTTON"){ //Previene a que la lógica de los botones solo ocurra cuando se haga click en elementos <button> y que no comience actuar cuando se haga click en el elemento contenedor de botones 
                
                [...container.children].forEach(page => { //Oculta a todas las páginas, esto para despejar al elemento contenedor de páginas y así poder mostrar otra página elegida por el usuario previniendo combinar la información de páginas anteriormente vista
                    page.style.display = "none"
                });
                //De acuerdo al texto del boton clickeado, este se ajustará en forma de indice para hacer referencia a la pagina que se encuentrá en el elemento contenedor de páginas y así mostrarla
                container.children[e.target.textContent-1].style.display = "unset";
            }   
        });
    }
});
