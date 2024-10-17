import React, { useContext } from "react";
import EmailContext from "../context/emailContext";

const FilterBar = () => {
  const { filters, setFilters } = useContext(EmailContext);

  const handleFilterChange = (filterType) => {
    setFilters((prevFilters) => {
      if (filterType === "read") {
        return {
          ...prevFilters,
          read: !prevFilters.read, // Toggle the read filter
          unread: false, // Automatically unselect unread when read is clicked
        };
      } else if (filterType === "unread") {
        return {
          ...prevFilters,
          unread: !prevFilters.unread, // Toggle the unread filter
          read: false, // Automatically unselect read when unread is clicked
        };
      } else {
        return {
          ...prevFilters,
          [filterType]: !prevFilters[filterType], // Toggle other filters (e.g., favorite)
        };
      }
    });
  };

  return (
    <header className="filter-bar">
      <span>Filter By:</span>
      <button
        className={filters.unread ? "active" : ""}
        onClick={() => handleFilterChange("unread")}
      >
        Unread
      </button>
      <button
        className={filters.read ? "active" : ""}
        onClick={() => handleFilterChange("read")}
      >
        Read
      </button>

      <button
        className={filters.favorite ? "active" : ""}
        onClick={() => handleFilterChange("favorite")}
      >
        Favorites
      </button>
    </header>
  );
};

export default FilterBar;
