// Clase que representa a un usuario en la aplicación.
import Transaccion from "../operation/Transaccion.js";
import Category from "../tag/Category.js";

export default class User {
    // Almacena los datos de todos los usuarios.
    static _userData = [];
    
    // Contador para asignar un ID único a cada usuario.
    static counterUser = 0;

    // Constructor de la clase User.
    constructor(name, email, password) {
        this._id = ++User.counterUser; // Asigna un ID único al usuario.
        this._name = name; // Almacena el nombre del usuario.
        this._email = email; // Almacena el correo electrónico del usuario.
        this._password = password; // Almacena la contraseña del usuario.
        this._transactions = new Transaccion(); // Inicializa una instancia para transacciones.
        this._categories = new Category(null, this._id); // Inicializa una instancia para categorías.

        // Genera categorías predeterminadas si es un nuevo usuario.
        this.generateCategory();

        User._userData.push(this); // Agrega el nuevo usuario al arreglo global.
        User.saveDataSession(); // Guarda los datos en sessionStorage.
    }

    // Métodos para obtener los atributos del usuario.
    getId() { return this._id; } // Devuelve el ID del usuario.
    getName() { return this._name; } // Devuelve el nombre del usuario.
    getEmail() { return this._email; } // Devuelve el correo del usuario.
    getPassword() { return this._password; } // Devuelve la contraseña del usuario.
    getTransactions() { return this._transactions; } // Devuelve las transacciones del usuario.
    getCategories() { return this._categories; } // Devuelve las categorías del usuario.

    // Método estático para obtener todos los usuarios registrados.
    static getUserData() { return User._userData; }

    // Métodos para establecer los atributos del usuario.
    setId(id) { this._id = id; User.saveDataSession(); } // Actualiza el ID del usuario.
    setName(name) { this._name = name; User.saveDataSession(); } // Actualiza el nombre.
    setEmail(email) { this._email = email; User.saveDataSession(); } // Actualiza el correo.
    setPassword(password) { this._password = password; User.saveDataSession(); } // Actualiza la contraseña.

    // Método para generar categorías predeterminadas para el usuario.
    generateCategory() {
        // Carga las categorías existentes para evitar duplicados.
        Category.loadDataSession();

        // Filtra las categorías pertenecientes a este usuario.
        const userCategories = Category._categoriesData.filter(
            category => category.getUserId() === this.getId()
        );

        // Si no existen categorías para este usuario, se crean las predeterminadas.
        if (userCategories.length === 0) {
            Category.mainCategories(this.getId());
        }
    }

    // Guarda la lista de usuarios en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("database", JSON.stringify(User._userData));
    }

    // Carga la lista de usuarios desde sessionStorage.
    static loadDataSession() {
        let data = JSON.parse(sessionStorage.getItem("database")) || [];
        User._userData = []; // Limpia el arreglo antes de cargar los nuevos datos.

        data.forEach(user => {
            const newUser = new User(user._name, user._email, user._password);
            newUser.setId(user._id);
        });
    }

    // Valida las credenciales de un usuario.
    static validateUser(email, password) {
        return User._userData.find(
            user => user._email === email && user._password === password
        ) || false;
    }

    // Imprime los datos de todos los usuarios en consola (para depuración).
    static printUserData() {
        console.log(User._userData);
    }

    // Calcula el balance de las transacciones del usuario.
    getBalance(transacciones) {
        let contador = 0; // Inicializa el contador.
        transacciones.forEach(objeto => {
            contador += +objeto._valor; // Suma los valores de las transacciones.
        });
        return contador;
    }
}

// Propósito:
// - Gestionar los datos de los usuarios en la aplicación.  
// - Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en los usuarios.  
// - Maneja las transacciones y categorías de cada usuario de forma independiente.  
// - Garantiza la persistencia de los datos a través de sessionStorage.

// Propiedades Importantes:
// 1. _userData: Almacena la lista global de usuarios registrados.  
// 2. counterUser: Asigna identificadores únicos a cada usuario.  
// 3. Persistencia: Usa sessionStorage para conservar datos entre sesiones.

// Flujo de Uso:
// 1. Crear un Usuario: Se inicializan sus transacciones y categorías predeterminadas.  
// 2. Interacción del Usuario: Se gestionan transacciones y categorías individualmente.  
// 3. Persistencia de Datos: Los cambios se guardan automáticamente en sessionStorage.  
// 4. Validación de Credenciales: Permite el acceso solo a usuarios válidos.

/*
Resumen de la Clase User:  
- **Propósito:** Gestionar los datos individuales de cada usuario, incluyendo sus transacciones y categorías.  
- **Persistencia:** Usa sessionStorage para conservar los datos entre sesiones.  
- **Métodos Principales:**  
   - `generateCategory`: Asegura que cada usuario tenga categorías predeterminadas.  
   - `validateUser`: Permite validar credenciales de acceso.  
   - `saveDataSession`: Guarda datos en sessionStorage.  
   - `loadDataSession`: Restaura los datos desde sessionStorage.  
- **Flujo de Uso:**  
   1. Se crea un nuevo usuario.  
   2. Se inicializan sus transacciones y categorías.  
   3. Los cambios se guardan automáticamente en sessionStorage.  
   4. Se validan las credenciales al iniciar sesión.  

Esta clase interactúa estrechamente con las clases `Category` y `Transaccion`, garantizando que cada usuario tenga sus propias categorías y transacciones independientes.  
*/
