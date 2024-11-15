import User from "../../src/controllers/account/User.js";
import Transaccion from "../../src/controllers/operation/Transaccion.js";

// Función para verificar si todos los campos de un array tienen algún valor.
// Si hay campos vacíos, se resalta el borde con color rojo y se restaura después de 3 segundos.
export function completeInput(array){
    let counter = 0; // Contador de campos vacíos
    for (let i = 0; i < array.length; i++) {
        if(array[i].value == ""){
            counter++; // Se incrementa el contador si el campo está vacío
            array[i].style.borderColor = "red"; // Resalta el borde del campo vacío

            // Restaura el estilo del borde después de 3 segundos
            setTimeout(() => {
                array[i].style.borderStyle = "solid";
                array[i].style.borderColor = "unset"; // Se remueve el borde rojo
            }, 3000);
        }
    }

    // Si no hay campos vacíos, retorna true; de lo contrario, retorna false
    return counter == 0;
}

// Función para confirmar si dos contraseñas coinciden
export function confirmPassword(password, passwordConfirm){
    // Compara las contraseñas y devuelve true si son iguales, de lo contrario false
    return password == passwordConfirm;
}

// Función para iniciar sesión y almacenar la información del usuario en sessionStorage
export function initSession(account){
    if(account){
        sessionStorage.setItem("account", JSON.stringify(account)); // Almacena el usuario en sessionStorage como JSON
        
        // Después de 2 segundos, redirige al usuario a la página del dashboard
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);
        return true;
    } else {
        return false;
    }
}

// Función para cerrar la sesión del usuario
export function endSession(url){
    // Elimina la información del usuario y bienvenida del sessionStorage
    sessionStorage.removeItem("account");
    sessionStorage.removeItem("welcome");

    // Redirige a la URL especificada después de un tiempo de espera
    setTimeout(() => {
        window.location.href = url;
    }, 2000); // 2 segundos
}

// Función para obtener el usuario de sessionStorage y buscar sus datos
export function findUser (){
    let account = JSON.parse(sessionStorage.getItem("account")); // Obtiene los datos del usuario almacenados en sessionStorage
    return User.getUserData().find(user => user._id == account._id); // Busca al usuario correspondiente
}

// Función que verifica si la sesión está activa
export function checkSession(){
    if(!sessionStorage.getItem("account")){
        alertShow("Error!", "Debes iniciar sesión para continuar", "warning"); // Muestra una alerta si no hay sesión activa

        // Redirige al registro después de 5 segundos
        setTimeout(() => {
            window.location.href = "./registro.html";
        }, 5000);

        // Maneja el evento click en los botones de la alerta para redirigir al registro
        document.querySelector(".swalBtnColor").addEventListener("click", function(){
            window.location.href = "./registro.html";
        });

        document.querySelector(".swal2-container").addEventListener("click", function(){
            window.location.href = "./registro.html";
        });

        window.stop(); // Detiene la ejecución de la página
    }
}

// Función para formatear un valor como moneda en COP (pesos colombianos)
export function textCurrency(value) {
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

// Función para mostrar una alerta con un mensaje específico
export function alertShow(heading, message, type){
    Swal.fire({
        customClass: {
            confirmButton: 'swalBtnColor'
        },
        title: heading, // Título de la alerta
        text: message, // Mensaje de la alerta
        icon: type, // Tipo de alerta (ej. 'warning', 'success')
        confirmButtonText: 'Ok', // Texto del botón de confirmación
        timer: 5000 // Duración de la alerta (5 segundos)
    });
}

// Función para cerrar una animación de carga y eliminar el elemento del DOM
export function closeloading(){
        const loading = document.getElementById("loading"); // Obtiene el elemento de carga
        loading.classList.add("effectLoading"); // Aplica una clase de animación

        // Elimina el elemento de carga después de que la transición finalice
        loading.addEventListener('transitionend', function() {
            loading.remove(); // Elimina completamente el elemento del DOM
        }, { once: true }); // Solo se ejecuta una vez

        document.querySelector("body").style.overflow = "unset"; // Permite hacer scroll nuevamente
}

// Función de prueba para instanciar usuarios y generar transacciones
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

//1. Validación de Formularios
//completeInput(array): Verifica si todos los campos de un formulario están completos. Si hay campos vacíos, resalta el borde de esos campos en rojo y luego lo restaura después de 3 segundos.
//confirmPassword(password, passwordConfirm): Verifica si las contraseñas introducidas coinciden. Devuelve true si son iguales, y false en caso contrario.

//2. Gestión de Sesiones
//initSession(account): Inicia sesión y almacena los datos de la cuenta del usuario en sessionStorage. Luego, redirige al usuario al dashboard después de 2 segundos.
//endSession(url): Cierra la sesión eliminando la información de la cuenta del sessionStorage y redirige a una URL específica después de 2 segundos.
//findUser(): Obtiene el usuario desde el sessionStorage y busca sus datos en una base de datos simulada (probablemente un array de usuarios).
//checkSession(): Verifica si hay una sesión activa en sessionStorage. Si no es así, muestra una alerta y redirige al usuario a la página de registro después de 5 segundos.

//3. Manejo de Alertas y Mensajes
//alertShow(heading, message, type): Muestra una alerta personalizada utilizando la librería Swal (SweetAlert2). Permite personalizar el título, el mensaje y el tipo de alerta (ej. éxito, advertencia).
//textCurrency(value): Formatea un número como una cantidad monetaria en pesos colombianos (COP).

//4. Interacción con Elementos del DOM
//closeloading(): Cierra una animación de carga (spinner) y elimina el elemento del DOM después de una animación.

//5. Instanciación de Datos de Prueba
//instanceTest(): Crea dos usuarios (admin y admin1) con múltiples transacciones de prueba (ingresos y gastos) para simular datos de operaciones financieras. Estas transacciones se agregan a los usuarios a lo largo de varios meses (septiembre, octubre y noviembre de 2024).

//6. Transacciones Financieras
//A través de las instancias de los usuarios (admin y admin1), se crean varias transacciones que incluyen ingresos (por salarios, comisiones, ventas, etc.) y gastos (como alquileres, servicios públicos, compras, transporte, etc.).
//Las transacciones son gestionadas mediante un objeto Transaccion y almacenadas para cada usuario.

//El script maneja una serie de funcionalidades típicas en un sistema web de gestión de cuentas o 
//usuarios. Incluye validaciones de formularios, manejo de sesiones, alertas, formato de moneda y 
//la generación de datos de prueba (transacciones financieras) para simular un sistema de finanzas. 
//Además, implementa interacciones con el DOM para mostrar mensajes y cerrar animaciones de carga, 
//todo ello en un contexto donde se requiere autenticar usuarios y registrar operaciones financieras de forma segura.