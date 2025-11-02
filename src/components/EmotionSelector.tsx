import React from 'react';
import { Emotion } from '../types';

interface EmotionSelectorProps {
  selectedEmotion: Emotion | null;
  onEmotionSelect: (emotion: Emotion) => void;
}

const emotionConfig = {
  happy: {
    emoji: '😊',
    color: '#FFD700',
    label: 'Happy',
    description: 'Joyful and positive'
  },
  sad: {
    emoji: '😢',
    color: '#87CEEB',
    label: 'Sad',
    description: 'Melancholic and reflective'
  },
  angry: {
    emoji: '😠',
    color: '#FF6B6B',
    label: 'Angry',
    description: 'Frustrated and intense'
  },
  anxious: {
    emoji: '😰',
    color: '#DDA0DD',
    label: 'Anxious',
    description: 'Worried and restless'
  },
  calm: {
    emoji: '🧘',
    color: '#98FB98',
    label: 'Calm',
    description: 'Peaceful and serene'
  },
  confused: {
    emoji: '😕',
    color: '#9370DB',
    label: 'Confused',
    description: 'Uncertain and mixed'
  },
  excited: {
    emoji: '🤩',
    color: '#FFA500',
    label: 'Excited',
    description: 'Energetic and enthusiastic'
  }
};

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotion,
  onEmotionSelect
}) => {
  return (
    <div className="emotion-selector">
      <h3 className="emotion-selector-title">How are you feeling today?</h3>
      <div className="emotion-grid">
        {Object.entries(emotionConfig).map(([emotion, config]) => (
          <button
            key={emotion}
            className={`emotion-button ${selectedEmotion === emotion ? 'selected' : ''}`}
            onClick={() => onEmotionSelect(emotion as Emotion)}
            style={{
              backgroundColor: selectedEmotion === emotion ? config.color : '#f8f9fa',
              borderColor: config.color,
              transform: selectedEmotion === emotion ? 'scale(1.05)' : 'scale(1)'
            }}
            title={config.description}
          >
            <div className="emotion-emoji">{config.emoji}</div>
            <div className="emotion-label">{config.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelector;
