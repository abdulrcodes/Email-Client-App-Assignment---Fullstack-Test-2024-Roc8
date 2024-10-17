import React, { useContext, useState } from "react";
import EmailContext from "../context/emailContext";

const Pagination = () => {
  const { setEmails } = useContext(EmailContext);
  const [activePage, setActivePage] = useState(1); // Track the active page

  const fetchPage = (page) => {
    fetch(`https://flipkart-email-mock.now.sh/?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setEmails(data.list);
        setActivePage(page); // Set the active page
      });
  };

  return (
    <div className="pagination">
      <button
        className={`styled-button ${activePage === 1 ? "active" : ""}`}
        onClick={() => fetchPage(1)}
      >
        Page 1
      </button>
      <button
        className={`styled-button ${activePage === 2 ? "active" : ""}`}
        onClick={() => fetchPage(2)}
      >
        Page 2
      </button>
    </div>
  );
};

export default Pagination;
