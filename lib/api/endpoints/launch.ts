import * as request from 'lib/api/request';
import { SONAR_BUILD, SONAR_VERSION } from 'lib/constants';
import { StateCheckCallError } from 'lib/errors';
import { getState, updateState } from 'lib/state';
import { AssetsResponse, StateCheckResponse } from 'lib/types';

let loadAssets = async () => {
  let hash = getState().cache.assets.hash ?? '';
  let path = hash ? `/assets?hash=${hash}` : '/assets';

  let data = await request.get<AssetsResponse>(path);
  let droppables = new Map(Object.entries(data.droppables));

  updateState(state => {
    Object.assign(state.cache.assets, data, { droppables });
  });
};

let stateCheck = async () => {
  let path = `/state-check?version=${SONAR_VERSION}&build=${SONAR_BUILD}`;
  let resp = await request.get<StateCheckResponse>(path);

  if (resp.state !== 'ok') {
    throw StateCheckCallError(resp.state, resp.message);
  }
};

export { loadAssets, stateCheck };
