# Vinternet Music Vault Desktop (Standalone Server API)

## Setup & Usage On Local Node Environment

### Requirements

- [NodeJS][nodejs] 12.0.0 and above
- [Yarn][yarn] (you can still use npm if you wish)
- [MongoDB][mongodb]

### Running Standalone Server API (Development)

1. Install server dependencies by running `yarn install` from the [/server](/server) directory in the command line.
2. Ensure [MongoDB][mongodb] is either running on your operating system or setup as a hosted service in order to manage data through the API.
3. Navigate to the [/server](/server) directory and create your own `.env` file (see `.env.server.example` for guidance).

    - Ensure ALL environmental variables copied from the example are provided appropriate values in your own `.env` file.

4. Build and initiate the backend server API by running `yarn run development` from the [/server](/server) directory in the command line.
5. Use [http://localhost:8000](http://localhost:8000) to interact with the API via your chosen browser or API development platform.

[mongodb]: https://www.mongodb.com
[nodejs]: https://nodejs.org
[yarn]: https://yarnpkg.com
