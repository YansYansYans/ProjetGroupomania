//Importe Express (framework)
const express = require('express');
//Importe Path fournis des utilitaires pour travailler avec les chemins de fichiers et de répertoires
const path = require('path');
//Importe Cors qui fournis un middleware
const cors = require('cors');
//Importe Helmet qui définis divers en têtes HTTP pour les applications Express (Sécurité)
const helmet = require('helmet');
//Importe Xss-clean qui nettoye les entrées utilisateur provenant du corps POST, des requêtes GET et des paramètres d'URL (Sécurité)
const xss = require('xss-clean');
//Importe Express-rate-limit qui limite les demandes répétées comme la réinitialisation du mot de passe (Sécurité)
const rateLimit = require('express-rate-limit');
//Importe Hpp qui protége contre les attaques de pollution de paramètres HTTP (Sécurité)
const hpp = require('hpp');
//Importe Express dans l'app
const app = express();
//Importe dbConnection pour la connexion à la base de donnée
const { dbConnection } = require('./config/db');

//Relie les constantes à leurs routes
const userRouter = require('./routers/user')
const postRouter = require('./routers/post')
const likeRouter = require('./routers/like')
const commentRouter = require('./routers/comment')

dbConnection();

//Transforme application d'express en objet JSON utilisable
app.use(express.json());

//L'API se trouve sur le port 4000
const PORT = 4000;

//Exécution de touts les packages de sécurité importés
app.use(cors());
app.use(helmet());
app.use(xss());
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100
});
app.use(limiter);
app.use(hpp());

//Image (IMPORTANT)
app.use('/images', express.static(path.join(__dirname, 'images')));

//Exécution des app selon le shéma
app.use( userRouter )
app.use( postRouter )
app.use( likeRouter )
app.use( commentRouter )

//Message si port 4000
app.listen(PORT, () => console.log('Server is running on port ' + PORT))