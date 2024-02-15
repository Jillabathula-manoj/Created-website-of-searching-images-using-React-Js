import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchImages();
   
  }, [query]); // Fetch images when the query changes

  const fetchImages = () => {
    const client_id = "rIfdjoRw4EdKQYPP6AYgj1XtQxNxyrIK3waQ9TFGdaE";
    const perPage = 10;
    const fetchUrl = `https://api.unsplash.com/search/photos?client_id=${client_id}&query=${query}&page=${page}&per_page=${perPage}`;

    axios
      .get(fetchUrl)
      .then((response) => {
        const newImages = response.data.results;

        if (page === 1) {
          setData(newImages); // Set data directly for the first page
        } else {
          setData([...data, ...newImages]); // Append new images to the existing data
        }

        setPage(page + 1); // Increment page number for next fetch
        setHasMore(newImages.length > 0); // Check if there are more images available
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchImages = (e) => {
    if (e.keyCode === 13) {
      const newQuery = e.target.value;
      setQuery(newQuery);
      setData([]); // Clear previous data
      setPage(1); // Reset page number
    }
  };

  return (
    <>
      <div className="form">
        <input type="text" className="" placeholder="Search for pics" onKeyDown={(e) => searchImages(e)} />
      </div>

      <InfiniteScroll
        dataLength={data.length}
        next={fetchImages}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="card-list">
          {data.map((imageData, key) => (
            <div className="container" key={key}>
              <img src={imageData.urls.small} className="card-image" alt={imageData.alt_description} />
              <h4>Photo by {imageData.user.name}</h4>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default App;
