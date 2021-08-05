import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import createSagaMiddleware from "redux-saga";

import "./index.css";
import App from "./App";

import AuthContextProvider from "./context/AuthContext"

import artistReducer from "./store/reducers/artist";
import labelReducer from "./store/reducers/label";
import releaseReducer from "./store/reducers/release";
import trackReducer from "./store/reducers/track";

import { watchArtist, watchLabel, watchRelease, watchTrack } from "./store/sagas";

import reportWebVitals from './reportWebVitals';

//===============================================================================================================//

// Combine Redux Reducers into single object
const rootReducer = combineReducers({
	artist: artistReducer,
	label: labelReducer,
	release: releaseReducer,
	track: trackReducer
});

// Setup Redux Saga middleware
const sagaMiddleware = createSagaMiddleware();

// Set Redux dev tools in development mode only
const composeEnhancers =
	process.env.NODE_ENV === "development"
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		: null || compose;

// Create & configure Redux store with reducers and middleware
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
);

// Call Redux Saga middleware functions
sagaMiddleware.run(watchArtist);
sagaMiddleware.run(watchLabel);
sagaMiddleware.run(watchRelease);
sagaMiddleware.run(watchTrack);

//===============================================================================================================//

const application = (
	<Provider store={store}>
		<BrowserRouter>
			<AuthContextProvider>
				<App />
			</AuthContextProvider>
		</BrowserRouter>
	</Provider>
);

//===============================================================================================================//

ReactDOM.render(application, document.getElementById("root"));

//===============================================================================================================//

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
