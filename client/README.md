# Vinternet Music Vault Desktop (Frontend Electron/React Client)

This project is built using the [ElectronJS][electronjs] framework with the rendering aspect of framework bootstrapped by [Create React App](https://github.com/facebook/create-react-app).

The Electron application is secured with [OpenID Connect](https://auth0.com/docs/protocols/oidc) and [OAuth 2.0](https://auth0.com/docs/protocols/oauth2) protocols via the basic service provided free of charge by [Auth0][auth0].

Before you run this application locally you will need an existing auth0 account or [sign up](https://auth0.com/signup) for a new free account.

Once signed into your account [create a new application](https://manage.auth0.com/#/applications) to setup your `Domain` & `Client ID` variables and [register a demo API](https://manage.auth0.com/#/apis) to setup your API `Identifier` variable - these 3 variable values need to be added to your client `.env` file.

The application is designed to interact with the standalone server API found in the [/server](../server) directory but if desired you can spin up the frontend Electron/React client locally in your [Node][nodejs] development environment without running the backend server API alongside.

---

## Setup & Usage On Local Node Environment

### Requirements

- [NodeJS][nodejs] 12.0.0 and above
- [Yarn][yarn] (you can still use npm if you wish)
- [Auth0][auth0] (basic free account required to register application & API)

### Running Standalone Electron/React Client (Development)

1. Install dependencies by running `yarn install` from the [/client](/client) directory in the command line.
2. Create a new [application](https://manage.auth0.com/#/applications) and [register](https://manage.auth0.com/#/apis) a new demo API with your [Auth0][auth0] account.
3. In the [/client](/client) directory create your own `.env` file (see `.env.client.example` for guidance).

    - Ensure to set the `AUTH0_TENANT` variable to the `Domain` value set in your Auth0 application settings.

    - Ensure to set the `AUTH0_CLIENT_ID` variable to the `Client ID` value set in your Auth0 application settings.

    - Ensure to set the `API_IDENTIFIER` variable to the `Identifier` value set in your Auth0 API settings.

    - Ensure the `REACT_APP_SERVER_PROXY_HOST` and `REACT_APP_SERVER_PROXY_PORT` variables are set only if using the backend server API.

4. To build and initiate the frontend Electron/React client run `yarn client` from the [/client](/client) directory in the command line.
5. The application will build and render inside the native Electron application window.

[nodejs]: https://nodejs.org
[reactjs]: https://reactjs.org
[yarn]: https://yarnpkg.com
[electronjs]: https://www.electronjs.org
[auth0]: https://auth0.com
