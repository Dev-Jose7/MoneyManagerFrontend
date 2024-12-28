// Clase que representa una transacción financiera.
import TransactionManager from "./TransactionManager.js";
import TransactionFilter from "./TransactionFilter.js";

export default class Transaccion {
    // Contador para asignar un ID único a cada transacción.
    static contadorId = 0;

    // Almacena todas las transacciones creadas.
    static _transactionData = [];

    // Constructor de la clase Transaccion.
    constructor(user = null, tipo = null, valor = null, descripcion = null, categoria = null, fecha = null) {
        // Condición para diferenciar entre transacciones completas y vacías.
        const status = user !== null && tipo !== null && valor !== null && descripcion !== null && categoria !== null && fecha !== null;
        
        if (status) {
            // Transacción con datos completos
            this._id = ++Transaccion.contadorId; // Asigna un ID único.
            this._user = user; // ID del usuario al que pertenece.
            this._tipo = tipo; // Tipo: "Ingreso" o "Gasto".
            this._valor = valor; // Valor de la transacción.
            this._descripcion = descripcion; // Descripción de la transacción.
            this._categoria = categoria; // Categoría asignada.
            this._fecha = fecha; // Fecha de la transacción.
            Transaccion._transactionData.push(this); // Añade a la lista global.
            Transaccion.saveDataSession(); // Guarda en sessionStorage.
        } else {
            // Transacción vacía para gestión interna
            this._listTransactions = []; // Lista de todas las transacciones del usuario.
            this._listFilter = []; // Lista filtrada de transacciones.
            this._ingresos = []; // Lista de ingresos.
            this._gastos = []; // Lista de gastos.
            this._1manager = new TransactionManager(); // Gestión de transacciones.
            this._2filter = new TransactionFilter(); // Filtros de transacciones.
        }
    }

    // Guarda las transacciones en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("transaction", JSON.stringify(Transaccion._transactionData));
    }

    // Carga las transacciones desde sessionStorage.
    static loadDataSession() {
        try {
            let data = JSON.parse(sessionStorage.getItem("transaction")) || [];
            for (let i = 0; i < data.length; i++) {
                let transaction = new Transaccion(
                    data[i]._user,
                    data[i]._tipo,
                    data[i]._valor,
                    data[i]._descripcion,
                    data[i]._categoria,
                    data[i]._fecha
                );
                transaction.setId(data[i]._id);
            }
        } catch (error) {
            console.error("Error al cargar transacciones:", error);
        }
    }

    // Obtiene el ID de la transacción.
    getId() { return this._id; }

    // Obtiene el tipo de la transacción.
    getType() { return this._tipo; }

    // Obtiene el valor de la transacción.
    getValue() { return this._valor; }

    // Obtiene la categoría de la transacción.
    getCategory() { return this._categoria; }

    // Obtiene la descripción de la transacción.
    getDescription() { return this._descripcion; }

    // Obtiene la fecha de la transacción.
    getDate() { return this._fecha; }

    // Obtiene la lista de transacciones.
    getListTransaction() { return this._listTransactions; }

    // Obtiene el gestor de transacciones.
    getManager() { return this._1manager; }

    // Obtiene el filtro de transacciones.
    getFilter() { return this._2filter; }

    // Obtiene la lista de ingresos.
    getListIngreso() { return this._ingresos; }

    // Obtiene la lista de gastos.
    getListGasto() { return this._gastos; }

    // Obtiene la lista filtrada.
    getListFilter() { return this._listFilter; }

    // Obtiene todas las transacciones almacenadas.
    static getTransactionData() { return Transaccion._transactionData; }

    // Establece el ID de la transacción.
    setId(id) { this._id = id; }

    // Actualiza la descripción de la transacción.
    setDescripcion(descripcion) { this._descripcion = descripcion; }

    // Actualiza el valor de la transacción.
    setValor(valor) { this._valor = valor; }

    // Busca una transacción por su ID.
    findTransaction(id) {
        return Transaccion._transactionData.find(transaction => transaction._id == id);
    }

    // Calcula el total de ingresos.
    totalIngreso() {
        let contador = 0;
        this._ingresos.forEach(transaction => {
            contador += transaction._valor;
        });
        return contador;
    }

    // Calcula el total de gastos.
    totalGasto() {
        let contador = 0;
        this._gastos.forEach(transaction => {
            contador += transaction._valor;
        });
        return contador;
    }

    // Actualiza la lista de transacciones del usuario.
    updateListUser(id) {
        this._listTransactions = Transaccion._transactionData.filter(transaction => transaction._user == id);
        this._ingresos = this._listTransactions.filter(transaction => transaction._tipo == "Ingreso");
        this._gastos = this._listTransactions.filter(transaction => transaction._tipo == "Gasto");
    }

    // Actualiza la lista de transacciones filtradas.
    updateListFilter(dataFilter) {
        this._listFilter = dataFilter;
    }
}

// Propósito:
// - Gestionar las transacciones individuales y globales en la aplicación.
// - Permite operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en transacciones.
// - Facilita la organización de las transacciones en ingresos, gastos y filtros personalizados.
// - Garantiza la persistencia de datos mediante sessionStorage.

// Propiedades Importantes:
// 1. _transactionData: Almacena todas las transacciones de forma global.
// 2. contadorId: Asigna identificadores únicos a cada transacción.
// 3. Persistencia: Usa sessionStorage para almacenar y recuperar transacciones.

// Flujo de Uso:
// 1. Crear una Transacción: Se agregan atributos específicos (usuario, tipo, valor, etc.).
// 2. Guardar en sessionStorage: Los datos se mantienen después de recargar la página.
// 3. Consultar y filtrar: Se pueden listar, filtrar y organizar las transacciones.
// 4. Calcular Ingresos y Gastos: Permite obtener balances financieros.

/*
### Resumen de la Clase Transaccion:
- **Propósito:** Gestionar las transacciones financieras (Ingreso/Gasto) de cada usuario.
- **Persistencia:** Los datos se almacenan en sessionStorage.
- **Métodos Clave:**  
   - `saveDataSession`: Guarda en sessionStorage.  
   - `loadDataSession`: Restaura datos desde sessionStorage.  
   - `totalIngreso`: Calcula ingresos totales.  
   - `totalGasto`: Calcula gastos totales.  
   - `updateListUser`: Actualiza la lista de transacciones por usuario.  
- **Flujo General:**  
   1. Crear una nueva transacción.  
   2. Almacenar en sessionStorage.  
   3. Acceder y filtrar por usuario.  
   4. Calcular totales de ingresos y gastos.  

Esta clase interactúa estrechamente con `TransactionManager` y `TransactionFilter` para manejar operaciones más complejas.
*/
