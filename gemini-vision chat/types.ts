
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export type ImagePart = {
    type: 'image';
    mimeType: string;
    data: string; // Base64 encoded string for preview
};

export type TextPart = {
    type: 'text';
    text: string;
};

export type MessagePart = ImagePart | TextPart;

export interface ChatMessage {
  role: Role;
  parts: MessagePart[];
}
