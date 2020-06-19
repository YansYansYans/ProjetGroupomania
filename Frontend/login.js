//Création des constantes
const email = document.getElementById('email')
const password = document.getElementById('psw')
const errorMessage = document.getElementById('error-message')
const btn = document.getElementById('btn')

//Récupération de l'API
const url = 'http://localhost:4000/api/auth/login'

//Envoie les données à l'API du backend
const postData = async (url, dataElt) => {
    const response = await fetch(url, {
        headers: {
            'Content-Type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(dataElt)
    })
    return await response.json();
}

//Crée un évènement pour écouter puis envoyer les données remplits dans les au champs au backend 
btn.addEventListener("click", async (e) => {
    e.preventDefault(); 
    const login = {
        email: email.value,
        password: password.value
    }
        const data = await postData(url, login);
        if ( data.error ) {
            errorMessage.textContent = data.error;
            return console.error(data.error)
        }
        sessionStorage.setItem('status', ('connected')) ; 
        sessionStorage.setItem('token', `${data.token}`) 
        window.location = `index.html`;
})
if( sessionStorage.getItem('status') && window.location.href.includes('login.html')) {
    window.location.replace('index.html')  
}