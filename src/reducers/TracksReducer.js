import {
  REQUEST_TRACKS,
  REQUEST_TRACKS_SUCCESS,
  REQUEST_TRACKS_ERROR
} from '../actions/TracksAction';

const initialState = {
  trackList: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_TRACKS:
      return {
        ...state,
        loading: true,
        error: false
      };
    case REQUEST_TRACKS_SUCCESS:
      return {
        ...state,
        trackList: action.payload,
        loading: false,
        error: false
      };
    case REQUEST_TRACKS_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      };
    default:
      return state;
  }
};
