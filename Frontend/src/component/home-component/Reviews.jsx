import { useState, useRef, useEffect } from 'react';
import styles from './home-style/Reviews.module.css';
import { FaStar } from 'react-icons/fa';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import video_one from './review-video/video1.mp4';
import video_two from './review-video/video2.mp4';
import thumbnail from './review-video/new_thumbnail.jpeg';

const reviews = [
  {
    name: "Priya Sharma",
    rating: 5,
    comment: "Absolutely stunning jewelry! The craftsmanship is exceptional, and the service was fantastic.",
    date: "March 15, 2024"
  },
  {
    name: "Rahul Mehta",
    rating: 5,
    comment: "Bought a beautiful silver necklace for my wife. She loved it! The quality is outstanding.",
    date: "March 10, 2024"
  },
  {
    name: "Anjali Patel",
    rating: 4,
    comment: "Great collection and competitive prices. Delivery was quick and packaging was secure.",
    date: "March 5, 2024"
  }
];

const videos = [
  {
    id: "video1",
    title: "Our Craftsmanship Process",
    url: video_one,
    thumbnail: thumbnail
  },
  {
    id: "video2",
    title: "Customer Stories",
    url: video_two,
    thumbnail: thumbnail
  }
];

export default function Reviews() {
  const [currentReview, setCurrentReview] = useState(0);
  const [activeVideo, setActiveVideo] = useState("video1"); // Set default active video to start with
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  // Initialize videos when component mounts
  useEffect(() => {
    // Set up first video to autoplay when component loads
    if (videoRefs.current[activeVideo]) {
      videoRefs.current[activeVideo].muted = isMuted;
      videoRefs.current[activeVideo].play().catch(error => {
        console.log("Autoplay prevented:", error);
      });
    }
  }, []);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const playVideo = (videoId) => {
    // If we're already playing this video, just toggle play/pause
    if (activeVideo === videoId) {
      if (videoRefs.current[videoId]?.paused) {
        videoRefs.current[videoId]?.play();
      } else {
        videoRefs.current[videoId]?.pause();
      }
      return;
    }
    
    // Otherwise, stop previous video and play new one
    if (activeVideo && videoRefs.current[activeVideo]) {
      videoRefs.current[activeVideo].pause();
      videoRefs.current[activeVideo].currentTime = 0;
    }
    
    setActiveVideo(videoId);
    
    // Allow time for the state to update and video to be visible before playing
    setTimeout(() => {
      if (videoRefs.current[videoId]) {
        videoRefs.current[videoId].muted = isMuted;
        videoRefs.current[videoId].play().catch(error => {
          console.log("Autoplay prevented:", error);
        });
      }
    }, 100);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Apply mute setting to active video
    if (activeVideo && videoRefs.current[activeVideo]) {
      videoRefs.current[activeVideo].muted = newMutedState;
    }
  };

  // Function to register video ref
  const setVideoRef = (element, id) => {
    if (element) {
      videoRefs.current[id] = element;
    }
  };

  return (
    <section className={styles.reviews}>
      <h2>Customer Reviews</h2>
      
      {/* Reviews Carousel */}
      <div className={styles.carousel}>
        <button className={`${styles.navButton} ${styles.prev}`} onClick={prevReview}>‹</button>
        
        <div className={styles.reviewCard}>
          <div className={styles.stars}>
            {[...Array(reviews[currentReview].rating)].map((_, i) => (
              <FaStar key={i} className={styles.star} />
            ))}
          </div>
          <p className={styles.comment}>{reviews[currentReview].comment}</p>
          <h3 className={styles.name}>{reviews[currentReview].name}</h3>
          <p className={styles.date}>{reviews[currentReview].date}</p>
        </div>
        
        <button className={`${styles.navButton} ${styles.next}`} onClick={nextReview}>›</button>
      </div>
      
      <div className={styles.dots}>
        {reviews.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === currentReview ? styles.active : ''}`}
            onClick={() => setCurrentReview(index)}
          />
        ))}
      </div>
      
      {/* Video Section - Always Show Videos Instead of Thumbnails */}
      <div className={styles.videoSection}>
        <h3 className={styles.videoHeading}>Watch Our Videos</h3>
        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <div key={video.id} className={styles.videoCard}>
              <div className={styles.activeVideoContainer}>
                <video 
                  ref={(el) => setVideoRef(el, video.id)}
                  className={styles.inlineVideo}
                  src={video.url}
                  muted={isMuted}
                  autoPlay={activeVideo === video.id}
                  loop
                  playsInline
                  onClick={() => playVideo(video.id)}  // Click to toggle play/pause
                >
                  Your browser does not support the video tag.
                </video>
                <div className={styles.videoControls}>
                  <button className={styles.muteButton} onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                </div>
              </div>
              <h4>{video.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}