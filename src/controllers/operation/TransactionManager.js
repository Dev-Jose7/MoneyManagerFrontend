import Transaccion from "./Transaccion.js";

// Clase que gestiona las transacciones.
export default class TransactionManager {

    // Método para crear una nueva transacción.
    createTransaction(user, tipo, valor, descripcion, categoria, fecha) {
        new Transaccion(user, tipo, valor, descripcion, categoria, fecha); // Crea una nueva transacción.
        console.log("Base de datos: ", Transaccion.getTransactionData()); // Muestra las transacciones almacenadas.
    }

    // Método para imprimir transacciones en el contenedor y modo indicado.
    printTransaction(container, vector, pagination, counter) {
        // Agrega cada transacción al contenedor de acuerdo a la cantidad de transacciones que se desean imprimir.
        if(pagination){
            let elemento = `
            <div class="transaccion list" data-tipo="${vector[counter]._tipo}" data-id="${vector[counter]._id}">
            ${container.id == "campoTransacciones" ? `<h4>${vector[counter]._tipo}</h4>` : ""}
                <h4 class="titleCategory" title="${vector[counter]._categoria}">${vector[counter]._categoria}</h4>
                <p class="titleValue">${vector[counter]._valor}</p>
                <p class="titleDate">${vector[counter]._fecha}</p>
                <div>
                ${vector[counter].getDescription() != "" ? `<i class="fas fa-sticky-note fa-lg nota" title="Descripción"></i>` : ""}
                    <i class="fas fa-edit fa-lg modificar" title="Editar"></i>
                    <i class="fas fa-trash fa-lg eliminar" title="Eliminar"></i>
                </div>
            </div>`;
            return elemento;
        } 
        
        if(!pagination){
            container.innerHTML = "";
            for (let i = 0; i < vector.length; i++) {
                let elemento = `
                    <div class="transaccion" data-tipo="${vector[i]._tipo}" data-id="${vector[i]._id}">
                    ${container.id == "campoTransacciones" ? `<h4>${vector[i]._tipo}</h4>` : ""}
                        <h4 class="titleCategory" title="${vector[i]._categoria}">${vector[i]._categoria}</h4>
                        <p class="titleValue">${vector[i]._valor}</p>
                        <p class="titleDate">${vector[i]._fecha}</p>
                        <div>
                            <i class="fas fa-sticky-note fa-lg nota" title="Descripción"></i>
                            <i class="fas fa-edit fa-lg modificar" title="Editar"></i>
                            <i class="fas fa-trash fa-lg eliminar" title="Eliminar"></i>
                        </div>
                    </div>`;
                container.innerHTML += elemento;
            }
        }
    }

    // Método para eliminar una transacción.
    deleteTransaction(id, transaction) {
        transaction.remove(); // Elimina el elemento del DOM.
        let indice = Transaccion.getTransactionData().findIndex(transaccion => transaccion._id == id); // Busca el índice de la transacción.

        if (indice !== -1) {
            Transaccion.getTransactionData().splice(indice, 1); // Elimina la transacción del arreglo.
            console.log("Eliminada");
        }

        Transaccion.saveDataSession(); // Guarda los cambios en la sesión.
    }

    // Método para actualizar una transacción existente.
    updateTransaction(id) {
        let targetTransaction = Transaccion.getTransactionData().find(transaction => transaction._id == id);
        // Actualiza los valores de la transacción existente en el arreglo.
        targetTransaction._tipo = tipo.value;
        targetTransaction._valor = +valor.value;
        targetTransaction._descripcion = descripcion.value;
        targetTransaction._fecha = fecha.value;
        targetTransaction._categoria = categoria.value;

        console.log(tipo.value, +valor.value, descripcion.value, fecha.value, categoria.value)
        
        console.log(Transaccion.getTransactionData())
        Transaccion.saveDataSession();
    }

    //Método que se utiliza para actualizar una categoria que fue modificada de la lista de categorias a todas las transacciones que la usan
    updateTagTransaction(oldTag, newTag, user){
        Transaccion.getTransactionData().forEach((transaction, index) => {
            if(transaction._user == user && transaction._categoria == oldTag){
                transaction._categoria = newTag;
            }
        });

        Transaccion.saveDataSession();
    }
}
