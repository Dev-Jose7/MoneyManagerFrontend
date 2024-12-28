// Clase que gestiona las categorías de transacciones.
export default class Category {
    // Contador para asignar un ID único a las categorías.
    static contadorId = 0; 
    
    // Almacena todas las categorías registradas, tanto predeterminadas como personalizadas.
    static _categoriesData = []; 

    // Constructor de la clase Category.
    constructor(tag = null, user = null) {
        // Si se proporcionan 'tag' y 'user', intenta crear una nueva categoría.
        if (tag && user) {
            // Verifica si la categoría ya existe para evitar duplicados.
            const exists = Category._categoriesData.find(
                category => category._tag === tag && category._user === user
            );
            
            // Si no existe, se crea una nueva categoría.
            if (!exists) {
                this._id = ++Category.contadorId; // Asigna un ID único.
                this._tag = tag; // Asigna la etiqueta de la categoría.
                this._user = user; // Asigna el ID del usuario propietario.
                Category._categoriesData.push(this); // Agrega la categoría al arreglo global.
                Category.saveDataSession(); // Guarda en sessionStorage.
            }
        } 
        // Si solo se proporciona el 'user', inicializa una lista vacía para categorías del usuario.
        else if (!tag && user) {
            this._categoriesUser = [];
        }
    }

    // Guarda las categorías en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("category", JSON.stringify(Category._categoriesData));
    }

    // Carga las categorías desde sessionStorage.
    static loadDataSession() {
        const data = JSON.parse(sessionStorage.getItem("category")) || [];
        data.forEach(category => {
            let tag = new Category(category._tag, category._user);
            tag.setId(category._id); // Restaura el ID correcto de cada categoría.
        });
    }

    // Crea las categorías predeterminadas para un usuario si no existen.
    static mainCategories(user) {
        const defaultTags = Category.defaultCategories();
        defaultTags.forEach(tag => {
            const exists = Category._categoriesData.find(category => {
                return category._tag == tag && category._user === user;
            });
            if (!exists) {
                new Category(tag, user); // Crea una nueva categoría predeterminada.
            }
        });
    }

    // Devuelve las categorías predeterminadas del sistema.
    static defaultCategories() {
        return [
            "Salario", "Arriendo", "Comisión", "Servicios", 
            "Transporte", "Alimentación", "Entretenimiento", 
            "Compras", "Varios"
        ];
    }

    // Métodos para obtener y establecer atributos de la categoría.
    getCategoriesUser() { return this._categoriesUser; } // Devuelve las categorías del usuario.
    static getCategoriesData() { return Category._categoriesData; } // Devuelve todas las categorías.
    getTag() { return this._tag; } // Devuelve la etiqueta de la categoría.
    getId() { return this._id; } // Devuelve el ID de la categoría.
    getUserId() { return this._user; } // Devuelve el ID del usuario asociado.
    setId(id) { this._id = id; } // Establece el ID de la categoría.

    // Actualiza la lista de categorías de un usuario.
    updateListUser(id) {
        this._categoriesUser = [];
        Category._categoriesData.forEach(category => {
            if (category._user == id && !this._categoriesUser.includes(category._tag)) {
                this._categoriesUser.push(category._tag); // Agrega categorías personalizadas.
            }
        });
    }

    // Imprime categorías en un contenedor HTML.
    printCategories(container, vector, pagination, counter, transaction) {
        if (pagination) {
            let elemento = `
            <div class="category list">
                <h4>${vector[counter]}</h4>
                <p>${transaction} registros</p>
                <div>
                    <i class="fas fa-edit fa-lg modificar" title="Editar"></i>
                    <i class="fas fa-trash fa-lg eliminar" title="Eliminar"></i>
                </div>
            </div>`;
            return elemento;
        } else {
            container.innerHTML = `<option disabled selected>Categoría</option>`;
            this._categoriesUser.forEach((category) => {
                container.innerHTML += `<option value="${category}">${category}</option>`;
            });
        }
    }

    // Valida si una categoría existe para un usuario.
    validateCategory(newCategory) {
        let status = false;
        this._categoriesUser.find(category => {
            if (category == newCategory) {
                status = true; // La categoría fue encontrada.
            }
        });
        return status; // Retorna el estado de validación.
    }

    // Agrega una nueva categoría para un usuario.
    addCategory(category, user) {
        new Category(category, user); // Crea y guarda una nueva categoría.
    }

    // Actualiza el nombre de una categoría existente.
    updateCategory(tagOld, tagNew, id) {
        Category._categoriesData.find(category => {
            if (category._tag == tagOld && category._user == id) {
                category._tag = tagNew; // Actualiza la etiqueta de la categoría.
            }
        });
        Category.saveDataSession();
    }

    // Elimina una categoría específica de un usuario.
    deleteCategory(tag, idUser) {
        let index = Category._categoriesData.findIndex(category => {
            return category._tag == tag && category._user == idUser;
        });

        if (index !== -1) {
            Category._categoriesData.splice(index, 1); // Elimina la categoría.
            Category.saveDataSession(); // Guarda los cambios en sessionStorage.
        }
    }
}

// Propósito:
// - Administrar las categorías de los usuarios en una aplicación de gestión financiera.  
// - Permite crear, leer, actualizar y eliminar (CRUD) categorías.  
// - Incluye categorías predeterminadas para nuevos usuarios.

// Propiedades Importantes:
// 1. contadorId: Asigna identificadores únicos a cada categoría.
// 2. _categoriesData: Almacena todas las categorías existentes.

// Flujo de Uso:
// 1. Creación de Usuario: Se inicializan categorías predeterminadas.  
// 2. Interacción del Usuario: Puede agregar, actualizar o eliminar categorías.  
// 3. Persistencia de Datos: Los cambios se guardan en sessionStorage.  
// 4. Cambio de Usuario: Las categorías específicas del usuario son cargadas correctamente.

/*  
Resumen de la Clase Category:  
- Propósito: Gestionar categorías de usuarios.  
- Datos Persistentes: Usa sessionStorage para conservar datos entre sesiones.  
- CRUD: Permite crear, leer, actualizar y eliminar categorías.  
- Personalización: Permite agregar categorías personalizadas y predeterminadas.  
- Persistencia: Los cambios se reflejan automáticamente en sessionStorage.  
*/
