# Vinternet Music Vault Desktop (Frontend React Client)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and is designed to run alongside the backend server API all contained within an [NodeJS][nodejs] based [Electron][electron] container.

If you wish, you can spin up the frontend [React][reactjs] client locally in your [Node][nodejs] development environment.

---

## Setup & Usage On Local Node Environment

### Requirements

- [NodeJS][nodejs] 12.0.0 and above
- [Yarn][yarn] (you can still use npm if you wish)

### Running Standalone React Client (Development)

1. Install dependencies by running `yarn install` from the [/client](/client) directory in the command line.
2. In the [/client](/client) directory create your own `.env` file (see `.env.client.example` for guidance).
    > Ensure to set `REACT_APP_SERVER_PROXY_HOST=http://localhost` variable.
3. To build and initiate the frontend React client run `yarn start` from the [/client](/client) directory in the command line.
4. Browse to [http://localhost:3000](http://localhost:3000) to view application in your chosen browser.

[nodejs]: https://nodejs.org
[reactjs]: https://reactjs.org
[yarn]: https://yarnpkg.com
[electron]: https://www.electronjs.org
