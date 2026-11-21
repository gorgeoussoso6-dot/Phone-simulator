export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  incoming: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'individual' | 'group';
  archived: boolean;
  sort: number;
  time: string;
  unread: boolean;
  members: string[];
  messages: Message[];
}

export interface CallEntry {
  id: string;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  title: string;
  updatedAt: string;
  tasks: Task[];
}

export interface Photo {
  id: string;
  url: string;
  path: string;
  albumId: string;
  name: string;
  addedAt: string;
}

export interface Album {
  id: string;
  name: string;
}

export interface PhoneSettings {
  battery: number;
  time: string;
  location: string;
  wallpaper: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  simulated: boolean;
}

export interface PhoneContent {
  phone: PhoneSettings;
  cameraPhrase: string;
  googleText: string;
  weather: WeatherInfo;
  whatsapp: { conversations: Conversation[] };
  calls: CallEntry[];
  notes: Note[];
  photos: Photo[];
  albums: Album[];
}

export type AdminSection =
  | 'whatsapp'
  | 'phone'
  | 'notes'
  | 'gallery'
  | 'camera'
  | 'google'
  | 'customize'
  | 'security';
