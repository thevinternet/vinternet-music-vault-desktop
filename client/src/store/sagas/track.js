import { put } from "redux-saga/effects";
import axios from "../../utilities/axios";

import * as actions from "../actions/index";

//===============================================================================================================//
// Fetch ALL Tracks (with Query parameters) Saga
//===============================================================================================================//

export function* fetchTracksSendSaga(action) {
  yield put(actions.trackStartLoading());
  try {
    const response = yield axios.post("/api/track", action.query);

		if (response.data.success) {
			const fetchedTracks = [];
			for (let key in response.data.success.tracks) {
				fetchedTracks.push({
					...response.data.success.tracks[key],
					id: key
				});
			}

			yield put(actions.fetchTracksSuccess(fetchedTracks, response.data.success.queryResults, response.data.success.feedback));

		} else if (response.data.error) {
			yield put(actions.trackReturnFailure(response.data.error))
		}
  } catch (error) {
    yield put(actions.trackReturnFailure(error.message));
  }
}

//===============================================================================================================//
// Fetch Single Track By ID Saga
//===============================================================================================================//

export function* fetchTrackSendSaga(action) {
  yield put(actions.trackStartLoading());
  try {
    const response = yield axios.get("/api/track/" + action.id);
    if (response.data.error) {
      yield put(actions.trackReturnFailure(response.data.error));
		}
    action.edit === true
      ? yield put(actions.editTrackClientPrep(response.data))
      : yield put(actions.fetchTrackSuccess(response.data));
  } catch (error) {
    yield put(actions.trackReturnFailure(error.message));
  }
}

//===============================================================================================================//
// Fetch Tracks By Artist Saga
//===============================================================================================================//

export function* fetchTracksByArtistSendSaga(action) {
  yield put(actions.trackStartLoading());
  try {
    const response = yield axios.get("/api/track/artist/" + action.id);
    const fetchedTracks = [];
    for (let key in response.data) {
      fetchedTracks.push({
        ...response.data[key],
        id: key
      });
    }
    response.data.error
      ? yield put(actions.trackReturnFailure(response.data.error))
      : yield put(actions.fetchTracksByArtistSuccess(fetchedTracks));
  } catch (error) {
    yield put(actions.trackReturnFailure(error.message));
  }
}
  
//===============================================================================================================//
// Fetch Tracks By Label Saga
//===============================================================================================================//

export function* fetchTracksByLabelSendSaga(action) {
  yield put(actions.trackStartLoading());
  try {
    const response = yield axios.get("/api/track/label/" + action.id);
    const fetchedTracks = [];
    for (let key in response.data) {
      fetchedTracks.push({
        ...response.data[key],
        id: key
      });
    }
    response.data.error
      ? yield put(actions.trackReturnFailure(response.data.error))
      : yield put(actions.fetchTracksByLabelSuccess(fetchedTracks));
  } catch (error) {
    yield put(actions.trackReturnFailure(error.message));
  }
}

//===============================================================================================================//
// Fetch Tracks By Release Saga
//===============================================================================================================//

export function* fetchTracksByReleaseSendSaga(action) {
  yield put(actions.trackStartLoading());
  try {
    const response = yield axios.get("/api/track/release/" + action.id);
    const fetchedTracks = [];
    for (let key in response.data) {
      fetchedTracks.push({
        ...response.data[key],
        id: key
      });
		}
		
    if (response.data.error) {
      yield put(actions.trackReturnFailure(response.data.error));
		}
    action.edit === true
      ? yield put(actions.editTrackClientPrep(response.data))
      : yield put(actions.fetchTracksByReleaseSuccess(fetchedTracks));
  } catch (error) {
    yield put(actions.trackReturnFailure(error.message));
  }
}

//===============================================================================================================//
