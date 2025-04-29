import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useLazyQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
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

const SEARCH_CITIES = gql`
  query SearchCities($keyword: String!) {
    searchCities(keyword: $keyword) {
      id
      name
    }
  }
`;

function SearchHotels() {
  const [keyword, setKeyword] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHotels, { loading, data, error }] = useLazyQuery(SEARCH_HOTELS);
  const [getCities, { data: cityData }] = useLazyQuery(SEARCH_CITIES);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() !== '') {
      searchHotels({ variables: { keyword } });
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (value.length >= 2) {
      getCities({ variables: { keyword: value } });
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleCityClick = (cityName) => {
    setKeyword(cityName);
    setShowSuggestions(false);
  };

  const suggestions = cityData?.searchCities || [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hotel Search</h1>
      <form onSubmit={handleSearch} style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Enter hotel or city name..."
          value={keyword}
          onChange={handleInputChange}
          style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Search
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            top: '2.5rem',
            left: 0,
            width: '300px',
            background: '#fff',
            border: '1px solid #ccc',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            zIndex: 10,
            maxHeight: '150px',
            overflowY: 'auto'
          }}>
            {suggestions.map(city => (
              <li
                key={city.id}
                onClick={() => handleCityClick(city.name)}
                style={{ padding: '0.5rem', cursor: 'pointer' }}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
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
