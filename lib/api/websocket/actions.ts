import { getState, updateState } from 'lib/state';
import { generateUniqueSonarId } from 'utils/uid';
import { sendAction } from './send-message';

let horn = () => sendAction('horn');

let muteSelf = () => sendAction('is_self_muted_update', { isSelfMuted: true });

let unmuteSelf = () => sendAction('is_self_muted_update', { isSelfMuted: false });

let move = async (x: number, y: number) => {
  updateState(state => {
    if (!state.room) {
      return console.error("The global state object doesn't contain any room data");
    }
    state.room.position = { x, y };
  });

  let moveId = updateState(state => (state.moveId += 1)).moveId!;

  sendAction('move', { x, y, moveId });
};

let updateStatusText = (statusText: string) => sendAction('status_text_update', { statusText });

let updateColor = (color: string) => sendAction('color_update', { color });

let dropItem = (name: string, x?: number, y?: number) => {
  let { room } = getState();

  let signText: string | undefined;

  if (name.trim().startsWith('🪧')) {
    name = '🪧';
    signText = name.split('🪧')?.[1];
  }

  // Drop item at provided coordinates, user's position, or default to center
  x ??= room?.position.x ?? 0;
  y ??= room?.position.y ?? 0;

  return sendAction('drop_droppable', {
    name,
    signText,
    clientGeneratedId: generateUniqueSonarId(),
    desiredX: x!,
    desiredY: y!,
  });
};

export { horn, move, updateStatusText, updateColor, muteSelf, unmuteSelf, dropItem };
