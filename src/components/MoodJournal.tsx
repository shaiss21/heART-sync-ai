import React, { useState, useEffect } from 'react';
import { Emotion, MoodEntry, MoodJournalRequest, MoodHistoryResponse, MoodAnalytics } from '../types';
import { moodAPI } from '../services/api';
import EmotionSelector from './EmotionSelector';

const MoodJournal: React.FC = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [analytics, setAnalytics] = useState<MoodAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Form state
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [description, setDescription] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadEntries = async (page = 0) => {
    try {
      setLoading(true);
      setError(null);

      const response: MoodHistoryResponse = await moodAPI.getHistory({
        limit: 20,
        offset: page * 20
      });

      if (response.success) {
        if (page === 0) {
          setEntries(response.data.entries);
        } else {
          setEntries(prev => [...prev, ...response.data.entries]);
        }
        setHasMore(response.data.hasMore);
        setCurrentPage(page);
      } else {
        setError(response.message || 'Failed to load mood entries');
      }
    } catch (err: any) {
      console.error('❌ Mood entries load error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load mood entries');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await moodAPI.getAnalytics('week');
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (err: any) {
      console.error('❌ Analytics load error:', err);
    }
  };

  useEffect(() => {
    loadEntries();
    loadAnalytics();
  }, []);

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmotion) {
      setError('Please select an emotion');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const requestData: MoodJournalRequest = {
        emotion: selectedEmotion,
        description: description.trim() || undefined,
        intensity,
        notes: notes.trim() || undefined,
      };

      const response = await moodAPI.saveEntry(requestData);
      
      if (response.success) {
        // Add new entry to the beginning of the list
        setEntries(prev => [response.data, ...prev]);
        
        // Reset form
        setSelectedEmotion(null);
        setDescription('');
        setIntensity(5);
        setNotes('');
        
        // Reload analytics
        loadAnalytics();
      } else {
        setError(response.message || 'Failed to save mood entry');
      }
    } catch (err: any) {
      console.error('❌ Mood entry save error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save mood entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadEntries(currentPage + 1);
    }
  };

  const getEmotionEmoji = (emotion: Emotion): string => {
    const emojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      calm: '🧘',
      confused: '😕',
      excited: '🤩'
    };
    return emojis[emotion];
  };

  const getIntensityColor = (intensity: number): string => {
    if (intensity <= 3) return '#4CAF50'; // Green
    if (intensity <= 6) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <div className="mood-journal">
      <div className="journal-header">
        <h2>Mood Journal</h2>
        <p>Track your emotional journey and patterns</p>
      </div>

      <div className="journal-content">
        <div className="journal-form-section">
          <h3>How are you feeling right now?</h3>
          
          <form onSubmit={handleSubmitEntry} className="mood-form">
            <EmotionSelector
              selectedEmotion={selectedEmotion}
              onEmotionSelect={setSelectedEmotion}
            />

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Describe your feelings (optional)
              </label>
              <textarea
                id="description"
                className="form-textarea"
                placeholder="What's on your mind? How are you feeling today?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="intensity" className="form-label">
                Intensity: {intensity}/10
              </label>
              <input
                id="intensity"
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="intensity-slider"
                style={{ accentColor: getIntensityColor(intensity) }}
              />
              <div className="intensity-labels">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Additional notes (optional)
              </label>
              <textarea
                id="notes"
                className="form-textarea"
                placeholder="Any additional thoughts or context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !selectedEmotion}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner small"></div>
                  Saving...
                </>
              ) : (
                'Save Mood Entry'
              )}
            </button>
          </form>
        </div>

        <div className="journal-history-section">
          <h3>Your Mood History</h3>
          
          {analytics && (
            <div className="analytics-summary">
              <div className="analytics-item">
                <span className="analytics-label">This Week:</span>
                <span className="analytics-value">{analytics.totalEntries} entries</span>
              </div>
              <div className="analytics-item">
                <span className="analytics-label">Average Intensity:</span>
                <span className="analytics-value">{analytics.averageIntensity}/10</span>
              </div>
            </div>
          )}

          {loading && entries.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your mood history...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h4>No entries yet</h4>
              <p>Start tracking your mood by creating your first entry above!</p>
            </div>
          ) : (
            <>
              <div className="entries-list">
                {entries.map((entry) => (
                  <div key={entry._id} className="mood-entry">
                    <div className="entry-header">
                      <div className="entry-emotion">
                        <span className="emotion-emoji">{getEmotionEmoji(entry.emotion)}</span>
                        <span className="emotion-name">{entry.emotion}</span>
                      </div>
                      <div className="entry-meta">
                        <span className="entry-date">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                        <span className="entry-time">
                          {new Date(entry.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="entry-content">
                      {entry.description && (
                        <p className="entry-description">{entry.description}</p>
                      )}
                      
                      <div className="entry-intensity">
                        <span className="intensity-label">Intensity:</span>
                        <div className="intensity-bar">
                          <div 
                            className="intensity-fill"
                            style={{ 
                              width: `${(entry.intensity / 10) * 100}%`,
                              backgroundColor: getIntensityColor(entry.intensity)
                            }}
                          ></div>
                        </div>
                        <span className="intensity-value">{entry.intensity}/10</span>
                      </div>
                      
                      {entry.notes && (
                        <p className="entry-notes">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="load-more-container">
                  <button
                    className="load-more-button"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="spinner small"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodJournal;
