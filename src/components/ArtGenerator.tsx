import React, { useState } from 'react';
import { Emotion, ArtGenerationRequest, ArtGenerationResponse } from '../types';
import { artAPI } from '../services/api';
import EmotionSelector from './EmotionSelector';

interface ArtGeneratorProps {
  onArtGenerated?: (artwork: any) => void;
}

const ArtGenerator: React.FC<ArtGeneratorProps> = ({ onArtGenerated }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [description, setDescription] = useState('');
  const [focusWord, setFocusWord] = useState('');
  const [style, setStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedArt, setGeneratedArt] = useState<any>(null);

  const handleGenerateArt = async () => {
    if (!selectedEmotion && !description.trim()) {
      setError('Please select an emotion or describe your feelings');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const requestData: ArtGenerationRequest = {
        emotion: selectedEmotion || undefined,
        description: description.trim() || undefined,
        focusWord: focusWord.trim() || undefined,
        style: style.trim() || undefined,
      };

      console.log('🎨 Generating art with data:', requestData);
      
      const response: ArtGenerationResponse = await artAPI.generateArt(requestData);
      
      if (response.success) {
        setGeneratedArt(response.data);
        onArtGenerated?.(response.data.artwork);
        
        // Reset form
        setSelectedEmotion(null);
        setDescription('');
        setFocusWord('');
        setStyle('');
      } else {
        setError(response.message || 'Failed to generate art');
      }
    } catch (err: any) {
      console.error('❌ Art generation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate art');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="art-generator">
      <div className="generator-header">
        <h2>Express & Create</h2>
        <p>Transform your emotions into beautiful therapeutic art</p>
      </div>

      <div className="generator-content">
        <EmotionSelector
          selectedEmotion={selectedEmotion}
          onEmotionSelect={setSelectedEmotion}
        />

        <div className="input-section">
          <label htmlFor="description" className="input-label">
            Or describe your feelings in detail...
          </label>
          <textarea
            id="description"
            className="description-input"
            placeholder="E.g., 'I feel like a tangled ball of yarn, stressed and overwhelmed by deadlines', or 'A quiet joy, like watching the sunrise over a calm lake'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="input-section">
          <label htmlFor="focusWord" className="input-label">
            Optional: Add a focus word or style
          </label>
          <input
            id="focusWord"
            type="text"
            className="focus-input"
            placeholder="E.g., 'Watercolor', 'Surreal', 'Forest', 'Hope'"
            value={focusWord}
            onChange={(e) => setFocusWord(e.target.value)}
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          className={`generate-button ${isGenerating ? 'generating' : ''}`}
          onClick={handleGenerateArt}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              Generating Your Art...
            </>
          ) : (
            'Generate My Art'
          )}
        </button>

        {generatedArt && (
          <div className="generated-art-preview">
            <h3>Your Generated Art</h3>
            <div className="art-preview">
              <img
                src={generatedArt.imageUrl}
                alt="Generated therapeutic art"
                className="art-image"
              />
              <div className="art-details">
                <p><strong>Prompt:</strong> {generatedArt.prompt}</p>
                {generatedArt.artwork?.metadata?.isPlaceholder && (
                  <p className="placeholder-notice">
                    <em>This is a placeholder image. Add your API keys to generate real art.</em>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtGenerator;
