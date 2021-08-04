import * as request from 'lib/api/request';
import { SONAR_BUILD, SONAR_VERSION } from 'lib/constants';
import { StateCheckError } from 'lib/errors';
import { getState, updateState } from 'lib/state';
import { AssetsResponse, LaunchResponse } from 'lib/types';
import { setAuthData } from '../auth';

let loadAssets = async () => {
  let hash = getState().cache.assets.hash ?? '';
  let path = hash ? `/assets?hash=${hash}` : '/assets';

  let data: AssetsResponse;

  try {
    data = await request.get<AssetsResponse>(path);
  } catch {
    return; // 304 error quick fix
  }

  let droppables = new Map(Object.entries(data.droppables));

  updateState(state => {
    Object.assign(state.cache.assets, data, { droppables });
  });
};

let launch = async () => {
  let path = `/launch?version=${SONAR_VERSION}&build=${SONAR_BUILD}`;
  let resp = await request.get<LaunchResponse>(path);

  if (resp.stateCheck.state !== 'ok') {
    throw StateCheckError(resp.stateCheck.state, resp.stateCheck.message);
  }

  let { user, authToken } = resp.loginInfo

  updateState(state => {
    state.userId ??= user.id;

    if (user.currentRoomId) {
      state.initialRoomId = user.currentRoomId;
    }
  });

  setAuthData(store => {
    store.authToken = authToken;
    store.clientName = user.username;
  });
};

export { loadAssets, launch };
