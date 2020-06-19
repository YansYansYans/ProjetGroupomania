const fileField = document.querySelector("#file")
//Crée la constante "username"
const username = document.getElementById('username')
//Crée la constante "email"
const email = document.getElementById('email')
//Crée la constante "psw"
const password = document.getElementById('psw')
const btn = document.getElementById('btn')
//Crée la constante "error-message"
const errorMessage = document.getElementById('error-message')

const url = 'http://localhost:4000/api/auth/signup'
let user = {}

//Crée la constante "regex" pour importer REGEX pour l'adresse mail
const regexEmail = /.+@.+\..+/;

//Crée la constante "isValidInput" pour vérifier que le champs est rempli
const isValidInput = (value) => value.length >= 2 ? true : false;
//Crée la constante "isValidEmail" pour vérifier que le champs renseigner est une adresse mail
const isValidEmail = (value) => value.match(regexEmail) ? true : false;
//Crée la constante "isValidPassword" pour vérifier que le champs renseigner contient plus de 7 caractères
const isValidPassword = (value) => value.length > 7

//Vérifie les champs remplits
const formValidate = () => {
    if (isValidInput(username.value)) { 
        errorMessage.textContent = ""; 
        if(isValidEmail(email.value)) {
            errorMessage.textContent = "";
            if(isValidPassword(password.value)) {
                errorMessage.textContent = "";
                return user = {
                    username: username.value,
                    email: email.value,
                    password: password.value
                }
            } else {
                errorMessage.textContent = "Le mot de passe doit contenir au moins 8 caractères !"
                password.focus();
                return false;
            }
        } else {
            errorMessage.textContent = "Veuillez renseigner une adresse mail valide !";
            email.focus();
            return false;
        }
    } else {
        errorMessage.textContent = "Veuillez remplir ce champs : Nom d'utilisateur !"
        username.focus();
        return false;
    }
}

//Envoie les données à l'API du backend
const postData = async (url, formData) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        })
        return await response.json();        
    } catch (err) {
        throw new Error(err)
    }
}

//Affiche l'image renseigné par l'utilisateur
function readUrl(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader()
        reader.addEventListener('load', (e) => {
            const img = document.querySelector('#image img')
            img.src = e.target.result
        })
        reader.readAsDataURL(input.files[0]);
    }
}
fileField.addEventListener('change', function() {
    readUrl(this)
})

//Crée un évènement pour écouter, créer un ulisateur et envoyer les données remplits dans les au champs au backend
btn.addEventListener("click", async (e) => {
    try {
        e.preventDefault()
        const validForm = formValidate();
        const formData = new FormData()
        formData.append('image', fileField.files[0])
        formData.append('user', JSON.stringify(user))         
        if (validForm !== false ) {
            const data = await postData(url, formData); 
            if ( data.error ) {
                errorMessage.textContent = data.error
                return console.error(data.error)
            }
            window.location = `login.html`;       
        }
    } catch (err) {
        throw new Error(err)
    }
})
