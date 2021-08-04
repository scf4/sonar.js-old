export interface LaunchResponse {
  stateCheck: {
    state: 'ok' | 'block';
    message?: string;
  };
  loginInfo: {
    user: {
      id: number;
      username: string;
      color: string;
      colors: string[];
      colorValue: number;
      moderationState: 'none' | unknown;
      profileImageUrl: string | null;
      currentRoomId: number | null;
      isOnline: boolean;
      relationship: {
        friendshipStatus: string,
        isMuted: boolean;
        isBlocking: boolean;
        isBlockedBy: boolean;
        isBestFriend: boolean;
        notificationSetting: '';
      };
      displayAsBestFriend: boolean;
      lastSeenAt: number | null;
    };
    authToken?: string;
    flags: {
      isHigherAudioQualityEnabled: boolean;
      isV111AgoraChangesEnabled: boolean;
      reducedHornSpamEnabled: boolean;
    };
    referralCode: string;
  }
}

export interface AssetsResponse {
  emojiMappings: Emoji[];
  imageUrls: string[];
  soundUrls: string[];
  droppables: Record<string, Droppable>;
  strings: [];
  hash: string;
}

export type Assets = Omit<AssetsResponse, 'droppables'> & {
  droppables: Map<string, Droppable>;
};

export interface AuthVerificationResponse {
  user: AuthUser | null;
  onboardingUser: {
    onboardingStep: OnboardingStep;
    onboardingAuthToken: string;
    isWaitlisted: boolean;
  } | null;
}

enum OnboardingStep {
  VerifyInviteCode = 'verify_invite_code',
  SetUsername = 'set_username',
}

export interface Emoji {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  emojiSequence: string;
  url: string;
}

export interface AuthUser {
  id: string;
  authToken: string;
  username: string;
}

export interface ListRoomsResponse {
  rooms: {
    id: number;
    title: string;
    subtitle: string;
    colorValues?: (number | null)[];
    colors?: (string | null)[];
    isPrivate: boolean;
    isRemovable: boolean;
    roomParticipantPreviews: Array<{
      color: string;
      userId: number;
      profileImageUrl: string;
      colorValue: number;
    }>;
  }[];
}

export interface GetRoomResponse {
  creator: User | null;
  moderators: User[];
  members: User[];
  banned: any[];
  isPrivate: boolean;
  shareUrl: string;
}

export interface CreateRoomResponse {
  id: number;
  name: string;
  creatorId: number;
  isPublic?: null;
  organizationId?: unknown;
  headerImageUrl: Maybe<string>;
  isTutorialTemplate: boolean;
  isLockedDown: boolean;
  numOnlineUsers: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListFriendsResponse {
  friends: User[];
  requests: FriendRequest[];
}

export interface FriendRequest {
  id: number;
  username: string;
  color: string;
  colorValue: number;
  isOnline: boolean;
}

export interface FriendRequestResponse {
  friendshipStatus?: 'requestSent';
}

export interface Droppable {
  id: string;
  creatorId: number;
  lastActorId: number;
  orderId: 0;
  type: 'landmark' | '';
  name: string;
  position: { x: number; y: number };
  imageUrl: string;
  soundUrl: Maybe<string>;
  expiration: null;
  liftExpiration: number;
  radioStationState: unknown;
  isselfMuted: boolean;
  signText: Maybe<string>;
}

export interface User {
  id: number;
  username: string;
  color: string;
  colorValue: number;
  moderationState?: Maybe<'none' | 'moderator'>;
  profileImageUrl?: Maybe<string>;
  currentRoomId?: Maybe<number>;
  isOnline: boolean;
  relationship: UserRelationship;
}

export interface RoomUser extends User {
  role: 'member' | 'moderator' | 'creator';
  position: { x: number; y: number };
  moveId: number;
}

export interface UserRelationship {
  friendshipStatus: 'friends' | 'needsApproval' | 'notFriends' | 'requestSent';
  isMuted: boolean;
  isBlocking: boolean;
  isBlockedBy: boolean;
  notificationSetting: NotificationSetting;
}

export type NotificationSetting = 'always' | 'occasionally' | 'never';

export interface SpaceChangedData {
  data: {}; // Todo
}

export interface UserItemsResponse {
  invitation: Maybe<{
    imageUrl: string;
    title: string;
  }>;
  badges: Array<{
    imageUrl: string;
    title: string;
    description: string;
    highlightedDescriptionTerms: string[];
  }>;
  coin: Array<{
    imageUrl: string;
    title: string;
    description: string;
    highlightedDescriptionTerms: string[];
  }>;
  addSocial: Maybe<{
    imageUrl: string;
    title: 'Add Social';
    options: Array<{
      imageUrl: string;
      title: string;
      network: string;
      displayName: string;
    }>;
  }>;
  socials: Array<{
    imageUrl: string;
    title: string;
    link: string;
    network: string;
    username: string;
    options: {
      imageUrl: string;
      title: string;
      link: string;
      network: SocialNetwork;
      username: string;
    }[];
  }>;
}

export type SocialNetwork = 'instagram' | 'discord' | 'twitter' | 'snapchat' | 'tiktok';

export interface GameData {
  users: RoomUser[];
  objects: Droppable[];
}

export interface Room {
  id: number;
  name: string;
  creatorId: number;
  canModifyDroppables: boolean;
  droppablesModificationPermission: 'everyone' | 'creator_only';
  height: number;
  width: number;
  isPrivate: boolean;
}

export interface CurrentRoom extends Room {
  position: {
    x: number;
    y: number;
  };
  entities: {
    objects: Droppable[];
    users: User[];
  };
}

export interface BroadcastSpeakingData {
  type: string;
  requestId?: string | '';
  data: {
    userId: number;
    roomId: number;
    volume: number;
  };
}

export interface UserChangedData {
  users: Maybe<User[]>;
  objects: null;
}

export interface ObjectChangedData {
  users: null;
  objects: Maybe<any[]>;
}

export interface DisplayToastData {
  message: string;
  highlightedText: string[];
  userId: Maybe<number>;
  senderRoomId: Maybe<number>;
  type: 'message';
}

export interface SpaceJoinedData {
  room: Room;
  startingMoveId: number;
  isRejoin: boolean;
  gameData: GameData;
}
