import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useLazyQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/', // Your Apollo Server URL
  cache: new InMemoryCache(),
});

const SEARCH_HOTELS = gql`
  query SearchHotels($keyword: String!) {
    searchHotels(keyword: $keyword) {
      id
      hotel_name
      city_name
      country_name
    }
  }
`;

function SearchHotels() {
  const [keyword, setKeyword] = useState('');
  const [searchHotels, { loading, data, error }] = useLazyQuery(SEARCH_HOTELS);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() !== '') {
      searchHotels({ variables: { keyword } });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hotel Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter hotel or city name..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      {data?.searchHotels?.length > 0 ? (
        <div style={{ marginTop: '2rem' }}>
          <h2>Search Results:</h2>
          <ul>
            {data.searchHotels.map((hotel) => (
              <li key={hotel.id} style={{ marginBottom: '1rem' }}>
                <strong>{hotel.hotel_name}</strong><br />
                City: {hotel.city_name} | Country: {hotel.country_name}
              </li>
            ))}
          </ul>
        </div>
      ) : data && <p style={{ marginTop: '2rem' }}>No results found.</p>}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <SearchHotels />
    </ApolloProvider>
  );
}

export default App;
