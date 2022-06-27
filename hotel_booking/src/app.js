import { useState } from "react";
import ".//Components/searchBar.css";

// Yu chen, not too sure what the DB is for this haha
var data = require("./MOCK_DATA.json");

export default function App() {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    // our api to fetch the search result
    console.log("search ", searchTerm);
  };

  return (
    <div className="App">
      <h1>Search</h1>

      <div className="search-container">
        {/*Work with this for now, considering slack API right now, google seacrh API apparently is only for places, perhaps
        when create the places searhc bar, this can be implemented*/}

        <div className="search-inner">
          <input type="text" value={value} onChange={onChange} />

          {/*Button onClick needs to call out display page, clear this comment after doing it*/}
          <button onClick={() => onSearch(value)}> Search </button>

        </div>

        {/*Dropdown bar for suggestions*/}
        <div className="dropdown"> 
          {data
            .filter((item) => {
              const searchTerm = value.toLowerCase();
              const fullName = item.full_name.toLowerCase();

              return (
                searchTerm &&
                fullName.startsWith(searchTerm) &&
                fullName !== searchTerm
              );
            })
            .slice(0, 10) // Displays top 10 in json file, can be mmodified to show more/less
            .map((item) => (
              <div
                onClick={() => onSearch(item.full_name)} // searches by item key
                className="dropdown-row" 
                key={item.full_name}
              >
                {item.full_name}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}