# Vinternet Music Vault Desktop

An [Electron][electronjs] desktop application for managing a personal music collection (similar to that of [Discogs][discogs]). The Electron renderer process utilises the [React][reactjs] framework and uses [Redux][reduxjs] for client side state management.

The desktop application is designed to interact directly with the standalone server API found in the [/server](../server) directory which is built using [Node][nodejs], [Express][expressjs], [MongoDB][mongodb]. This standalone server API can be deployed locally or remotely with the desktop application then configured accordingly.

This project extends [Vinternet Music Vault](https://github.com/thevinternet/vinternet-music-vault) but with the additional Electron wrapper provides enhanced features such as importing tracks and user authentication alongside all the standard CRUD functionality of the base project. Development of this application is ongoing with new features and improvements being added regularly.  

---

## Setup & Usage On Local Node Environment

### Requirements

- [NodeJS][nodejs] 12.0.0 and above
- [Yarn][yarn] (you can still use npm if you wish)
- [MongoDB][mongodb]
- [Auth0][auth0] (basic free account required to register application & API)

### User Authentication Prerequisites

The Electron application is secured with [OpenID Connect](https://auth0.com/docs/protocols/oidc) and [OAuth 2.0](https://auth0.com/docs/protocols/oauth2) protocols via the basic service provided free of charge by [Auth0][auth0].

Before you run this application locally you will need an existing auth0 account or [sign up](https://auth0.com/signup) for a new free account.

Once signed into your account [create a new application](https://manage.auth0.com/#/applications) to setup your `Domain` & `Client ID` variables and [register a demo API](https://manage.auth0.com/#/apis) to setup your API `Identifier` variable - these 3 variable values need to be added to your client `.env` file.

### Running Full Application (Development)

1. Install client dependencies by running `yarn install` from the [/client](/client) directory in the command line.
2. Create a new [application](https://manage.auth0.com/#/applications) and [register](https://manage.auth0.com/#/apis) a new demo API with your [Auth0][auth0] account.
3. Navigate to the [/client](/client) directory and create your own `.env` file (see `.env.client.example` for guidance).

    - Ensure to set the `AUTH0_TENANT` variable to the `Domain` value set in your Auth0 application settings.

    - Ensure to set the `AUTH0_CLIENT_ID` variable to the `Client ID` value set in your Auth0 application settings.

    - Ensure to set the `API_IDENTIFIER` variable to the `Identifier` value set in your Auth0 API settings.

    - Ensure the `REACT_APP_SERVER_PROXY_HOST` and `REACT_APP_SERVER_PROXY_PORT` variables are set to the loaction and port you choose for standalone server API.

4. Install server dependencies by running `yarn install` from the [/server](/server) directory in the command line.
5. Ensure [MongoDB][mongodb] is either running on your operating system or setup as a hosted service in order to manage data through the API.
6. Navigate to the [/server](/server) directory and create your own `.env` file (see `.env.server.example` for guidance).

    - Ensure ALL environmental variables copied from the example are provided appropriate values in your own `.env` file.

    - Ensure the `SERVER_PORT` value matches the `REACT_APP_SERVER_PROXY_PORT` value in your client `.env` file (for successful client/server communication).

7. To build and initiate the desktop application run `yarn development` from the [/client](/client) directory in the command line.
8. The application will build and render inside the native Electron application window.

## Contributing

If you wish to submit a bug fix or feature, you can create a pull request and it will be merged pending a code review.

1. Fork the repository
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

[auth0]: https://auth0.com
[discogs]: https://www.discogs.com
[electronjs]: https://www.electronjs.org
[expressjs]: https://expressjs.com
[mongodb]: https://www.mongodb.com
[nodejs]: https://nodejs.org
[reactjs]: https://reactjs.org
[reduxjs]: https://redux.js.org
[yarn]: https://yarnpkg.com
