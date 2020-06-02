//Vérification de connexion sur la page profil.html
function user() {
    let infosUser = sessionStorage.getItem('user');
    if (infosUser == undefined) {
        alert("Connectez-vous pour acceder à Groupomania !")
        document.location.href = "login.html";
    } else {
        return infosUser
    }
}

//Fonction asyncrome pour afficher le profile utilisateur
async function profil() {
    try {
        let infosUser = await user()
        response = await fetch("http://localhost:3006/api/user/profil", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infosUser
            },
            mode: 'cors',
        })
        let profil = await response.json();
        console.log(profil);
        let email = document.getElementById('email');
        email.innerHTML += profil.email;
        let username = document.getElementById('username');
        username.innerHTML += profil.username;
        let pole = document.getElementById('oldPole');
        let test = document.getElementsByTagName('option');
        for (i = 1; i < test.length; i++) {
            console.log(test[i].value)
            if (test[i].value === profil.pole) {
                test[0].value = profil.pole;
                while (test[i].firstChild) { test[i].removeChild(test[i].firstChild); }
            }
        }
        pole.innerHTML += profil.pole
    } catch (error) {
        document.location.href = "index.html";
    }
}

//Fonction asyncrome pour mettre à jour le profile utilisateur
async function update() {
    try {
        infosUser = user()
        let pole = document.getElementById("pole").value;
        let update = new Object()
        update.pole = pole;
        response = await fetch("http://localhost:3006/api/user/update", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infosUser
            },
            mode: 'cors',
            body: JSON.stringify(update),
        })

        let ok = await response.json();
        alert(ok.message);
        document.location.href = 'index.html';
    } catch (error) {
        alert('Erreur : Impossible de se modifer votre profile !')
        window.location.reload()
    }
}

//Fonction asyncrome pour supprimer le profile utilisateur
async function deleteUser() {
    infosUser = user()
    response = await fetch("http://localhost:3006/api/user/delete", {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': infosUser
        },
        mode: 'cors',
    })
    let ok = await response.json();
    alert(ok.message);
    if (response.status === 201) {
        sessionStorage.removeItem('user')
        document.location.href = 'singin.html';
    }

}

//Se déconnecter de son compte
function disconnected() {
    sessionStorage.removeItem('user')
    document.location.href = 'login.html'
    alert('Vous avez été déconnecté')
}