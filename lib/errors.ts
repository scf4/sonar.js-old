let createError = (...errors: (string | Error | undefined)[]) => {
  let message = errors
    .map(e => e?.toString())
    .filter(e => e)
    .join('\n');
  throw new Error(message);
};

export let StateCheckError = (state: string, msg?: string) =>
  createError(`State check error: ${state}`, msg);

export let UnauthenticatedError = () => createError('Not logged in');
export let NoUserIdError = () => createError('No user ID in data store');

export let WebSocketDoesntExistError = () => createError('No WebSocket instance was created');
export let WebSocketNotOpenError = () => createError("WebSocket isn't open");
export let WebSocketDidntConnectError = () => createError('WebSocket didn\t connect');

export let LocalStateError = (msg: string, err?: Error) => createError(`Unexpected error: ${msg}`, err);

export let ClientArgMissingError = (arg: string) => createError(`Missing client args: ${arg}`);
export let CantAccessRoomError = () => createError("You don't have permission to access this room");
