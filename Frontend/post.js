//Receptionne les données de l'API du backend
window.addEventListener('load', async () =>{
    const postId =  window.location.search.split('?')[1];
    const urlPost = `http://localhost:4000/post/${postId}`
    const urlProfile = `http://localhost:4000/user/me`
    const urlLike = `http://localhost:4000/post/${postId}/like`
    const urlComment = `http://localhost:4000/post/${postId}/comment`
    const urlComments = `http://localhost:4000/post/${postId}/comments`
    const token = 'Bearer ' + sessionStorage.getItem('token')
    let postUserId;
    let userId;

    //Affiche le post de l'utilisateur
    const displayPost = async () => {
        try {
            //Récupère les données de l'utilisateur
            const userData = await getData(urlProfile)
            userId = userData.id;
            //Récupère les données du post de l'utilisateur
            const postData = await getData(urlPost)
            const {username, content, avatar, imageUrl } = postData
            postUserId = postData.userId
            //Récupère la date de la création du post de l'utilisateur
            const date = postData.updatedAt
            //Convertis la date en format français
            const postDate = convertDate(date)
            //Affiche le post avec le shema suivant :
            renderPost(username, avatar, imageUrl, content, postDate, postUserId, userId)
            //Récupère les données du like 
            const likeData = await getData(urlLike)
            const { userIdLiked } = likeData
            //Permet d'aimer un post 
            await isLiked(userIdLiked)           
        } catch (err) {
            throw err;
        }
    }

    //Design du post de l'utilisateur
    //Crée la constante du shéma venant du backend
    const renderPost = (username, avatar, imageUrl, postContent, postDate, postUserId, userId) => {
        const section = document.getElementById('post');
        const article = document.createElement('article');
        //Design d'un post SANS image
        if(imageUrl === null) {
            //Design d'un post selon l'utilisateur CREATEUR
            if ( postUserId === userId) { 
                article.innerHTML = `
                <div class="post">
                    <div class="username"><img src="${avatar}" id="avatar"><div><p id:"name">${username}</p></div></div>
                    <form class="content">
                        <textarea>${postContent}</textarea>
                        <button type="submit" class="validbtn" id="btn">Modifier</button>
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </form>
                    <p class="date">${postDate}</p>
                    <i class="fas fa-times"></i>
                </div>` 
            //Design d'un post selon l'utilisateur NON CREATEUR                 
            } else {
                article.innerHTML = `
                <div class="post">
                    <div class="username"><img src="${avatar}" id="avatar"><div><p id:"name">${username}</p></div></div>
                    <div class="content">
                        <p>${postContent}</p>
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </div>
                    <p class="date">${postDate}</p>
                </div>` 
            }
        //Design d'un post AVEC image
        } else {
            //Design d'un post selon l'utilisateur CREATEUR
            if (postUserId === userId) {
                article.innerHTML = `
                <div class="post">
                    <div class="username"><img src="${avatar}" id="avatar"><div><p id:"name">${username}</p></div></div>
                    <form class="content">
                        <img src="${imageUrl}">
                        <textarea>${postContent}</textarea>
                        <input type="file" name="image">
                        <button type="submit" class="validbtn" id="btn">Modifier</button>  
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </form>
                    <p class="date">${postDate}</p>
                    <i class="fas fa-times"></i>
                </div>`
            //Design d'un post selon l'utilisateur NON CREATEUR 
            } else {
                article.innerHTML = `
                <div class="post">
                    <div class="username"><img src="${avatar}" id="avatar"><div><p id:"name">${username}</p></div></div>
                    <div class="content">
                        <p>${postContent}</p>
                        <img src="${imageUrl}">
                        <div>
                            <i class="far fa-thumbs-up"></i>
                        </div>  
                    </div>
                    <p class="date">${postDate}</p>
                </div>`
            }
        }
        section.appendChild(article)
    }
    //Convertis date en format français
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
    //Récupère données du post en format JSON
    const getData = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': token
                }
            })
            return await response.json()
        } catch (err) {
            throw new Error
        }
    }
    //Envoie les données du post à l'API 
    const postData = async (url, data) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                method: 'POST',
                body: JSON.stringify(data)
            })
            return await response.json()
        } catch (err) {
            throw err;
        }
    }
    //Modifie les données du post 
    const updateFormData = async (url, formData) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': token
                },
                method: 'PUT',
                body: formData
            })
            return await response.json();   
            // return response     
        } catch (err) {
            throw new Error(err)
        }
    }
    //Supprime les données du post
    const deleteData = async (url) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                method: 'DELETE'
            })
            return await response.json()
        } catch (err) {
            throw err;
        }
    }
    //Ajoute un like au post
    const isLiked = async (userIdLiked) => {
        try {
            const like = document.querySelector('.fa-thumbs-up')
            if (userIdLiked) like.classList.add('like')
            let liked;
            like.addEventListener('click', async () => {
                if (!userIdLiked) {
                    if (!like.className.includes('like')) { 
                        like.classList.add('like')
                        liked = { like: 1}
                        const data = await postData(urlLike, liked)
                        console.log(data.message)                
                    } else {
                        like.classList.remove('like')
                        const data = await deleteData(urlLike)
                        console.log(data.message)
                    }
                } else {
                        like.classList.remove('like')
                        const data = await deleteData(urlLike)
                        console.log(data.message)
                } 
            })
        } catch (er) {
            throw err
        }
    }
    await displayPost()
    if (postUserId === userId) {

        //Affiche l'image après modification
        const fileField = document.querySelector('input[type=file]')
        const content = document.querySelector('textarea')
        const updateBtn = document.getElementById('btn')
        const deleteBtn = document.querySelector('.fa-times')
        //Affiche l'image selectionnée
        if (fileField !== null) {
            function readUrl(input) {
                if (input.files && input.files[0]) {
                    const reader = new FileReader()
                    reader.addEventListener('load', (e) => {
                        const img = document.querySelector('.content img')
                        img.src = e.target.result
                    })
                    reader.readAsDataURL(input.files[0]);
                }
            }
            fileField.addEventListener('change', function() {
                readUrl(this)
            }) 
        }
        //Modifie le post de l'utilisateur
        updateBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            let post = {
                content: content.value
            }
            const formData = new FormData()
            if (fileField !== null && fileField.files[0] ) {
                formData.append('image', fileField.files[0])
            } 
            formData.append('post', JSON.stringify(post))  
            await updateFormData(urlPost, formData)
            window.location.reload(true)
        }) 

        //Supprime le post de l'utilisateur
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await deleteData(urlPost);
            window.location = 'index.html';
        })         
    }
 
    //Design de l'onglet pour poster un commentaire à un post
    const renderCommentForm = () => {
        const section = document.getElementById('post');
        const form = document.createElement('form');
        form.setAttribute('id', 'comment');
        form.innerHTML = `
        <textarea cols="25" rows="1" placeholder="Commenter la publication..."></textarea>
        <i class="far fa-paper-plane"></i>`
        section.appendChild(form);        
    }
    //Design d'un commentaire à un post
    //Crée la constante du shéma venant du backend
    const renderComments = (avatar, username, commentDate, content) => {
        const section = document.getElementById('post')
        const div = document.createElement('div')
        div.setAttribute('class', 'comment')
        div.innerHTML += `
            <div class="co">
                <div class="username user-post coco"><img src="${avatar}" id="avatar"><p id="nameCo">${username}</p><p id="coco">${commentDate}</p></div>
                <div>
                    <p class="cococo">${content}</p>
                </div>
                <i class="fas fa-times"></i>
            </div>` 
        section.appendChild(div)
    }
    //Supprime le commentaire du post
    const deleteComment = async (url, id) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                method: 'DELETE',
                body: JSON.stringify(id)
            })
            return await response.json()
        } catch (err) {
            throw err;
        }
    }
    //Affiche les commentaires du post
    const displayComment = async () => {
        renderCommentForm()
        const btn = document.querySelector('.fa-paper-plane') 
        //Crée un nouveau commentaire
        btn.addEventListener('click', async () => { 
            const comment = document.querySelector('#comment textarea')      
            const commentContent = {
                content: comment.value
            }
            await postData(urlComment, commentContent) // 
            location.reload(true)
        })
        //Récupére les données des commentaires
        const comments = await getData(urlComments)
        for(let i = 0; i < comments.length ; i++) { 
            const { avatar, username, content } = comments[i]
            //Récupère la date du commentaire
            const date = comments[i].updatedAt
            //Convertis la date en format français
            const commentDate = convertDate(date)
            const commentId = {id: comments[i].id}
            renderComments(avatar, username, commentDate, content)
            const deleteBtn = document.querySelectorAll('.comment .fa-times')
            deleteBtn[i].addEventListener('click', async (e) => {
                e.stopPropagation()
                if (postUserId === userId) {
                    await deleteComment(urlComment, commentId)
                    location.reload(true)                    
                } else {
                    console.log('Commenaire non supprimable')
                }
            })
        }
    }
    displayComment()
})