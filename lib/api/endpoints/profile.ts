import * as request from 'lib/api/request';
import { SocialNetwork } from 'lib/types';

let addPhoto = (image: any) => request.post('/profile/upload', image, 2);

let addSocial = (network: SocialNetwork, username: string) => request.post('/socials', { network, username }, 2);

let editSocial = (network: SocialNetwork, username: string) => request.post('/socials', { network, username }, 2);

let removeSocial = (network: SocialNetwork) => request.delete('/socials', { network }, 2);

export { addPhoto, addSocial, editSocial, removeSocial };
