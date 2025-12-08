import { useState, useRef } from 'react';
import { Camera, X, Upload, Loader } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

/**
 * ImageUpload Component
 * Reusable component for uploading profile/group pictures
 * 
 * @param {string} type - 'profile' or 'group'
 * @param {string} id - User ID or Group ID
 * @param {string} currentImage - Current image URL
 * @param {function} onUploadSuccess - Callback after successful upload
 * @param {string} size - 'sm', 'md', 'lg' (default: 'md')
 */
export default function ImageUpload({ 
  type = 'profile', 
  id, 
  currentImage, 
  onUploadSuccess,
  size = 'md',
  placeholder = null 
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Size configurations
  const sizes = {
    sm: { container: 60, icon: 24 },
    md: { container: 100, icon: 36 },
    lg: { container: 150, icon: 48 }
  };
  
  const sizeConfig = sizes[size] || sizes.md;

  // Get the full image URL
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) {
      // Remove /api from API_URL if present
      const baseUrl = API_URL.replace('/api', '');
      return `${baseUrl}${url}`;
    }
    return url;
  };

  const displayImage = preview || getImageUrl(currentImage);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('roomier_token');
      
      const response = await fetch(`${API_URL}/uploads/${type}/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Clear preview and call success callback
      setPreview(null);
      onUploadSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentImage) return;
    
    if (!window.confirm('Remove this picture?')) return;

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('roomier_token');
      
      const response = await fetch(`${API_URL}/uploads/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove image');
      }

      onUploadSuccess?.(data);
    } catch (err) {
      setError(err.message || 'Failed to remove image');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      {/* Image Container */}
      <div
        onClick={triggerFileSelect}
        style={{
          position: 'relative',
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: type === 'profile' ? '50%' : 16,
          overflow: 'hidden',
          cursor: 'pointer',
          background: displayImage ? 'transparent' : 'var(--indigo-50)',
          border: '3px solid var(--ring)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        {/* Current/Preview Image */}
        {displayImage ? (
          <img
            src={displayImage}
            alt={type === 'profile' ? 'Profile' : 'Group'}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          /* Placeholder Icon */
          placeholder || <Camera size={sizeConfig.icon} color="var(--indigo-600)" />
        )}

        {/* Uploading Overlay */}
        {uploading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Loader size={24} color="white" className="spin" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Hover Overlay */}
        {!uploading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
          >
            <Upload size={sizeConfig.icon * 0.6} color="white" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={triggerFileSelect}
          disabled={uploading}
          style={{ padding: '6px 12px', height: 'auto', fontSize: 12 }}
        >
          <Camera size={14} /> Change
        </button>
        
        {currentImage && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleRemove}
            disabled={uploading}
            style={{ 
              padding: '6px 12px', 
              height: 'auto', 
              fontSize: 12,
              color: 'var(--rose-600)'
            }}
          >
            <X size={14} /> Remove
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          fontSize: 12,
          color: 'var(--rose-600)',
          textAlign: 'center',
          padding: '4px 8px',
          background: 'var(--rose-50)',
          borderRadius: 4
        }}>
          {error}
        </div>
      )}

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
