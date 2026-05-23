# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [https://localhost:3000](https://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Configuration OAuth2

Pour que l'authentification avec les plateformes de musique fonctionne, vous devez configurer les identifiants Client ID dans un fichier `.env` à la racine du projet.

1. Créez un fichier `.env` (si ce n'est pas déjà fait).
2. Ajoutez vos identifiants :
   ```env
   REACT_APP_SPOTIFY_CLIENT_ID=votre_client_id_spotify
   REACT_APP_YOUTUBE_CLIENT_ID=votre_client_id_youtube
   REACT_APP_REDIRECT_URI=http://127.0.0.1:3000/profile
   ```

### URIs de redirection (Redirect URIs)

Dans les consoles de Spotify et Google, vous devez configurer les URIs de redirection pour correspondre à votre environnement.

- **Développement** : `http://127.0.0.1:3000/profile` (Spotify n'accepte plus `localhost` depuis 2025 ; utiliser l'IP de loopback en HTTP est autorisé)
- **Production** : L'URL de votre application déployée suivie de `/profile` (ex: `https://votre-app.com/profile`)

Assurez-vous que la variable `REACT_APP_REDIRECT_URI` dans votre fichier `.env` correspond exactement à ce qui est configuré dans les consoles.

### YouTube / Google
- Rendez-vous sur la [Console Google Cloud](https://console.cloud.google.com/).
- Créez un projet et activez l'API **YouTube Data API v3**.
- Dans "Identifiants", créez un **ID client OAuth 2.0** de type "Application Web".
- Ajoutez `http://127.0.0.1:3000/profile` dans les **Origines JavaScript autorisées** et les **URI de redirection autorisés**.
- Pour le "dev token" (API Key) : Bien que le flux OAuth2 utilise principalement le Client ID, certaines limites de quota peuvent nécessiter une API Key. Vous pouvez en créer une dans la même section "Identifiants".

### Spotify
- Rendez-vous sur le [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
- Créez une application.
- Ajoutez `http://127.0.0.1:3000/profile` dans les **Redirect URIs** de la configuration de votre application.
- **Note :** Spotify n'accepte plus `localhost` comme redirect URI depuis 2025. L'adresse IP `127.0.0.1` en HTTP simple est explicitement autorisée par Spotify pour le développement local.
