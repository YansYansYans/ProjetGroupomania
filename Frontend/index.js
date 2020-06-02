//Vérification de connexion sur la page index.html
function user() {
    let infosUser = sessionStorage.getItem('user');
    if (infosUser == undefined) {
        alert("Connectez-vous pour acceder à Groupomania !")
        document.location.href = "login.html";
    } else {
        return infosUser
    }
}

//Se déconnecter de son compte
function disconnected() {
    sessionStorage.removeItem('user')
    document.location.href = 'login.html'
    alert('Vous avez été déconnecté')
}

async function message() {
    let infosUser = await user();
    response = await fetch("http://localhost:3006/api/message/", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': infosUser
        },
        mode: 'cors',
    });
    let messages = await response.json();
    console.log(message)
    return messages;
}

message().then(function(messages) {
    for (let message of messages) {
        console.log(message)
        const parent = document.getElementById('messages');
        const parentbis = document.createElement('div');
        parent.append(parentbis);
        parentbis.id = 'div' + message.id;
        const new_child = document.getElementById('div' + message.id)
        const new_parent = document.createElement("a");
        new_child.append(new_parent);
        new_parent.addEventListener('click', function(e) {
            seeMessage()
        })
        new_parent.id = message.id;
        //Création du username
        const child = document.getElementById(message.id);
        const name = document.createElement('h3')
        child.append(name);
        name.innerHTML += message.User.username;
        //Création de l'image
        if (message.attachment != undefined) {
            const image = document.createElement('img')
            child.append(image)
            image.src = message.attachment
        }
        //Création du content
        const content = document.createElement('p');
        child.append(content);
        content.id = "content";
        content.innerHTML += message.content;
        //Création du likes
        const likes = document.createElement('p')
        new_child.append(likes);
        likes.id = message.id;
        likes.className = 'likes'
        likes.addEventListener('click', function(e) {
            likesMessage()
        })
        let likesd = message.likess;
        likesd += " J'aime"
        likes.innerHTML += likesd;
    }
})

async function postMessage() {
    let infosUser = user()
    let content = document.getElementById("content").value;
    let img = document.getElementById('img').files[0]
    let message = new Object();
    message.content = content;
    var test = new FormData()
    test.append('message', JSON.stringify(message))
    test.append('image', img)
    response = await fetch("http://localhost:3006/api/message/new", {
        method: 'POST',
        headers: {
            'Accept': 'application/json; ',
            'Authorization': infosUser
        },
        mode: 'cors',
        body: test
    })
    let post = await response.json();
    alert(post.message);
    if (response.status == 201) {
        window.location.reload()
    }
}

async function likeMessage() {
    try {
        infosUser = user()
        let data = event.currentTarget.getAttribute('id');
        let likes = new Object();
        likes.messageId = data;
        response = await fetch("http://localhost:3006/api/message/likes", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infosUser
            },
            mode: 'cors',
            body: JSON.stringify(likes),
        })
        window.location.reload()
    } catch (error) {
        alert('Erreur lors du like')
        window.location.reload()
    }
}

async function seeMessage() {
    infosUser = user()
    let data = event.currentTarget.getAttribute('id');
    sessionStorage.setItem('message', data);
    document.location.href = 'message.html'
}
