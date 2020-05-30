//Supprime le storage à l'arrivé sur la page login.html
function clear() {
    sessionStorage.clear();
}

//Créer un compte
async function singin() {
    let name1 = document.getElementById("name1").value;
    let name2 = document.getElementById("name2").value;
    let pole = document.getElementById("pole").value;
    let email = document.getElementById("email").value;
    let mdp = document.getElementById("mdp").value;
    if (name1 == 0 || name2 == 0 || pole === "none" || email == 0 || mdp == 0) {
        alert("Merci de remplir tous les champs !");
    } else {
        let infosUser = new Object();
        infosUser.name1 = name1;
        infosUser.name2 = name2;
        infosUser.pole = pole;
        infosUser.email = email;
        infosUser.mdp = mdp;
        response = await fetch("http://localhost:3006/api/user/signup", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(infosUser),
        });
        let product = await response.json();
        alert(product.message);
        if (response.status === 201 || response.status === 409) {
            document.location.href = 'login.html';
        }
    }
}

//Se connecter
async function login() {
    sessionStorage.clear();
    let email = document.getElementById("email").value;
    let mdp = document.getElementById("mdp").value;
    if (email == 0 || mdp == 0) {
        alert("Merci de remplir tous les champs !");
    } else {
        let connexion = new Object();
        connexion.email = email;
        connexion.mdp = mdp;
        response = await fetch("http://localhost:3006/api/user/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json; ',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(connexion)
        });
        let signin = await response.json();
        alert(signin.message);
        if (response.status === 200) {
            sessionStorage.setItem('user', signin.token);
            document.location.href = 'index.html';
        } else {
            if (response.status === 401) {
                document.location.href = 'singin.html';
            }
        }
    }
}