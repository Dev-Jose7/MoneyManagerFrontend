import User from "../../src/controllers/account/User.js";
import Transaccion from "../../src/controllers/operation/Transaccion.js";

export function completeInput(array){
    let counter = 0;
    for (let i = 0; i < array.length; i++) {
        if(array[i].value == ""){
            counter++;
            array[i].style.borderColor = "red";

            setTimeout(() => {
                array[i].style.borderStyle = "solid";
                array[i].style.borderColor = "unset";
            }, 3000);
        }
    }

    if(counter == 0){
        return true;
    } else {
        return false;
    }
}

export function confirmPassword(password, passwordConfirm){
    if(password == passwordConfirm){
        return true;
    } else {
        return false;
    }
}

export function initSession(account){
    if(account){
        sessionStorage.setItem("account", JSON.stringify(account)); //Se almacena el usuario a través de sessionStorage en formato JSON para leerlo más adelante.
        //Guarda la instancia en la API despues de autenticar  al usuario (confirmar si las credenciales indicadas por el cliente corresponden a un usuario almacenado en la base de datos), para ello se debe de crear una especie de variable/atributo (setItem) en la API y darle valor.
        //session y local solo almacena datos en formato de texto (String), para ello se usa el objeto global JSON, el cual sirve para el intercambio de datos entre las partes que necesiten almacenar y/o leer datos (cliente/servidor), JSON es un formato de texto que representa estructuras de datos y objetos de manera que pueden ser fácilmente leídos y entendidos.
        //JSON al ser un formato de texto se vuelve compatible para almacenar colecciones de datos en la APIs sessionStorage y localStorage, y como este formato se encuentra siendo manipulado en el objeto global JSON debemos hacer uso de este para acceder a métodos encargados de convertir los objetos en formato JSON (stringify) y transformarlos a su estado original (parse)
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 2000);
        return true;
    } else {
        return false
    }
}

export function endSession(){
    sessionStorage.removeItem("account");

    setTimeout(() => {
        window.location.href = "login.html"
    }, 2000);
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

export function findUser (){
    let account = JSON.parse(sessionStorage.getItem("account"));
    return User.getUserData().find(user => user._id == account._id);
}

export function instanceTest(){
    let admin = new User("José", "jfnr398", "1234");
    let admin1 = new User("Fernando", "fercho398", "4321");

    console.log("Desde instanceTest", Transaccion.getTransactionData())

    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 6500, "Pago nomina", "Salario", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1400, "Alquiler casa", "Arriendo", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2150, "Comision trabajo", "Comisión", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 450, "Factura hogar", "Servicios", "2024-10-08");

    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 3200, "Venta producto", "Ingreso por ventas", "2024-10-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 600, "Compra materiales", "Materiales", "2024-10-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1800, "Consultoría", "Honorarios", "2024-10-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 300, "Suscripción software", "Suscripciones", "2024-10-15");

    // Octubre
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 4000, "Venta online", "Comercio electrónico", "2024-10-20");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 700, "Publicidad", "Marketing", "2024-10-20");

    // Noviembre
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 5500, "Proyecto freelance", "Proyectos", "2024-11-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1200, "Equipo nuevo", "Inversiones", "2024-11-10");

    // Diciembre
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2800, "Servicios de diseño", "Servicios", "2024-12-05");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 900, "Viaje de negocios", "Viajes", "2024-12-05");

    // Enero
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 3500, "Consultoría empresarial", "Consultoría", "2025-01-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 500, "Material de oficina", "Operaciones", "2025-01-15");

    // Febrero
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 4200, "Mantenimiento software", "Mantenimiento", "2025-02-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1100, "Capacitación", "Formación", "2025-02-10");

    admin.getTransactions().updateListUser(admin.getId());



    // Marzo
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 5000, "Venta de productos", "E-commerce", "2025-03-12");
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 800, "Publicidad en redes", "Marketing", "2025-03-12");

    // Abril
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 3900, "Servicio de consultoría", "Consultoría", "2025-04-22");
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 650, "Mantenimiento equipo", "Mantenimiento", "2025-04-22");

    // Mayo
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 7200, "Proyecto de desarrollo", "Desarrollo", "2025-05-15");
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1000, "Software de gestión", "Herramientas", "2025-05-15");

    // Junio
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 4300, "Comisión ventas", "Ventas", "2025-06-10");
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1200, "Gastos de viaje", "Viajes", "2025-06-10");

    // Julio
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 5600, "Taller de capacitación", "Capacitación", "2025-07-05");
    admin1.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 400, "Material de curso", "Formación", "2025-07-05");

    admin1.getTransactions().updateListUser(admin.getId());

}