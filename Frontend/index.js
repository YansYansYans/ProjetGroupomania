//Création des contantes
const content = document.getElementById('content');
const fileField = document.querySelector('input[type=file]')
const btn = document.getElementById('btn');
const errorMessage = document.getElementById('error-message');

//Récupération de l'API
const url = 'http://localhost:4000/post'
const token = 'Bearer ' + sessionStorage.getItem('token')

//Création des données pour créer d'une publication
const createData = async (url, formData) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': token
            },
            method: 'POST',
            body: formData
        })
        return await response.json()        
    } catch (err) {
        throw new Error(err)
    }
}

//Button pour créer une publicaation
btn.addEventListener('click', async (e) => {
    try {
        e.preventDefault();
        console.log(content.value)
        if( content.value.length > 0) {
            const formData = new FormData();
            const post = { content: content.value }
            formData.append('post', JSON.stringify(post))
            if ( fileField.files[0]) formData.append('image', fileField.files[0])   
            const data = await createData(url, formData)
            content.value = "";
            window.location.reload(true)
            return console.log(data.message)
        }   
        return errorMessage.textContent = "Ecrivez un message pour poster une publication"     
    } catch (err) {
        throw new Error(err)
    }
})

//Affichage des publications
const urlPosts = 'http://localhost:4000/posts'
const displayPosts = async () => {
    const posts = await getPosts(urlPosts);
    for( let i = posts.length -1; i >= 0; i--) {
        const {username, content, avatar, id, imageUrl} = posts[i]
        const date = posts[i].updatedAt
        const postDate = convertDate(date)
        renderPost(username, avatar, imageUrl, content, postDate, id)
    }
}

//Récupération des données des publication
const getPosts = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
        return await response.json()
    } catch (err) {
        throw new Error(err)
    }
}

//Design d'une publication
const renderPost = (username, avatar, imageUrl, postContent, postDate, postId) => {
    const section = document.getElementById('post');
    const article = document.createElement('article');
    if(imageUrl === null) {
        //Design d'une publication sans image
        article.innerHTML = `
        <div class="post">
            <div class="username"><img src="${avatar}" id="avatar"><div><p id:"name">${username}</p></div></div>
            <div class="content">
                <p>${postContent}</p>
            </div>
            <p class="date">${postDate}</p>
            <a href="post.html?${postId}"><b>Commentaires</b></a>
        </div>`        
    } else {
        //Design d'une publication avec image
        article.innerHTML = `
        <div class="post">
            <div class="username"><img src="${avatar}" id="avatar"><div><p id:"name">${username}</p></div></div>
            <div class="content">
            <img src="${imageUrl}">
                <p>${postContent}</p>
            </div>
            <p class="date">${postDate}</p>
            <a href="post.html?${postId}"><b>Commentaires</b></a>
        </div>`
    }
    section.appendChild(article)
}

//Conversion de la date en FR
const convertDate = (date) => {
    const engDate = date.split('T')[0].split('-')
    const hour = date.split('T')[1].split('.')[0]
    let frDate = []
    for( let i = engDate.length - 1 ; i >= 0; i-- ) {
        frDate.push(engDate[i])
    }
    frDate = frDate.join('-')
    const message = frDate + ', ' + hour
    return message
}

displayPosts()

