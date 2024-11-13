import TransactionManager from "./TransactionManager.js";
import TransactionFilter from "./TransactionFilter.js";

// Clase que representa una transacción financiera.
export default class Transaccion {
    // Contador para asignar un ID único a cada transacción.
    static contadorId = 0;
    // Almacena todas las transacciones creadas.
    static _transactionData = [];

    // Constructor de la clase Transaccion.
    //Este constructor esta hecho en base a una condicioón, esto con el fin de poder declarar un contructor vacio.
    //El constructor define a los parametros con valores fijos, es decir cada parametro tiene un valor null
    //Bajo una condición se determina entonces si el valor de los parametros en realidad es null, si todos los parametros son verdaderos, es decir, tienen valores diferentes a null o también 0, "" ó false entonces se procederá a invocar el constructor con argumentos
    //En cambio si la condición es falsa, es decir alguno o todos los valores son null, se procederá a invocar el constructor sin argumentos (vacío).
    //Se crea una condición la cual hace que pasar argumentos a los parametros sea mas flexible ya que existe la posiblidad de que alguno de los parametros reciba valores con estados false, como 0 ó "" (cadena vacía), los cuales por funcionamiento son necesarios pasarlos como argumento.
    //Si la condición indica que todos los valores deben ser verdaderos: if(user && tipo && valor && descripcion && categoria && fecha), al pasar valores con estados false, como 0, "" ó false, hara que la condición no se cumpla, por que al menos uno de ellos es false cuando se requiere que todos sean true
    //Ejemplo, si se desea crear ó actualizar una transacción y su descripción se deja vacia (cadena vacia ""), entonces la transacción tendrá un comportamiento mal programado, haciendo que no se imprima al crearse o esta se borre al actualizar la página despues de actualizarla ya que no se pudo crear dicha instancia
    constructor(user = null, tipo = null, valor = null, descripcion = null, categoria = null, fecha = null) {
        const status = user !== null && tipo !== null && valor !== null && descripcion !== null && categoria !== null && fecha !== null;
        
        if (status) {
            this._id = ++Transaccion.contadorId; // Asigna un ID único a la transacción.
            this._user = user; // Asigna el usuario a la transacción.
            this._tipo = tipo; // Asigna el tipo de transacción (Ingreso o Gasto).
            this._valor = valor; // Asigna el valor de la transacción.
            this._descripcion = descripcion; // Asigna la descripción de la transacción.
            this._categoria = categoria; // Asigna la categoría de la transacción.
            this._fecha = fecha; // Asigna la fecha de la transacción.
            Transaccion._transactionData.push(this); // Agrega la transacción al arreglo global.
            Transaccion.saveDataSession(); // Guarda la sesión de las transacciones.
        } else {
            this._listTransactions = []; // Lista de transacciones del usuario.
            this._listFilter = []; // Lista filtrada de transacciones.
            this._ingresos = []; // Lista de ingresos.
            this._gastos = []; // Lista de gastos.
            this._1manager = new TransactionManager(); // Crea un gestor de transacciones.
            this._2filter = new TransactionFilter(); // Crea un filtro de transacciones.
        }
    }

    // Método estático para guardar las transacciones en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("transaction", JSON.stringify(Transaccion.getTransactionData()));
        //Guarda en sessionStorage la base de datos de las transacciones (transactionData) cuando haya modificaciones en esta (crear, modificar o eliminar una transacción). Esto con el fin de conservar los valores que se hayan almacenado en la base de datos para poder utilizarlos en una nueva página.
    }

    // Método estático para cargar las transacciones desde sessionStorage.
    static loadDataSession() {
        let data = JSON.parse(sessionStorage.getItem("transaction"));
        for (let i = 0; i < data.length; i++) {
            let transaction = new Transaccion(data[i]._user, data[i]._tipo, data[i]._valor, data[i]._descripcion, data[i]._categoria, data[i]._fecha);
            transaction.setId(data[i]._id);
        }

        //Carga en la base de datos (transactionData) el elemento almacenado en sessionStorage (gestionado por saveDataSession). Esto con el fin de entregar a la base de datos todos los valores que fueron añadidos a la esta antes de recargar la pagina, esto permite a la base de datos mantenerse actualizada constantemente
        //Función que reconstruye una instancia después de ser transformada nuevamente a su valor original (JSON.parse). Esto debido a que las instancias se encontraban almacenadas en formato JSON (JSON.stringify)
        //JSON transforma la base de datos en una cadena de caracteres para que sessionStorage pueda almacenarla y al transformarla nuevamente a su valor original (arreglo de objetos), los objetos no conservarán sus métodos de clase ya que se pierde la instancia del objeto al momento de la conversion al intentar almacenar la base de datos en sessionStorage
    }

    // Métodos para obtener los atributos de la transacción.
    getId() { return this._id; }
    getType() { return this._tipo; }
    getValue() { return this._valor; }
    getCategory() { return this._categoria; }
    getDescription() {return this._descripcion}
    getDate() { return this._fecha; }
    getListTransaction() { return this._listTransactions; }
    getManager() { return this._1manager; }
    getFilter() { return this._2filter; }
    getListIngreso() { return this._ingresos; }
    getListGasto() { return this._gastos; }
    getListFilter() {return this._listFilter}

    // Método estático para obtener todas las transacciones.
    static getTransactionData() { return Transaccion._transactionData; }

    // Métodos para establecer los atributos de la transacción.
    setId(id) { this._id = id; }
    setDescripcion(descripcion) { this._descripcion = descripcion; }
    setValor(valor) { this._valor = valor; }

    //Busca una transaccion por su id
    findTransaction(id){
        return Transaccion._transactionData.find(transaction => transaction._id == id);
    }

    // Método para calcular el total de ingresos.
    totalIngreso() {
        let contador = 0;
        this._ingresos.forEach(transaction => {
            contador += transaction._valor;
        });
        return contador;
    }

    // Método para calcular el total de gastos.
    totalGasto() {
        let contador = 0;
        this._gastos.forEach(transaction => {
            contador += transaction._valor;
        });
        return contador;
    }

    // Método para actualizar la lista de transacciones del usuario.
    updateListUser(id) {
        this._listTransactions = Transaccion._transactionData.filter((transaction) => transaction._user == id);
        this._ingresos = this._listTransactions.filter((transaction) => transaction._tipo == "Ingreso");
        this._gastos = this._listTransactions.filter((transaction) => transaction._tipo == "Gasto");
    }

    // Método para actualizar la lista de transacciones filtradas.
    updateListFilter(dataFilter) {
        this._listFilter = dataFilter;
    }
}
