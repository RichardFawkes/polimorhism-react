import "./styles/global.css";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [results, setResults] = useState([]);

  const handleSearch = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?q=${debouncedSearchTerm}`
      );
      setResults(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <div className="w-full fixed top-0 bg-white z-10">
        <h1 className="text-4xl font-bold mb-4">Post Search</h1>

        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Search Posts"
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      <ul className="max-w-md mt-2">
        {results.map((result) => (
          <li
            key={result.id}
            className="my-2 border p-2 rounded-md bg-white hover:bg-gray-100"
          >
            <h2 className="text-lg font-bold hover:text-teal-500">
              {result.title}
            </h2>
            <p className="text-gray-700">{result.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
