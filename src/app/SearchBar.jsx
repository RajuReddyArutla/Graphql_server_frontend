"use client";
import { useState } from "react";
import { useQuery, gql } from "@apollo/client";

const SEARCH_HOTELS = gql`
  query SearchHotels($cityName: String!) {
    searchHotels(cityName: $cityName) {
      id
      hotelName
      address
      cityName
      countryName
    }
  }
`;

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);

  const { loading, error, data } = useQuery(SEARCH_HOTELS, {
    variables: { cityName: searchTerm },
    skip: !triggerSearch,
  });

  const handleSearch = () => {
    setTriggerSearch(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Hotels by City</h2>
      <input
        type="text"
        placeholder="Enter city name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setTriggerSearch(false);
        }}
        style={{ padding: "8px", marginRight: "8px" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
        Search
      </button>

      <div style={{ marginTop: "20px" }}>
        {loading && <p>Loading hotels...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && data.searchHotels.length > 0 ? (
          <ul>
            {data.searchHotels.map((hotel) => (
              <li key={hotel.id}>
                <strong>{hotel.hotelName}</strong> - {hotel.address} ({hotel.cityName}, {hotel.countryName})
              </li>
            ))}
          </ul>
        ) : (
          triggerSearch && <p>No hotels found.</p>
        )}
      </div>
    </div>
  );
}
