import { getState, updateState } from 'lib/state';

export * as actions from './websocket/actions';
export * as auth from './endpoints/login';
export * as friends from './endpoints/friends';
export * as launch from './endpoints/launch';
export * as rooms from './endpoints/rooms';
export * as profile from './endpoints/profile';
export * as users from './endpoints/users';
export * from './events';

let shutdown = () => {
  updateState(s => { s.shuttingDown = true; });
  let { ws } = getState();
  ws?.close(1001);
  ws?.terminate();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
