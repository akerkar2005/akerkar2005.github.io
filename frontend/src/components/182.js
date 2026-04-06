import React, { useEffect, useState, useRef } from 'react';
import './182.css';
import useFontSizeSetter from './fontSizeSetter.js';
import StickyHeader from './StickyHeader.js';
import TermHeader from './TerminalHeader.js';

// Parse the txt file into an array of [number, caption] tuples
function parseImageData(txt) {
  // Debug: log the raw text
  console.log('Parsing images.txt:', txt);
  return txt
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line)
    .map((line, idx) => {
      // Debug: log each line being parsed
      console.log('Parsing line:', line);
      const [url, caption] = line.split('|');
      return [url, caption || `Image ${idx + 1}`];
    });
}

function CoolGalleryTitle({ count }) {
  const total = 182;
  const percent = Math.min(100, Math.round((count / total) * 100));
  let barColor;
  if (percent >= 90) {
    barColor = 'gallery-progress-green';
  } else if (percent >= 50) {
    barColor = 'gallery-progress-yellow';
  } else {
    barColor = 'gallery-progress-red';
  }
  return (
    <div className="gallery-title-wrapper">
      <h1 className="gallery-title">
        182 Picture Gallery
      </h1>
      <div className="gallery-progress-bar-bg">
        <div className={`gallery-progress-bar ${barColor}`} style={{ width: `${percent}%` }} />
        <span className="gallery-progress-label">
          {percent}% complete
        </span>
      </div>
    </div>
  );
}

function ImageGallery({ images }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  // Persist photoIndex in localStorage
  const [photoIndex, setPhotoIndex] = useState(() => {
    const saved = localStorage.getItem('gallery_photo_index');
    return saved ? Number(saved) : 0;
  });
  const modalRef = useRef(null);

  // Save photoIndex to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gallery_photo_index', photoIndex);
  }, [photoIndex]);

  // Cache all images as blobs after authentication
  const [imageCache, setImageCache] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('jwt_182');
    if (!images.length || !token) return;

    let active = true;
    const fetchAllImages = async () => {
      const cache = {};
      await Promise.all(images.map(async ([url], idx) => {
        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const blob = await res.blob();
            cache[idx] = URL.createObjectURL(blob);
          } else {
            cache[idx] = null;
          }
        } catch {
          cache[idx] = null;
        }
      }));
      if (active) setImageCache(cache);
    };

    fetchAllImages();

    // Cleanup object URLs on unmount or images change
    return () => {
      active = false;
      Object.values(imageCache).forEach(src => src && URL.revokeObjectURL(src));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  // Focus the modal for keyboard navigation when opened
  useEffect(() => {
    if (viewerOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [viewerOpen]);

  // Only render a button to open the viewer, not the full gallery grid
  return (
    <div className="gallery-container">
      <button
        className="gallery-open-btn"
        onMouseEnter={e => {
          e.currentTarget.classList.add('gallery-open-btn-hover');
        }}
        onMouseLeave={e => {
          e.currentTarget.classList.remove('gallery-open-btn-hover');
        }}
        onClick={() => {
          setViewerOpen(true);
          document.body.style.overflow = 'hidden';
        }}
      >
        Open 182 Picture Gallery Viewer
      </button>
      {viewerOpen && images.length > 0 && (
        <div
          className="gallery-fallback-modal"
          ref={modalRef}
          tabIndex={0}
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              setViewerOpen(false);
              document.body.style.overflow = '';
            }
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft') {
              setPhotoIndex(prev => (prev - 1 + images.length) % images.length);
            } else if (e.key === 'ArrowRight') {
              setPhotoIndex(prev => (prev + 1) % images.length);
            } else if (e.key === 'Escape') {
              setViewerOpen(false);
              document.body.style.overflow = '';
            }
          }}
        >
          {/* Left arrow */}
          <button
            className="gallery-arrow gallery-arrow-left"
            onClick={e => {
              e.stopPropagation();
              setPhotoIndex((photoIndex - 1 + images.length) % images.length);
            }}
            aria-label="Previous image"
          >&lt;</button>
          {/* Image centered */}
          <div
            className="gallery-modal-center"
            onMouseDown={e => e.stopPropagation()}
            tabIndex={-1}
          >
            <img
              src={imageCache[photoIndex] || ''}
              alt={images[photoIndex][1] || `Gallery ${photoIndex + 1}`}
              className="gallery-modal-img"
            />
            <div className="gallery-modal-caption">
              {images[photoIndex][1]}
            </div>
            <div className="gallery-modal-progress">
              {photoIndex + 1} / {images.length} images in gallery
            </div>
            <div className="gallery-modal-close-btn-wrapper">
                <button
                    className="gallery-modal-close-btn"
                    onClick={e => {
                      e.stopPropagation();
                      setViewerOpen(false);
                      document.body.style.overflow = '';
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.classList.add('gallery-modal-close-btn-hover');
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.classList.remove('gallery-modal-close-btn-hover');
                    }}
                >Close</button>
            </div>
          </div>
          {/* Right arrow */}
          <button
            className="gallery-arrow gallery-arrow-right"
            onClick={e => {
              e.stopPropagation();
              setPhotoIndex((photoIndex + 1) % images.length);
            }}
            aria-label="Next image"
          >&gt;</button>
        </div>
      )}
    </div>
  );
}

function Page182({ disableAnimations, setDisableAnimations }) {
  const [images, setImages] = useState([]);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const bodyRef = useRef(null);
  const title = "182 Picture Gallery";

  useFontSizeSetter();

  // Check for token in localStorage on mount for persistence
  useEffect(() => {
    const token = localStorage.getItem('jwt_182');
    if (token) {
      setIsAuthenticated(true);
      // Optionally: verify token with backend here
    }
  }, []);

  // Fetch images.txt from Cloudflare R2 Worker instead of local public folder
  useEffect(() => {
    if (isAuthenticated) {
      fetch(
        'https://gentle-resonance-4e17.arthoooo1337.workers.dev/images.txt',
        {
          mode: 'cors'
        }
      )
        .then(res => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.text();
        })
        .then(txt => {
          console.log('Raw images.txt:', txt); // Debug: log raw text
          const parsed = parseImageData(txt);
          console.log('Parsed images:', parsed); // Debug: log parsed array
          setImages(parsed);
        })
        .catch(err => {
          console.error('Failed to fetch images.txt:', err);
        });
    }
  }, [isAuthenticated]);

  // Handle password submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('https://a-182-passman-e03b83850f96.herokuapp.com/api/auth182', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      let data;
      try {
        data = await res.json();
      } catch (err) {
        // If response is not JSON, fallback to text
        const text = await res.text();
        setAuthError('Server error: ' + text);
        return;
      }
      console.log('Auth response:', data); // Debug log

      if (res.ok && data.token) {
        localStorage.setItem('jwt_182', data.token); // Store JWT
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setAuthError('Network/server error');
    }
  };

  // Always show password form first
  if (!isAuthenticated) {
    return (
      <div className="main-page-wrapper">
        <TermHeader headerTitle={title} />
        <div className="background-with-content">
          <StickyHeader
            bodyRef={bodyRef}
            setIsComplete={() => {}}
            disableAnimations={disableAnimations}
            setDisableAnimations={setDisableAnimations}
          />
          <div className="gallery-content-custom" style={{ maxWidth: 400, margin: '0 auto', paddingTop: 150 }}>
            <h2 style={{ color: '#fff', marginBottom: 24 }}>Enter Password to Access Gallery</h2>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                style={{ padding: 12, fontSize: 18, borderRadius: 8, border: '1px solid #888' }}
                required
              />
              <button type="submit" style={{ padding: 12, fontSize: 18, borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 700 }}>
                Unlock Gallery
              </button>
              {authError && <div style={{ color: '#da1075', fontWeight: 600 }}>{authError}</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-page-wrapper">
      <TermHeader headerTitle={title} />
      <div ref={bodyRef} className="background-with-content">
        <StickyHeader
          bodyRef={bodyRef}
          setIsComplete={() => {}}
          disableAnimations={disableAnimations}
          setDisableAnimations={setDisableAnimations}
        />
        <div className="gallery-content-custom">
          <CoolGalleryTitle count={images.length} />
          <ImageGallery images={images} />
          <p className="paragraph">The 182 Project has been digitized and is now available for viewing.<br />Feel free to search for your entry and explore the collection.</p>
        </div>
      </div>
    </div>
  );
}

export default Page182;