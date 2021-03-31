import * as request from 'lib/api/request';
import { ListFriendsResponse, FriendRequestResponse } from 'lib/types';

let list = () => request.get<ListFriendsResponse>('/friends-list', 'friends');

let requests = () => request.get<ListFriendsResponse>('/friends-list', 'requests');

let add = (userId: number) => request.post<FriendRequestResponse>(`/friendships/${userId}/request`);

let confirm = (userId: number) => request.post(`/friendships/${userId}/confirm`);

let remove = (userId: number) => request.delete(`/friendships/${userId}`);

let boop = (userId: number) => request.post('/poke', { userId });

export { list, requests, add, confirm, remove, boop };
