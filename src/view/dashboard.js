import User from "../controllers/account/User.js";
import { alertShow, checkSession, completeInput, confirmPassword, confirmShow, endSession, findUser, textCurrency } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";
import Category from "../controllers/tag/Category.js";

checkSession(); //Revisa si hay un usuario en el sessionStorage para continuar

// Cuando el contenido del documento está listo, se cargan los datos de sesión de usuarios, transacciones y categorías y se declarán las variables necesarias.
document.addEventListener("DOMContentLoaded", function() {
    // Obtiene la URL actual y el nombre de la página.
    let url = document.location.href;
    let page = url.substring(url.lastIndexOf('/') + 1);

    let id = 0;
    let user = {};
    let dataFilter = [];
    let statusFilter = false;
    let tagTarget = "";

    let name = document.getElementById("name"); // Muestra el nombre del usuario.
    let email = document.getElementById("email"); // Muestra el correo del usuario.
    let password = document.getElementById("password"); // Muestra la contraseña del usuario.

    let nameUpdate = document.getElementById("nameUpdate");
    let emailUpdate = document.getElementById("emailUpdate");
    let passwordUpdate = document.getElementById("passwordUpdate");
    let passwordConfirm = document.getElementById("passwordConfirm");
    let tagInput = document.getElementById("tagInput");
    let updateTagInput = document.getElementById("updateTagInput");

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
    let pageCategoria = document.getElementById("pageCategoria");

    let month = document.getElementById("month");
    let transactionByMonth = [];
    let ingresosByMonth = [];
    let gastosByMonth = [];

    User.loadDataSession(); //Crea las instancias de prueba solo una vez siempre y cuando no existan 
    Transaccion.loadDataSession(); //Carga todas las transacciones
    Category.loadDataSession(); //Carga todas las categorias
        
    user = findUser(); // Encuentra al usuario actual.

    // Actualiza las listas de transacciones y categorías del usuario.
    user.getTransactions().updateListUser(user.getId());
    user.getCategories().updateListUser(user.getId());

    if(page == "dashboard" || page == "dashboard.html"){
        monthLoad(); //Carga el mes actual al dashboard y le registra un evento de tipo change para imprimir la información del mes correspondiente
        refreshTransaction() //Se encarga de filtrar, calcular e imprimir las transacciones del usuario
        printCategory();

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

                alertShow("Hecho!", "Transacción registrada", "success");
                console.log(user);
            } else{
                alertShow("Error!", "Ingrese todos los campos faltantes", "warning");
            }
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
    }

    if(page == "transaction" || page == "transaction.html"){
        monthLoad();
        refreshTransaction() //Se encarga de filtrar, calcular e imprimir las transacciones del usuario
        printCategory();

        console.log(user);
        
        // Evento para modificar o eliminar transacciones al hacer clic en un botón de acción.
        document.querySelector(".transacciones").addEventListener("click", function(e) {
            if (e.target.tagName == "I") {
                console.log("verdadero")
                let button = e.target;
                id = button.closest(".transaccion").dataset.id; // Captura el ID de la transacción.

                if(button.classList.contains("nota")){
                    let transaction = user.getTransactions().findTransaction(id);
                    document.getElementById("modalDescription").innerHTML = `<p>${transaction.getDescription()}</p> <h5>${transaction.getCategory()}</h5>`;
                    document.getElementById("noteModal").style.display = "unset";
                }

                if (button.classList.contains("modificar")) {
                    console.log("Modificando");
                    document.getElementById("editModal").style.display = "unset";
                    console.log(id);
                    editTransaction(button); // Llama a la función para editar la transacción.
                }
            
                if (button.classList.contains("eliminar")) {
                    console.log("Eliminando");
                    let method = [
                        () => user.getTransactions().getManager().deleteTransaction(id, button.closest(".transaccion")),
                        () => user.getTransactions().updateListUser(user.getId()),
                        () => refreshTransaction()
                    ]
                    alertConfirm("Eliminar", "Transacción eliminada", "deleteTransaction", method);

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
            e.preventDefault();

            //Valida si alguno de los valores de los campos de actualizar transacción son diferentes al dato correspondiente de la transacción ha actualizar, ya que si alguno de los campos es diferente se procede ha actualizarse
            if(tipo.value != user.getTransactions().findTransaction(id).getType() || categoria.value != user.getTransactions().findTransaction(id).getCategory() || valor.value != user.getTransactions().findTransaction(id).getValue() || descripcion.value != user.getTransactions().findTransaction(id).getDescription() || fecha.value != user.getTransactions().findTransaction(id).getDate()){
                user.getTransactions().getManager().updateTransaction(id); // Actualiza la transacción.
                user.getTransactions().updateListUser(user.getId());
            
                alertShow("Hecho!", "Transacción actualizada", "success");
            }

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

                e.target.style.background = "linear-gradient(135deg, #4CAF50 50%, #FF4D4D 50%)";
                e.target.textContent = "Ingreso/Gasto"

            } else if (e.target.textContent == "Ingreso/Gasto"){
                campoIngresos.closest(".transactions-container").style.display = "unset";
                campoGastos.closest(".transactions-container").style.display = "unset";
                campoTransacciones.closest(".transactions-container").style.display = "none";

                e.target.style.background = "#333";
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

            categoria.value = user.getTransactions().findTransaction(id).getCategory();
            valor.value = user.getTransactions().findTransaction(id).getValue();
            descripcion.value = user.getTransactions().findTransaction(id).getDescription();
            fecha.value = user.getTransactions().findTransaction(id).getDate();
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

    if(page == "account" || page == "account.html"){
        printDataUser();
        printCategory();

        console.log(user.getCategories().getCategoriesUser());
        
        // Muestra las estadísticas de ingresos y gastos del usuario.
        document.getElementById("cantIngreso").textContent = user.getTransactions().getListIngreso().length;
        document.getElementById("cantGasto").textContent = user.getTransactions().getListGasto().length;
        document.getElementById("cantTransaccion").textContent = user.getTransactions().getListTransaction().length
        document.getElementById("totalIngreso").textContent = textCurrency(user.getTransactions().totalIngreso());
        document.getElementById("totalGasto").textContent = textCurrency(user.getTransactions().totalGasto());
        document.getElementById("saldoNeto").textContent = textCurrency(user.getTransactions().totalIngreso() - user.getTransactions().totalGasto());

        // Evento para mostrar u ocultar la contraseña.
        document.getElementById("showPassword").addEventListener("click", function(e) {
            if (e.target.textContent == "Ver contraseña") {
                console.log("bien")
                password.textContent = user.getPassword(); // Muestra la contraseña real.
                e.target.textContent = "Ocultar pass";
            } else if (e.target.textContent == "Ocultar pass") {
                password.textContent = "********"; // Oculta la contraseña.
                e.target.textContent = "Ver contraseña";
            }
        });

        // Modal para actualizar datos del usuario
        document.getElementById("updateData").addEventListener("click", function(e) {
            document.getElementById("editModal").style.display = "unset"
        });

        // Modal para añadir categoria
        document.getElementById("addCategory").addEventListener("click", function(){
            document.getElementById("addTagModal").style.display = "unset"

            console.log([...document.getElementById("addTagModal").querySelectorAll("input")])
        });

        // Modal para actualizar o eliminar las categorias
        document.getElementById("categoria").addEventListener("click", function(e){
            if (e.target.tagName == "I") {
                let button = e.target;
                tagTarget = button.closest(".list").querySelector("h4").textContent;

                if (button.classList.contains("modificar")) {
                    console.log("Modificando", tagTarget);
                    document.getElementById("editTagModal").style.display = "unset";
                    updateTagInput.placeholder = tagTarget;
                }
            
                if (button.classList.contains("eliminar")) {
                    console.log("Eliminando", tagTarget);
                    let method = [
                        () => user.getCategories().deleteCategory(tagTarget, user.getId()), 
                        () => user.getCategories().updateListUser(user.getId()), 
                        () => printCategory()
                    ]
                    
                    alertConfirm('Eliminar', 'Categoria eliminada', 'deleteCategory', method);
                }
            }
        });

        // Actualizar el usuario
        document.getElementById("updateUser").addEventListener("click", function(e){
            e.preventDefault();
            
            let complete = false;

            if(nameUpdate.value != ""){
                user.setName(nameUpdate.value);
                alertShow("Hecho!", "Su nombre ha sido cambiado", "success");
                complete = true;
            }

            if(emailUpdate.value != ""){
                user.setEmail(emailUpdate.value);
                alertShow("Hecho!", "Su correo ha sido cambiado", "success");
                complete = true;
            }

            if(passwordUpdate.value != "" && passwordConfirm.value != ""){
                if(confirmPassword(passwordUpdate.value, passwordConfirm.value)){
                    user.setPassword(passwordConfirm.value);
                    alertShow("Hecho!", "La contraseña ha sido cambiada", "success");
                    complete = true;
                } else {
                    alertShow("Error!", "Las contraseñas no coinciden", "warning");
                    complete = false;
                }
            }
        
            if(complete){
                document.getElementById("editModal").style.display = "none";
                printDataUser();
            }
        });

        // Añadir categoria
        document.getElementById("addTag").addEventListener("click", function(e){
            e.preventDefault();
            if(completeInput([...document.getElementById("addTagModal").querySelectorAll("input")])){
                if(!user.getCategories().validateCategory(tagInput.value)){
                    user.getCategories().addCategory(tagInput.value, user.getId());
                    user.getCategories().updateListUser(user.getId());
                    printCategory();
                    alertShow("Hecho!", "La categoria ha sido añadida", "success");
                } else {
                    alertShow("Error!", "Esta categoria ya se encuentra registrada", "warning");
                }
            } else {
                alertShow("Error!", "Debes darle un nombre a la categoria", "warning");
            }
        });

        // Actualiza las categorias
        document.getElementById("updateTag").addEventListener("click", function(e){
            e.preventDefault();
            if(completeInput([...document.getElementById("editTagModal").querySelectorAll("input")])){
                    if(!user.getCategories().validateCategory(updateTagInput.value)){ //se valida que la nueva categoria no haga parte de las categorias registradas
                        user.getCategories().updateCategory(tagTarget, updateTagInput.value, user.getId()); //Se actualiza la categoria personalizada
                        alertShow("Hecho!", "Categoria actualizada", "success")
                    } else {
                        alertShow("Error!", "Esta categoria ya se encuentra registrada", "warning");
                    }
                

                user.getCategories().updateListUser(user.getId());
                console.log(user.getCategories().getCategoriesUser())
                user.getTransactions().getManager().updateTagTransaction(tagTarget, updateTagInput.value, user.getId()); //Se actualiza todas las transacciones que usarón la categoria anterior por la nueva
                printCategory();
            } else {
                alertShow("Error!", "Debes darle un nombre a la categoria", "warning");
            }
        });
    }

    // Redirige al usuario a la página de cuenta.
    document.getElementById("account").addEventListener("click", function() {
        window.location.href = "account.html";
    });

    // Cierra la sesión y redirige al login.
    document.getElementById("logout").addEventListener("click", function() {
        document.getElementById("titleMain").textContent = `Hasta luego, ${user.getName()}`;
        user = null;
        endSession("./login.html");
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

    function monthLoad(){
        let date = new Date();
        month.value = date.getMonth() + 1;

        month.addEventListener("change", function(){
            refreshTransaction();
        });
    } 

    function refreshTransaction(){ //Shorthand para filtrar, calcular e imprimir las transacciones del mes en curso
        dataByMonth(user.getTransactions().getListTransaction()); //Obtiene las transacciones del usuario de acuerdo al mes en curso
        calculateBalance(ingresosByMonth, gastosByMonth); // Calcula el balance entre ingresos y gastos.
        printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth); //Imprime todas las transacciones del mes en curso
        if(page == "dashboard" || page == "dashboard.html"){
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

        //Organiza las transacciones de acuerdo al dia de la fecha de su registro (mayor a menor)
        transactionByMonth.sort((a, b) => b.getDate().substring(b.getDate().lastIndexOf("-")+1) - a.getDate().substring(a.getDate().lastIndexOf("-")+1));

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

    // Imprime las transacciones de ingresos y gastos.
    function printTransactions(ingresos, gastos, transacciones) { //pagina transacciones
        if(page == "transaction" || page == "transaction.html"){
            // user.getTransactions().getManager().printTransaction(campoIngresos, ingresos);
            // user.getTransactions().getManager().printTransaction(campoGastos, gastos);
            // user.getTransactions().getManager().printTransaction(campoTransacciones, transacciones);

            pagination(campoIngresos, pageIngresos, ingresos, sizePage.value, user.getTransactions().getManager().printTransaction); //Programa los botones de la páginación para los ingresos
            pagination(campoGastos, pageGastos, gastos, sizePage.value, user.getTransactions().getManager().printTransaction); //Programa los botones de la páginación para los gastos
            pagination(campoTransacciones, pageTransacciones, transacciones, sizePage.value, user.getTransactions().getManager().printTransaction);

            // printDefault(campoIngresos, ingresos); // Imprime el mensaje por defecto si no hay transacciones.
            // printDefault(campoGastos, gastos); // Imprime el mensaje por defecto si no hay transacciones.
            // printDefault(campoTransacciones, transacciones);
            textFormat(campoIngresos);
            textFormat(campoGastos);
            textFormat(campoTransacciones);
        }
    }

    function textFormat(container){
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
    function printCategory() {
        if(page == "dashboard" || page == "dashboard.html"){
            user.getCategories().printCategories(categoria);
        }
        
        user.getCategories().printCategories(categoria); // En sección de añadir.
        if(page == "transaction" || page == "transaction.html"){
            user.getCategories().printCategories(document.getElementById("categoriaFilter")); // En sección de filtrar. //pagina transacciones
        }

        if(page == "account" || page == "account.html"){
            user.getCategories().getCategoriesUser().sort((a, b) => {return getTotalCategory(b) - getTotalCategory(a)}); //Se ordena el arreglo de categorias de mayor a menor de acuerdo a la cantidad de transacciones que tenga cada una
            pagination(categoria, pageCategoria, user.getCategories().getCategoriesUser(), 3, user.getCategories().printCategories);
        }
    }

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

    //Método que se encarga de imprimir la páginación (maquetarla)
    function pagination(container, buttonContainer, vector, size, callback){
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
    function paginationDefault(container, buttonContainer, size){
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
    function paginationButtons(container, buttonContainer){
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

    function printDataUser(){
        name.textContent = user.getName();
        email.textContent = user.getEmail();

        nameUpdate.placeholder = user.getName();
        emailUpdate.placeholder = user.getEmail();
    }

    function getTotalCategory(tag){
        let filter = user.getTransactions().getFilter().filter("", "", "Tipo", tag, "", user.getTransactions().getListTransaction());
        return filter.length
    }

    [...document.querySelectorAll(".cancelar")].forEach(element => {
        element.addEventListener("click", function(e){
            console.log("click")
            e.target.closest(".modal").style.display = "none";
        });
    });

    //Función que permite crear y programar un alert de confirmación  
    async function alertConfirm(title, text, id, functions){
        await confirmShow(title, text, id); //Se crea el alert pasando estos valores

        //Se registra un evento de tipo click al boton de confirmación del alert mediante un id establecido como parametro (id que se asigno al boton al momento de crear el alert) para que cuando ocurra, ejecuté todas las funciones que fueron pasadas mediante un arreglo 
        document.getElementById(id).addEventListener("click", function(){ 
            functions.forEach(method => method()); //Las funciones o métodos almacenados en el arreglo se encuentrán adentro de funciones anonimas, esto permite que dichos elementos puedan ser asignados en el arreglo con sus argumentos necesarios sin invocarse inmediatamente, permitiendo así que las funciones o métodos sean invocados cuando se recorra el arreglo que las contiene, es decir llamando a cada una de las funciones anonimas que las contiene
        });
    }
});
