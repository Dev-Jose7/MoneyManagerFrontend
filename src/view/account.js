import { menuButton, modalCancel, printCategory, printNameUser, updateListUser, user } from "../../assets/js/panel.js";
import { alertShow, completeInput, textCurrency } from "../../assets/js/util.js";

export let pageAccount = document.location.href;

document.addEventListener("DOMContentLoaded", function(){
    if(pageAccount.includes("account")){
        let tagTarget = "";
        let name = document.getElementById("name"); // Muestra el nombre del usuario.
        let email = document.getElementById("email"); // Muestra el correo del usuario.
        let password = document.getElementById("password"); // Muestra la contraseña del usuario.

        let nameUpdate = document.getElementById("nameUpdate");
        let emailUpdate = document.getElementById("emailUpdate");
        let passwordUpdate = document.getElementById("passwordUpdate");
        let passwordConfirm = document.getElementById("passwordConfirm");
        let tagInput = document.getElementById("tagInput");
        let updateTagInput = document.getElementById("updateTagInput");

        console.log(name)

        name.textContent = user.getName();
        email.textContent = user.getEmail();

        nameUpdate.placeholder = user.getName();
        emailUpdate.placeholder = user.getEmail();
        
        menuButton();
        printNameUser();
        updateListUser()
        printCategory();
        modalCancel();

        console.log(user.getCategories().getCategoriesUser());
        
        // Muestra las estadísticas de ingresos y gastos del usuario.
        document.getElementById("cantIngreso").textContent = user.getTransactions().getListIngreso().length;
        document.getElementById("cantGasto").textContent = user.getTransactions().getListGasto().length;
        document.getElementById("cantTransaccion").textContent = user.getTransactions().getListTransaction().length
        document.getElementById("totalIngreso").textContent = textCurrency(user.getTransactions().totalIngreso());
        document.getElementById("totalGasto").textContent = textCurrency(user.getTransactions().totalGasto());
        document.getElementById("saldoNeto").textContent = textCurrency(user.getTransactions().totalIngreso() - user.getTransactions().totalGasto());

        // Evento para mostrar u ocultar la contraseña.
        document.getElementById("showPassword").addEventListener("click", function(e) {
            if (e.target.textContent == "Ver contraseña") {
                console.log("bien")
                password.textContent = user.getPassword(); // Muestra la contraseña real.
                e.target.textContent = "Ocultar pass";
            } else if (e.target.textContent == "Ocultar pass") {
                password.textContent = "********"; // Oculta la contraseña.
                e.target.textContent = "Ver contraseña";
            }
        });

        // Modal para actualizar datos del usuario
        document.getElementById("updateData").addEventListener("click", function(e) {
            document.getElementById("editModal").style.display = "unset"
        });

        // Modal para añadir categoria
        document.getElementById("addCategory").addEventListener("click", function(){
            document.getElementById("addTagModal").style.display = "unset"
        });

        // Modal para actualizar o eliminar las categorias
        document.getElementById("categoria").addEventListener("click", function(e){
            if (e.target.tagName == "I") {
                let button = e.target;
                tagTarget = button.closest(".list").querySelector("h4").textContent;

                if (button.classList.contains("modificar")) {
                    console.log("Modificando", tagTarget);
                    document.getElementById("editTagModal").style.display = "unset";
                    updateTagInput.placeholder = tagTarget;
                }
            
                if (button.classList.contains("eliminar")) {
                    console.log("Eliminando", tagTarget);
                    let method = [
                        () => user.getCategories().deleteCategory(tagTarget, user.getId()), 
                        () => user.getCategories().updateListUser(user.getId()), 
                        () => printCategory()
                    ]
                    
                    alertConfirm('Eliminar', 'Categoria eliminada', 'deleteCategory', method);
                }
            }
        });

        // Actualizar el usuario
        document.getElementById("updateUser").addEventListener("click", function(e){
            e.preventDefault();
            
            let complete = false;

            if(nameUpdate.value != ""){
                user.setName(nameUpdate.value);
                alertShow("Hecho!", "Su nombre ha sido cambiado", "success");
                complete = true;
            }

            if(emailUpdate.value != ""){
                user.setEmail(emailUpdate.value);
                alertShow("Hecho!", "Su correo ha sido cambiado", "success");
                complete = true;
            }

            if(passwordUpdate.value != "" && passwordConfirm.value != ""){
                if(confirmPassword(passwordUpdate.value, passwordConfirm.value)){
                    user.setPassword(passwordConfirm.value);
                    alertShow("Hecho!", "La contraseña ha sido cambiada", "success");
                    complete = true;
                } else {
                    alertShow("Error!", "Las contraseñas no coinciden", "warning");
                    complete = false;
                }
            }
        
            if(complete){
                document.getElementById("editModal").style.display = "none";
                printDataUser();
            }
        });

        // Añadir categoria
        document.getElementById("addTag").addEventListener("click", function(e){
            e.preventDefault();
            if(completeInput([...document.getElementById("addTagModal").querySelectorAll("input")])){
                if(!user.getCategories().validateCategory(tagInput.value)){
                    user.getCategories().addCategory(tagInput.value, user.getId());
                    user.getCategories().updateListUser(user.getId());
                    printCategory();
                    alertShow("Hecho!", "La categoria ha sido añadida", "success");
                } else {
                    alertShow("Error!", "Esta categoria ya se encuentra registrada", "warning");
                }
            } else {
                alertShow("Error!", "Debes darle un nombre a la categoria", "warning");
            }
        });

        // Actualiza las categorias
        document.getElementById("updateTag").addEventListener("click", function(e){
            e.preventDefault();
            if(completeInput([...document.getElementById("editTagModal").querySelectorAll("input")])){
                    if(!user.getCategories().validateCategory(updateTagInput.value)){ //se valida que la nueva categoria no haga parte de las categorias registradas
                        user.getCategories().updateCategory(tagTarget, updateTagInput.value, user.getId()); //Se actualiza la categoria personalizada
                        alertShow("Hecho!", "Categoria actualizada", "success")
                    } else {
                        alertShow("Error!", "Esta categoria ya se encuentra registrada", "warning");
                    }
                

                user.getCategories().updateListUser(user.getId());
                console.log(user.getCategories().getCategoriesUser())
                user.getTransactions().getManager().updateTagTransaction(tagTarget, updateTagInput.value, user.getId()); //Se actualiza todas las transacciones que usarón la categoria anterior por la nueva
                printCategory();
            } else {
                alertShow("Error!", "Debes darle un nombre a la categoria", "warning");
            }
        });
    }
    
});