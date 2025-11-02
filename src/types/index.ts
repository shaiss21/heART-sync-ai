// Emotion types
export type Emotion = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'confused' | 'excited';

// Art generation types
export interface ArtGenerationRequest {
  emotion?: Emotion;
  description?: string;
  focusWord?: string;
  style?: string;
}

export interface ArtGenerationResponse {
  success: boolean;
  data: {
    requestId: string;
    imageUrl: string;
    prompt: string;
    artwork: Artwork;
    status: string;
  };
  message: string;
}

// Artwork types
export interface Artwork {
  _id: string;
  imageUrl: string;
  prompt: string;
  originalPrompt?: string;
  emotion?: Emotion;
  focusWord?: string;
  style?: string;
  metadata: {
    requestId: string;
    model: string;
    size: string;
    isPlaceholder?: boolean;
  };
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Mood journal types
export interface MoodEntry {
  _id: string;
  emotion: Emotion;
  description?: string;
  intensity: number;
  notes?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface MoodJournalRequest {
  emotion: Emotion;
  description?: string;
  intensity?: number;
  notes?: string;
}

export interface MoodHistoryResponse {
  success: boolean;
  data: {
    entries: MoodEntry[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  message: string;
}

export interface MoodAnalytics {
  period: string;
  totalEntries: number;
  emotionDistribution: Record<Emotion, number>;
  averageIntensity: number;
  dailyData: {
    date: string;
    emotions: Emotion[];
    averageIntensity: number;
  }[];
}

// Gallery types
export interface GalleryResponse {
  success: boolean;
  data: {
    artworks: Artwork[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  message: string;
}

// API Response wrapper
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ArtGenerationState extends LoadingState {
  generatedArt: Artwork | null;
  isGenerating: boolean;
}

export interface GalleryState extends LoadingState {
  artworks: Artwork[];
  hasMore: boolean;
  currentPage: number;
}

export interface MoodJournalState extends LoadingState {
  entries: MoodEntry[];
  hasMore: boolean;
  currentPage: number;
  analytics: MoodAnalytics | null;
}
