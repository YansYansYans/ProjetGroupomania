//Vérification de connexion sur la page message.html
function user() {
    let infosUser = sessionStorage.getItem('user');
    if (infosUser == undefined) {
        alert("Connectez-vous pour acceder à Groupomania !")
        document.location.href = "login.html";
    } else {
        return infosUser
    }
}

function msgSelect() {
    let messageId = sessionStorage.getItem('message')
    if (messageId == undefined) {
        document.location.href = "index.html";
    } else {
        return messageId
    }
}

async function message() {
    try {
        let infosUser = user()
        let messageId = msgSelect()
        response = await fetch("http://localhost:3006/api/message/" + messageId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infosUser
            },
            mode: 'cors',
        })
        let message = await response.json()
        const child = document.getElementById('message')
        //Creation du username
        const name = document.createElement('h3')
        child.append(name);
        name.innerHTML += message.User.username;
        //Creation du content
        const content = document.createElement('p');
        child.append(content);
        content.id = "content";
        content.innerHTML += message.content;
        updateMsg(message)
        if (message.imageUrl != undefined) {
            //Création de l'image
            const image = document.createElement('img')
            child.append(image)
            image.src = message.imageUrl
        }
        //Création du like
        const like = document.createElement('p')
        child.append(like);
        like.id = message.id;
        like.className = 'like'
        like.addEventListener('click', function(e) {
            likeMessage()
        })
        let liked = message.likes;
        liked += " J'aime"
        like.innerHTML += liked;
    } catch (error) {
        sessionStorage.removeItem('message');
        document.location.href = "index.html";
    }
}

//Mettre à jour un message
function updateMsg(message) {
    try {
        var majBtn = document.getElementById('majAll');
        var favDialog = document.getElementById('msgDialog');
        let newContent = document.getElementById('newContent')

        newContent.value = message.content

        majBtn.addEventListener('click', function onOpen() {
            if (typeof favDialog.showModal === "function") {
                favDialog.showModal();

            } else {
                alert("Erreur d'API");
            }
        });

        favDialog.addEventListener('close', async function onClose() {
            let infosUser = user()
            let id = msgSelect()
            let update = new Object();
            update.content = newContent.value;
            console.log(update)
            response = await fetch("http://localhost:3006/api/message/update/" + id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': infosUser
                },
                mode: 'cors',
                body: JSON.stringify(update),
            })
            let answer = await response.json();
            if (response.status === 201) {
                window.location.reload()
            } else {
                alert(answer.message)
            }
        });
    } catch (error) {
        window.location.reload()
    }
}

//Supprimer un message
async function deleteMsg() {
    let infosUser = user();
    let id = msgSelect()
    response = await fetch("http://localhost:3006/api/message/delete/" + id, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': infosUser
        },
        mode: 'cors',
    })
    let post = await response.json();
    alert(post.message)
    if (response.status === 201) {
        sessionStorage.removeItem('message')
        document.location.href = 'index.html';
    } else {
        window.location.reload()
    }
}

//Liker un message
async function likeMessage() {
    try {
        infosUser = user()
        let data = event.currentTarget.getAttribute('id');
        let like = new Object();
        like.messageId = data;
        response = await fetch("http://localhost:3006/api/message/like", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': infosUser
            },
            mode: 'cors',
            body: JSON.stringify(like),
        })
        window.location.reload()
    } catch (error) {
        alert('Impossible de liker le message')
        window.location.reload()
    }
}