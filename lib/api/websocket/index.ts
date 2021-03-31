import WebSocket from 'ws';
import { encode } from 'querystring';
import { camelizeKeysInPlace, decamelizeKeys } from 'fast-case';

import { getHeaders } from 'lib/api/request';
import { WSS_URL } from 'lib/constants';
import { updateState, getState } from 'lib/state';
import * as actions from './actions';
import { handleMessage, ReceivedMessage } from './handle-message';
import { WebSocketDidntConnectError } from 'lib/errors';
import { sleep } from 'lib/utils/sleep';

type Params = {
  roomId?: number;
  joinSilently?: boolean;
  viewportWidth?: number;
  viewportHeight?: number;
};

let createWebSocket = async (args: Params = {}, isRetry = false) => {
  args.viewportWidth ??= 35;
  args.viewportHeight ??= 35;
  args.joinSilently ??= true;

  if (getState().ws?.readyState === WebSocket.OPEN) {
    getState().ws?.close(1001);
    await sleep(750);
    getState().ws?.terminate();
  }

  let queryString = encode(decamelizeKeys(args));
  let url = WSS_URL + '/join-room?' + queryString;

  // Create websocket

  let ws: WebSocket;

  if (!isRetry) {
    ws = new WebSocket(url, { headers: getHeaders() });
  } else {
    // Retry connection if failed...
    let { retryCount } = getState();
    if (retryCount >= 3) throw WebSocketDidntConnectError();

    await sleep(retryCount * 1500);

    ws = new WebSocket(url, { headers: getHeaders() });
    updateState(state => (state.retryCount += 1));
  }

  ws.addEventListener('message', msg => {
    let data: ReceivedMessage = JSON.parse(msg.data);
    camelizeKeysInPlace(data);
    handleMessage(data);
  });

  ws.addEventListener('close', ({ wasClean, code, reason }) => {
    updateState(state => (state.wsStatus = ws.readyState));
    console.warn('Websocket closed:' + JSON.stringify({ code, reason, wasClean }));
  });

  ws.addEventListener('error', ({ error, message, type }) => {
    console.error('Websocket error: ' + JSON.stringify({ error, message, type }));
  });

  // Wait for WS connection
  await new Promise<void>(resolve => {
    ws.addEventListener('open', () => {
      console.info('Websocket connected');
      updateState(state => (state.retryCount = 0));
      updateState(state => (state.wsStatus = ws.readyState));
      ws.send('Ping');
      ws.removeEventListener('open');
      resolve();
    });

    if (ws.readyState === WebSocket.OPEN) {
      ws.emit('open');
    }
  });

  updateState(state => (state.ws = ws));

  return { actions };
};

export { createWebSocket, actions, updateState };
