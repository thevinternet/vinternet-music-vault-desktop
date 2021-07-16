# Vinternet Music Vault Desktop (Standalone Server API)

## Setup & Usage On Local Node Environment

### Requirements

- [NodeJS][nodejs] 12.0.0 and above
- [Yarn][yarn] (you can still use npm if you wish)
- [MongoDB][mongodb]

### Running Standalone Server API (Development)

1. Install server dependencies by running `yarn install` from the [/server](/server) directory in the command line.
2. Navigate to the [/server](/server) directory and create your own `.env` file (see `.env.server.example` for guidance).
    > Ensure to set `MONGO_HOST_LOCATION=localhost` variable.
3. To build and initiate the backend server API run `yarn run development` from the [/server](/server) directory in the command line.
4. Use [http://localhost:8000](http://localhost:8000) to interact with the API via your chosen browser or API development platform.

[mongodb]: https://www.mongodb.com
[nodejs]: https://nodejs.org
[yarn]: https://yarnpkg.com
