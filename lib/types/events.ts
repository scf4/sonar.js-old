import { FriendRequest, CurrentRoom, User } from './sonar';

export interface GameMessageEvent {
  join_room: (room: JoinRoomPayload) => void;
  boop: (boop: BoopPayload) => void;
  friend_request: (data: FriendRequest) => void;
  user_join: (data: User) => void;
  user_leave: (data: User) => void;
  user_move: (data: User) => void;
  user_text: (data: User) => void;
  user_horn: (data: User) => void;
  user_self_mute: (data: User) => void;
  user_self_unmute: (data: User) => void;
}

export interface JoinRoomPayload extends CurrentRoom {}

export interface BoopPayload {
  roomId: number;
  roomName: string;
  username: string;
}
