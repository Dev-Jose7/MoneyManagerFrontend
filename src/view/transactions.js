import { monthLoad, printCategory, updateValues, user, tipo, valor, categoria, fecha, descripcion, sizePage, menuButton, printNameUser, alertConfirm, pagination, ingresosByMonth, gastosByMonth, transactionByMonth, textFormat, dataByMonth, calculateBalance, modalCancel, updateListUser, month} from "../../assets/js/panel.js";
import { alertShow } from "../../assets/js/util.js";

export let pageTransaction = document.location.href;
document.addEventListener("DOMContentLoaded", function(){
    if(pageTransaction.includes("transaction")){
        let id = 0;
        let dataFilter = [];
        let statusFilter = false;

        let campoIngresos = document.getElementById("campoIngresos");
        let campoGastos = document.getElementById("campoGastos");
        let campoTransacciones = document.getElementById("campoTransacciones");

        let pageIngresos = document.getElementById("pageIngresos");
        let pageGastos = document.getElementById("pageGastos");
        let pageTransacciones = document.getElementById("pageTransacciones");

        let minimoFilter = document.getElementById("minimoFilter");
        let maximoFilter = document.getElementById("maximoFilter");
        let tipoFilter = document.getElementById("tipoFilter");
        let categoriaFilter = document.getElementById("categoriaFilter");
        let fechaFilter = document.getElementById("fechaFilter");

        menuButton();
        printNameUser();
        updateListUser();
        monthLoad(); //Carga el mes actual al dashboard y le registra un evento de tipo change para imprimir la información del mes correspondiente
        updateValues() //Se encarga de filtrar, calcular e imprimir las transacciones del usuario
        printCategory();
        printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth);
        modalCancel();

        month.addEventListener("change", function(){
            printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth);
        });

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
                        () => updateValues(),
                        () => printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth)
                    ]
                    alertConfirm("Eliminar", "Transacción eliminada", "deleteTransaction", method);
                    

                    if (!statusFilter) {
                        updateValues(); // Imprime las transacciones nuevamente si no hay filtro.
                        printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth);
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
                console.log(descripcion.value != user.getTransactions().findTransaction(id).getDescription())
                user.getTransactions().getManager().updateTransaction(id); // Actualiza la transacción.
                user.getTransactions().updateListUser(user.getId());
            
                alertShow("Hecho!", "Transacción actualizada", "success");
            }

            document.getElementById("editModal").style.display = "none";

            if (!statusFilter) {
                updateValues();
                printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth);
                console.log(ingresosByMonth, gastosByMonth, transactionByMonth)
            } else if (statusFilter) {
                resultFilter() // Aplica el filtro nuevamente si está activado.
            }
        }); //pagina transacciones

        // Aplica el filtro cuando se hace clic en el botón de filtrar.
        document.getElementById("filter").addEventListener("click", function(e) {
            updateValues(); //Refresca nuevamente las transacciones del mes antes de realizar un filtro para que pueda obtener resultados con que actualizar
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
            updateValues();
            printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth);

            // Limpia los campos del filtro.
            minimoFilter.value = "";
            maximoFilter.value = "";
            tipoFilter.value = "Tipo";
            categoriaFilter.value = "Categoría";
            fechaFilter.value = "";
        }); //pagina transacciones

        document.getElementById("viewAll").addEventListener("click", function(e){
            if(e.target.textContent == "Ver todas"){
                campoIngresos.closest(".section-container").style.display = "none";
                campoGastos.closest(".section-container").style.display = "none";
                campoTransacciones.closest(".section-container").style.display = "unset";

                e.target.style.background = "linear-gradient(135deg, #4CAF50 50%, #FF4D4D 50%)";
                e.target.textContent = "Ingreso/Gasto"

            } else if (e.target.textContent == "Ingreso/Gasto"){
                campoIngresos.closest(".section-container").style.display = "unset";
                campoGastos.closest(".section-container").style.display = "unset";
                campoTransacciones.closest(".section-container").style.display = "none";

                e.target.style.background = "#333";
                e.target.textContent = "Ver todas";
            }
        }); //pagina transacciones

        sizePage.addEventListener("change", function(){
            if(!statusFilter){
                updateValues();
                printTransactions(ingresosByMonth, gastosByMonth, transactionByMonth)
            } else if(statusFilter){
                resultFilter()
            }
        }); //pagina transacciones

        // Imprime las transacciones de ingresos y gastos.
        function printTransactions(ingresos, gastos, transacciones) { //pagina transacciones
            // user.getTransactions().getManager().printTransaction(campoIngresos, ingresos);
            // user.getTransactions().getManager().printTransaction(campoGastos, gastos);
            // user.getTransactions().getManager().printTransaction(campoTransacciones, transacciones);

            pagination(campoIngresos, pageIngresos, ingresos, sizePage.value, user.getTransactions().getManager().printTransaction); //Programa los botones de la páginación para los ingresos
            pagination(campoGastos, pageGastos, gastos, sizePage.value, user.getTransactions().getManager().printTransaction); //Programa los botones de la páginación para los gastos
            pagination(campoTransacciones, pageTransacciones, transacciones, sizePage.value, user.getTransactions().getManager().printTransaction);
            
            textFormat(campoIngresos);
            textFormat(campoGastos);
            textFormat(campoTransacciones);
        }

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
});