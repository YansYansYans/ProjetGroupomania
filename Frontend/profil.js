//Création des contantes
const fileField = document.querySelector('input[type=file]')
const myImage = document.querySelector('#image img')
const myUsername = document.getElementById('username')
const myEmail = document.getElementById('email')
const myPassword = document.getElementById('psw')
const updateBtn = document.getElementById('updatebtn')
const deleteBtn = document.getElementById('deletebtn')

//Récupération de l'API
const token = 'Bearer ' + sessionStorage.getItem('token')
const urlMyProfile = 'http://localhost:4000/user/me'

//Récupère et affiche les données de l'API
const getProfile = async () => {
    const data = await getData(urlMyProfile);
    const { username, email } = data 
    myImage.setAttribute('src', `${data.imageUrl}`)
    myUsername.value = username 
    myEmail.value = email 
 }

//Récupère les données de l'utilisateur de l'API
const getData = async (url) => {
    const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
    }
})
    return await response.json();
}
getProfile()

//Affiche la nouvelle image si l'utilisateur la modifie
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

//Applique les modifications faites par l'utilisateur et les envoie à l'API
const updateData = async (url, formData) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': token
            },
            method: 'PUT',
            body: formData
        })
        return await response.json();      
    } catch (err) {
        throw new Error(err)
    }
}

//Crée le button "updateBtn" pour mettre à jour le profil
updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    let user = {
        username: myUsername.value,
        email: myEmail.value,
        password: myPassword.value
    }
    console.log('it works')
    const formData = new FormData()
    if (fileField.files[0]) {
        formData.append('image', fileField.files[0])
        formData.append('user', JSON.stringify(user))  
    } else {
        formData.append('user', JSON.stringify(user))  
    }
    const data = await updateData(urlMyProfile, formData)
    console.log(data.message)
})

//Supprime le compte de l'utilisateur
const deleteProfile = async (url) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    return await response.json();
}

//Crée le button "deleteBtn" pour supprimer le profil
deleteBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const data = await deleteProfile(urlMyProfile);
    sessionStorage.clear();
    window.location = "signup.html";
})
