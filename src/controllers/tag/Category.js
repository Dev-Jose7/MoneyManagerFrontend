// Clase que gestiona las categorías de transacciones.
export default class Category {
    static contadorId = 0; //Sirve para asignar id a las instancias
    static _categoriesData = []; // Almacena todas las categorías.

    // Constructor de la clase Category.
    constructor(tag = null, user = null) {
        if (tag && user) { // Si se instancian con un tag y un usuario, se crea una categoría.
            this._id = ++Category.contadorId; //Crea id a la transacción de acuerdo al orden en el que se vayan creando
            this._tag = tag; // Asigna la etiqueta de la categoría.
            this._user = user; // Asigna el usuario al que pertenece la categoría.
            Category._categoriesData.push(this); // Agrega la categoría a la lista.
            Category.saveDataSession(); // Guarda la categoría en sessionStorage.
        } else if(!tag && user){
            this._categoriesUser = [];
            // if(!sessionStorage.getItem("database")){
                Category.mainCategories(user);
            // }
        }
    }

    // Método estático para guardar las categorías en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("category", JSON.stringify(Category._categoriesData));
    }

    // Método estático para cargar las categorías desde sessionStorage.
    static loadDataSession() {
        Category._categoriesData = []; // Reinicia la lista de categorías.
        try {
            let tag = JSON.parse(sessionStorage.getItem("category")); // Parsea las categorías almacenadas.
            for (let i = 0; i < tag.length; i++) {
                new Category(tag[i]._tag, tag[i]._user); // Crea instancias de categorías.
            }
        } catch (error) {
            // Manejo del error si las categorías no pueden ser cargadas.
        }
    }

    // Métodos para obtener los atributos de la categoría.
    getCategoriesUser() { return this._categoriesUser; }
    getCategoriesData() { return Category._categoriesData };
    getTag() { return this._tag; }
    getId() { return this._id; }
    getUserId() { return this._user; }

    // Método estático para devolver las categorías predeterminadas.
    static defaultCategories() {
        return ["Salario", "Arriendo", "Comisión", "Servicios", "Transporte", "Alimentación", "Entretenimiento", "Compras", "Varios"];
    }

    static mainCategories(user){
        new Category("Salario", user);
        new Category("Arriendo", user);
        new Category("Comisión", user);
        new Category("Servicios", user);
        new Category("Transporte", user);
        new Category("Alimentación", user);
        new Category("Entretenimiento", user);
        new Category("Compras", user);
        new Category("Varios", user);
    }

    // Método para actualizar la lista de categorías del usuario.
    updateListUser(id) {
        this._categoriesUser = [];
        Category._categoriesData.forEach(category => {
            
            if (category._user == id && !this._categoriesUser.includes(category._tag)) {
                this._categoriesUser.push(category._tag); // Agrega categorías personalizadas.
            }
        });
    }

    // Método para imprimir categorías en un elemento select.
    printCategories(container, vector, pagination, counter, transaction) {
        if(pagination){
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

    // Método para validar si una categoría existe.
    validateCategory(newCategory) {
        let status = false;
        this._categoriesUser.find(category => {
            if (category == newCategory) {
                status = true; // La categoría fue encontrada.
            }
        });
        return status; // Retorna el estado de validación.
    }

    // Método para agregar una nueva categoría.
    addCategory(category, user) {
        new Category(category, user); // Crea una nueva categoría.
    }

    // Método para actualizar una categoría existente.
    updateCategory(tagOld, tagNew, id) {
        Category._categoriesData.find(category => {
            if (category._tag == tagOld && category._user == id) {
                category._tag = tagNew; // Actualiza la etiqueta de la categoría.
            }
        });

        Category.saveDataSession();
    }

    // Método para eliminar una categoría.
    deleteCategory(tag, idUser) {
        let index = Category._categoriesData.findIndex(category => {
            return category._tag == tag && category._user == idUser; // Busca el índice de la categoría.
        });

        Category._categoriesData.splice(index, 1); // Elimina la categoría del arreglo.
        Category.saveDataSession(); // Guarda los cambios en sessionStorage.
    }
}
