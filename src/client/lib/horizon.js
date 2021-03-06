import Horizon from '@horizon/client';
import { API_BASE, COLLECTIONS } from '../constants';

export const hz = Horizon({ authType: 'anonymous', host: API_BASE, secure: true });
export const hzRooms = hz(COLLECTIONS.ROOMS);
export const hzUsers = hz(COLLECTIONS.USERS);
