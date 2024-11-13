import { dataByMonth, filterData, gastosByMonth, ingresosByMonth, menuButton, monthLoad, printCategory, printNameUser, transactionByMonth, updateListUser, updateValues, user } from "../../assets/js/panel.js";

export let pageStatistics = document.location.href
document.addEventListener("DOMContentLoaded", function(){
    if(pageStatistics.includes("estadisticas")){
        let graphValue = "";

        menuButton();
        printNameUser();
        monthLoad(); //Carga el mes actual al dashboard y le registra un evento de tipo change para imprimir la información del mes correspondiente
        updateListUser();
        dataByMonth(user.getTransactions().getListTransaction())
        
        document.getElementById("month").addEventListener("change", function(){
            [...document.querySelectorAll("input")].forEach(radio => {
                radio.checked = false;
            });

            dataByMonth(user.getTransactions().getListTransaction());
            document.getElementById("optionTag").checked = true;
            document.getElementById("chartBarra").checked = true;
            
            readGraph();
            chartCategory();
        })

        readGraph(); //Revisa cual de los elementos radio del tipo de grafico (name = chart) esta seleccionado para almacenarlo su valor en variable
        chartCategory(); //Se imprime los graficos de tipo de transacciones (ingreso/gasto) ya que estos valores estan seleccionados por defecto

        document.querySelector(".chart").addEventListener("input", function(){ //Se registra evento en el elemento contenedor de los radio para identificar cuando se seleccionad uno de ellos
            readGraph(); //Cada que ocurra el evento se mantiene actualizando la variable para determinar el tipo de gráfico

            //Si el radio tipo de transacción ó el de categorias esta seleccionado imprimirán sus gráficos correspondientes
            if(document.getElementById("optionType").checked){
                chartType();
            }

            if(document.getElementById("optionTag").checked){
                chartCategory();
            }

            if(document.getElementById("optionDate").checked){
                chartDate();
            }
        });

        function readGraph(){
            [...document.getElementsByName("chart")].forEach(chart => {
                if(chart.checked){
                    graphValue = chart.value
                }
            });
        }

        //Invoca la función que se encarga de imprimir los gráficos usando la libreria chart.js pasandole los argumentos necesarios para armar los gráficos
        function chartType(){
            //Por defecto se define el contenedor, en donde se creará el gráfico y el tipo de grafico a crear por (obtenido por readChecked), los argumentos a pasar son los labels (etiquetas de los datos) y los datos (los valores de cada etiqueta)
            generateChart(document.querySelector(".container-cant"), graphValue, ["Ingreso", "Gasto"], [filterData("Ingreso").length, filterData("Gasto").length]);
            generateChart(document.querySelector(".container-value"), graphValue, ["Ingreso", "Gasto"], [user.getBalance(ingresosByMonth), user.getBalance(gastosByMonth)]);
        }

        function chartCategory(){
            let label = [];
            let data = [];
            user.getCategories().getCategoriesUser().forEach(tag => {
                
                let array = filterData(tag) //Devuelve las transacciones en arreglo las cuales tengan la categoria leida por el forEach
                label.push(array.length) //Se ingresa en el arreglo label la longitud de cada arreglo devuelto por filterData al buscar las transacciones que cuenten con la categoria leida por forEach, este arreglo serán los label del gráfico

                let counter = 0
                array.forEach(transaction => { //En este mismo arreglo de la categoria actual se suma el valor de cada transacción para posteriormente ingresar la suma a un arreglo, este arreglo será la data del grafico
                    counter += transaction.getValue()
                })

                data.push(counter);
            });

            console.log(data)

            generateChart(document.querySelector(".container-cant"), graphValue, user.getCategories().getCategoriesUser(), label)
            generateChart(document.querySelector(".container-value"), graphValue, user.getCategories().getCategoriesUser(), data)
        }

        function chartDate(){
            let label = [];
            let cant = [];
            let value = [];
            
            transactionByMonth.forEach(transaction => {
                const fecha = transaction.getDate()
                label.push(fecha.substring(fecha.indexOf("-")+1));

                value.push(transaction.getValue());

                cant.push(filterData(fecha).length);
            });



            console.log(label)

            generateChart(document.querySelector(".container-cant"), graphValue, label, cant)
            generateChart(document.querySelector(".container-value"), graphValue, label, value)
        }
    }
});