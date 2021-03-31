import type WebSocket from 'ws';
import { Assets, CurrentRoom } from 'lib/types';

interface State {
  userId: number;

  ws: Maybe<WebSocket>;
  wsStatus: number;
  retryCount: number;
  shuttingDown: boolean;

  initialRoomId?: number;
  room?: CurrentRoom;
  moveId: number;

  friends: Set<number>;
  friendRequests: Set<number>;
  rooms: Set<number>;

  cache: {
    assets: Assets;
    users: Map<number, any>;
    rooms: Map<number, any>;
  };
}

let globalState = {
  ws: null,
  wsStatus: 0,
  retryCount: 0,
  shuttingDown: false,

  friends: new Set(),
  friendRequests: new Set(),
  rooms: new Set(),

  cache: {
    assets: {},
    users: new Map(),
    rooms: new Map(),
  },
} as State;

let getState = () => globalState as Readonly<State>;

let updateState = (callback: (state: State) => void) => {
  callback(globalState);
  return globalState as Readonly<State>;
};

export { getState, updateState };
