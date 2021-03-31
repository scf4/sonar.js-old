import * as request from 'lib/api/request';
import { User, UserItemsResponse, NotificationSetting } from 'lib/types';

let search = (query: string) => request.post<{ data: User[] }>('/search/users?query=' + query);

let items = (userId: number) => request.post<UserItemsResponse>('/users/items', { userId });

let mute = (userId: number) => request.post(`/mutes/${userId}`);

let unmute = (userId: number) => request.delete(`/mutes/${userId}`);

let setNotificationSetting = (userId: number, notificationSetting: NotificationSetting) =>
  request.post('/notifs/modify-user-setting', {
    userId,
    notificationSetting,
  });

let findByNames = (usernames: string[]) =>
  request.post<{ users: User[] }>('/users/search', { usernames }, 'users');

export { search, findByNames, items, mute, unmute, setNotificationSetting };
