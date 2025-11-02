import React, { useState, useEffect } from 'react';
import { Artwork, GalleryResponse } from '../types';
import { galleryAPI } from '../services/api';

const Gallery: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');

  const loadArtworks = async (page = 0, emotion?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response: GalleryResponse = await galleryAPI.getGallery({
        limit: 12,
        offset: page * 12,
        emotion: emotion || undefined
      });

      if (response.success) {
        if (page === 0) {
          setArtworks(response.data.artworks);
        } else {
          setArtworks(prev => [...prev, ...response.data.artworks]);
        }
        setHasMore(response.data.hasMore);
        setCurrentPage(page);
      } else {
        setError(response.message || 'Failed to load gallery');
      }
    } catch (err: any) {
      console.error('❌ Gallery load error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtworks(0, selectedEmotion);
  }, [selectedEmotion]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadArtworks(currentPage + 1, selectedEmotion);
    }
  };

  const handleDeleteArtwork = async (artworkId: string) => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) {
      return;
    }

    try {
      const response = await galleryAPI.deleteArtwork(artworkId);
      if (response.success) {
        setArtworks(prev => prev.filter(art => art._id !== artworkId));
      } else {
        setError(response.message || 'Failed to delete artwork');
      }
    } catch (err: any) {
      console.error('❌ Delete error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete artwork');
    }
  };

  const handleToggleFavorite = async (artworkId: string) => {
    try {
      const response = await galleryAPI.toggleFavorite(artworkId);
      if (response.success) {
        setArtworks(prev => 
          prev.map(art => 
            art._id === artworkId 
              ? { ...art, isFavorite: !art.isFavorite }
              : art
          )
        );
      }
    } catch (err: any) {
      console.error('❌ Toggle favorite error:', err);
    }
  };

  const emotionOptions = [
    { value: '', label: 'All Emotions' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'angry', label: 'Angry' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'calm', label: 'Calm' },
    { value: 'confused', label: 'Confused' },
    { value: 'excited', label: 'Excited' }
  ];

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h2>Your Art Gallery</h2>
        <p>Explore your collection of therapeutic artwork</p>
        
        <div className="gallery-filters">
          <select
            value={selectedEmotion}
            onChange={(e) => setSelectedEmotion(e.target.value)}
            className="emotion-filter"
          >
            {emotionOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && artworks.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your gallery...</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎨</div>
          <h3>No artwork yet</h3>
          <p>Start creating by generating your first piece of therapeutic art!</p>
        </div>
      ) : (
        <>
          <div className="artwork-grid">
            {artworks.map((artwork) => (
              <div key={artwork._id} className="artwork-card">
                <div className="artwork-image-container">
                  <img
                    src={artwork.imageUrl}
                    alt="Generated therapeutic art"
                    className="artwork-image"
                  />
                  <div className="artwork-actions">
                    <button
                      className={`favorite-button ${artwork.isFavorite ? 'favorited' : ''}`}
                      onClick={() => handleToggleFavorite(artwork._id)}
                      title={artwork.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {artwork.isFavorite ? '❤️' : '🤍'}
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteArtwork(artwork._id)}
                      title="Delete artwork"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="artwork-details">
                  <div className="artwork-emotion">
                    {artwork.emotion && (
                      <span className={`emotion-badge emotion-${artwork.emotion}`}>
                        {artwork.emotion}
                      </span>
                    )}
                  </div>
                  <p className="artwork-prompt">{artwork.prompt}</p>
                  <div className="artwork-meta">
                    <span className="artwork-date">
                      {new Date(artwork.createdAt).toLocaleDateString()}
                    </span>
                    {artwork.metadata?.isPlaceholder && (
                      <span className="placeholder-badge">Placeholder</span>
                    )}
                  </div>
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
  );
};

export default Gallery;
