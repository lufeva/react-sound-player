import axios from 'axios';

export const REQUEST_TRACKS = 'REQUEST_TRACKS';
function requestTracks() {
  return {
    type: REQUEST_TRACKS
  };
}
export const REQUEST_TRACKS_SUCCESS = 'REQUEST_TRACKS_SUCCESS';
function requestTracksSuccess(tracks) {
  return {
    type: REQUEST_TRACKS_SUCCESS,
    payload: tracks
  };
}
export const REQUEST_TRACKS_ERROR = 'REQUEST_TRACKS_ERROR';
export function requestTracksError() {
  return {
    type: REQUEST_TRACKS_ERROR
  };
}

function fetchTracks() {
  const API_URL = 'https://app.fakejson.com/q/n5L9iBZY';
  const params = {
    token: 'yRv-WBRzjF7pjdbxVnm5HA'
  };
  return dispatch => {
    dispatch(requestTracks());
    return axios
      .get(`${API_URL}`, { params })
      .then(result => dispatch(requestTracksSuccess(result.data.tracks)))
      .catch(() => {
        dispatch(requestTracksError);
      });
  };
}

export default {
  fetchTracks
};
