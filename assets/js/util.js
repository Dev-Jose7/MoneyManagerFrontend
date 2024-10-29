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

export function endSession(url){
    sessionStorage.removeItem("account");

    setTimeout(() => {
        window.location.href = url;
    }, 2000);
}

export function findUser (){
    let account = JSON.parse(sessionStorage.getItem("account"));
    return User.getUserData().find(user => user._id == account._id);
}

export function checkSession(){
    if(!sessionStorage.getItem("account")){

        Swal.fire({
            customClass: {
                confirmButton: 'swalBtnColor'
            },
            title: 'Error!',
            text: 'Debes iniciar sesión para continuar',
            icon: 'warning',
            confirmButtonText: 'Ok'
        });

        document.querySelector(".swalBtnColor").addEventListener("click", function(){
            window.location.href = "./registro.html"
        });

        document.querySelector(".swal2-container").addEventListener("click", function(){
            window.location.href = "./registro.html"
        });

        window.stop();
    }
}

export function textCurrency(value) {
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

export function instanceTest(){
    let admin = new User("José", "usuario1", "1234");
    let admin1 = new User("Fernando", "usuario2", "4321");

    console.log("Desde instanceTest", Transaccion.getTransactionData())

    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 7500000, "Pago nómina", "Salario", "2024-09-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1200000, "Alquiler casa", "Arriendo", "2024-09-01");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 3500000, "Comisión de ventas", "Comisión", "2024-09-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 450000, "Servicios públicos", "Servicios", "2024-09-03");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1500000, "Renta de propiedad", "Arriendo", "2024-09-12");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 300000, "Gastos de transporte", "Transporte", "2024-09-05");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2000000, "Consultoría", "Comisión", "2024-09-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 600000, "Comida rápida", "Alimentación", "2024-09-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 800000, "Intereses de ahorros", "Varios", "2024-09-20");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 700000, "Compras de supermercado", "Compras", "2024-09-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 4000000, "Proyecto freelance", "Varios", "2024-09-25");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 900000, "Ropa de invierno", "Compras", "2024-09-18");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2200000, "Ventas en línea", "Varios", "2024-09-28");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 250000, "Cuidado personal", "Varios", "2024-09-22");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 300000, "Intereses bancarios", "Varios", "2024-09-30");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 500000, "Cenas", "Alimentación", "2024-09-29");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 600000, "Bonificación", "Salario", "2024-09-26");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 300000, "Transporte público", "Transporte", "2024-09-27");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 900000, "Consultoría adicional", "Comisión", "2024-09-24");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 400000, "Suscripción a servicios", "Varios", "2024-09-30");
    
    // Octubre 2024
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 7000000, "Pago nómina", "Salario", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1300000, "Alquiler casa", "Arriendo", "2024-10-01");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 3000000, "Comisión de ventas", "Comisión", "2024-10-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 500000, "Servicios públicos", "Servicios", "2024-10-03");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1800000, "Renta de propiedad", "Arriendo", "2024-10-12");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 250000, "Gastos de transporte", "Transporte", "2024-10-05");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2200000, "Consultoría", "Comisión", "2024-10-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 800000, "Comida rápida", "Alimentación", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 900000, "Intereses de ahorros", "Varios", "2024-10-20");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 750000, "Compras de supermercado", "Compras", "2024-10-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 5000000, "Proyecto especial", "Varios", "2024-10-22");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 950000, "Salidas con amigos", "Entretenimiento", "2024-10-12");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2700000, "Venta de productos", "Varios", "2024-10-25");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 400000, "Cuidado personal", "Varios", "2024-10-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1100000, "Bonificación por rendimiento", "Salario", "2024-10-30");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 600000, "Cenas de fin de semana", "Alimentación", "2024-10-18");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 800000, "Consultoría adicional", "Comisión", "2024-10-28");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 350000, "Eventos sociales", "Entretenimiento", "2024-10-20");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 400000, "Intereses bancarios", "Varios", "2024-10-29");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 250000, "Suscripción a plataformas", "Varios", "2024-10-31");
    
    // Noviembre 2024
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 8500000, "Pago nómina", "Salario", "2024-11-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1400000, "Alquiler casa", "Arriendo", "2024-11-01");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 4000000, "Comisión de ventas", "Comisión", "2024-11-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 600000, "Servicios públicos", "Servicios", "2024-11-03");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2000000, "Renta de propiedad", "Arriendo", "2024-11-12");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 350000, "Gastos de transporte", "Transporte", "2024-11-05");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1700000, "Consultoría", "Comisión", "2024-11-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 500000, "Comida rápida", "Alimentación", "2024-11-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1100000, "Intereses de ahorros", "Varios", "2024-11-20");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 400000, "Compras de supermercado", "Compras", "2024-11-10");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 600000, "Proyectos independientes", "Varios", "2024-11-25");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 800000, "Viaje corto", "Entretenimiento", "2024-11-15");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 900000, "Venta de artículos", "Varios", "2024-11-30");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 300000, "Salidas con amigos", "Entretenimiento", "2024-11-20");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1200000, "Trabajo freelance", "Comisión", "2024-11-28");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 450000, "Cuidado personal", "Varios", "2024-11-22");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 200000, "Intereses de ahorros", "Varios", "2024-11-29");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1500000, "Regalos", "Compras", "2024-11-25");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 1500000, "Consultoría a empresas", "Comisión", "2024-11-26");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 600000, "Comidas familiares", "Alimentación", "2024-11-27");
   

    admin.getTransactions().updateListUser(admin.getId());
    

    //Septiembre 2024
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 6000000, "Pago nómina", "Salario", "2024-09-08");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 1000000, "Alquiler departamento", "Arriendo", "2024-09-01");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 4000000, "Comisión por ventas", "Comisión", "2024-09-10");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 500000, "Servicios de internet", "Servicios", "2024-09-03");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 2500000, "Renta de local", "Arriendo", "2024-09-12");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 400000, "Transporte en taxi", "Transporte", "2024-09-05");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 1800000, "Consultoría freelance", "Comisión", "2024-09-15");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 700000, "Alimentación en restaurantes", "Alimentación", "2024-09-08");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 950000, "Intereses de ahorros", "Varios", "2024-09-20");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 800000, "Compras de supermercado", "Compras", "2024-09-10");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 3000000, "Ventas en línea", "Varios", "2024-09-25");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 900000, "Ropa de temporada", "Compras", "2024-09-18");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 400000, "Freelance proyectos", "Varios", "2024-09-28");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 600000, "Cuidado personal", "Varios", "2024-09-22");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 1200000, "Bonificación", "Salario", "2024-09-30");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 300000, "Transporte público", "Transporte", "2024-09-29");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 800000, "Consultoría adicional", "Comisión", "2024-09-24");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 500000, "Suscripción a servicios", "Varios", "2024-09-30");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 300000, "Intereses bancarios", "Varios", "2024-09-26");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 450000, "Salidas con amigos", "Entretenimiento", "2024-09-27");
    
    // Octubre 2024
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 8000000, "Pago nómina", "Salario", "2024-10-08");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 1200000, "Alquiler departamento", "Arriendo", "2024-10-01");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 3500000, "Comisión por ventas", "Comisión", "2024-10-10");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 450000, "Servicios de luz", "Servicios", "2024-10-03");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 2000000, "Renta de local", "Arriendo", "2024-10-12");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 300000, "Transporte en autobús", "Transporte", "2024-10-05");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 2500000, "Consultoría", "Comisión", "2024-10-15");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 600000, "Alimentación en restaurantes", "Alimentación", "2024-10-08");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 1500000, "Intereses de ahorros", "Varios", "2024-10-20");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 700000, "Compras de supermercado", "Compras", "2024-10-10");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 5000000, "Proyecto freelance", "Varios", "2024-10-22");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 800000, "Salidas de fin de semana", "Entretenimiento", "2024-10-12");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 3000000, "Ventas en línea", "Varios", "2024-10-25");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 400000, "Cuidado personal", "Varios", "2024-10-15");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 200000, "Bonificación", "Salario", "2024-10-30");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 300000, "Cenas de amigos", "Alimentación", "2024-10-18");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 500000, "Consultoría adicional", "Comisión", "2024-10-28");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 250000, "Eventos sociales", "Entretenimiento", "2024-10-20");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 400000, "Intereses bancarios", "Varios", "2024-10-29");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 500000, "Suscripciones mensuales", "Varios", "2024-10-31");
    
    // Noviembre 2024
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 9000000, "Pago nómina", "Salario", "2024-11-08");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 1500000, "Alquiler departamento", "Arriendo", "2024-11-01");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 4500000, "Comisión por ventas", "Comisión", "2024-11-10");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 700000, "Servicios de agua", "Servicios", "2024-11-03");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 2500000, "Renta de local", "Arriendo", "2024-11-12");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 400000, "Transporte en taxi", "Transporte", "2024-11-05");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 2000000, "Consultoría freelance", "Comisión", "2024-11-15");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 600000, "Alimentación en restaurantes", "Alimentación", "2024-11-08");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 1400000, "Intereses de ahorros", "Varios", "2024-11-20");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 300000, "Compras de supermercado", "Compras", "2024-11-10");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 600000, "Proyectos independientes", "Varios", "2024-11-25");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 900000, "Viaje corto", "Entretenimiento", "2024-11-15");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 1300000, "Venta de artículos", "Varios", "2024-11-30");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 500000, "Salidas con amigos", "Entretenimiento", "2024-11-20");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 1800000, "Consultoría a empresas", "Comisión", "2024-11-28");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 400000, "Cuidado personal", "Varios", "2024-11-22");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 250000, "Intereses de ahorros", "Varios", "2024-11-29");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 700000, "Regalos de Navidad", "Compras", "2024-11-25");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Ingreso", 2200000, "Trabajo freelance", "Comisión", "2024-11-26");
    admin1.getTransactions().getManager().createTransaction(admin1.getId(), "Gasto", 650000, "Comidas familiares", "Alimentación", "2024-11-27");


    admin1.getTransactions().updateListUser(admin1.getId());

}