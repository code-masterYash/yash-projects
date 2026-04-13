
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  image?: string; // Base64 URL for displaying the user-uploaded image
}

export interface MoodEntry {
  mood: 'Happy' | 'Neutral' | 'Sad' | 'Angry' | 'Anxious';
  timestamp: string;
}
