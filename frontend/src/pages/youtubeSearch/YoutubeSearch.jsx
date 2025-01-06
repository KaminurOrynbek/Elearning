// filepath: /Elearning/frontend/src/pages/youtubeSearch/YoutubeSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../../main';
import toast from 'react-hot-toast';

const YoutubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.get(`${server}/api/youtube/search`, {
        params: { query },
        headers: {
          token,
        },
      });
      setVideos(data.videos);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Search YouTube Videos</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for videos"
          required
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {videos.map((video) => (
          <div key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
            <p>{video.snippet.description}</p>
            <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YoutubeSearch;