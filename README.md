# Projet Cinémathèque

Cette cinémathèque répond à la demande de la Cinémathèque Française. Le but de cet organisme est de recenser, de conserver et de restaurer des archives cinématographiques. Le Président souhaite mettre à disposition du grand public un listing de 2383 films restaurés.

## Lancer le projet localement

### 1. fichier **`.env`**

Pour mettre en place le projet, vous aurez besoin de placer vos identifiants importants dans des variables d'environnement, par exemple vos identifiants de connexion à votre base de données MongoDB.

Pour cela, vous avez deux chois :

- Copier le fichier d'exemple [`.env.example`](https://github.com/christianbiango/projet-cinematheque/blob/main/backend/.env.example) puis remplacer tous les champs par leur véritable valeur et ensuite renommer le fichier `.env`
- Créer vous-même un fichier `.env` et écrire les variables d'environnement

Il y a 2 types de variables d'environnement retrouvables dans le fichier [`.env.example`](https://github.com/christianbiango/projet-cinematheque/blob/main/backend/.env.example) :

- VE liées au port.

  > Exemple : PORT=`Le port sur lequel le serveur écoutera`

- VE liées à la base de données et ses collections.

  > Exemple : MONGO_DB_NAME=`Nom de la base de données MongoDB`

## Liste des bibliothèques utilisés

Ils seront installés automatiquement en exécutant la commande `npm i package.json` dans votre terminal. Vous devrez être placé dans le dossier backend du projet, puis recommencer pour installer les dépendances du dossier frontend.

En effet, les dépendances sont listées ici à des fins de documentation

| <center>Node</center>           |
| ------------------------------- |
| bcrypt 5.1.1                    |
| cors 2.8.5                      |
| dotenv 16.4.5                   |
| express 4.19.2                  |
| jsonwebtoken 9.0.2              |
| mongoose 8.2.4                  |
| mongoose-unique-validator 5.0.0 |
| nodemon 3.1.0                   |
| serialize 0.1.3                 |
| xlsx 0.18.5                     |
| fs 0.0.1-security               |

## Questions ou Problèmes

- Si vous avez des questions sur la cinémathèque, vous pouvez me contacter directement sur GitHub.
- Si vous rencontrez des problèmes, vous pouvez les renseigner [ici](https://github.com/christianbiango/projet-cinematheque/issues)

## Version des technologies

Développé en :

- [node 20.11.1](https://nodejs.org/en/blog/release/v20.11.1)
