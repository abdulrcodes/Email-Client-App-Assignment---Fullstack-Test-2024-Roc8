import React, { useContext, useEffect, useState } from "react";
import EmailContext from "../context/emailContext";

const EmailBody = () => {
  const {
    selectedEmail,
    setEmails,
    emails,
    toggleFavorite,
    isFavorite,
    setIsFavorite,
  } = useContext(EmailContext);
  const [emailBody, setEmailBody] = useState(null);

  useEffect(() => {
    if (selectedEmail) {
      // Fetch the email body
      fetch(`https://flipkart-email-mock.now.sh/?id=${selectedEmail.id}`)
        .then((response) => response.json())
        .then((data) => {
          setEmailBody(data);
          // Check localStorage for the favorite status
          const favoriteEmails =
            JSON.parse(localStorage.getItem("favoriteEmails")) || [];
          // Set isFavorite based on localStorage
          setIsFavorite(favoriteEmails.includes(selectedEmail.id));
        });
    }
  }, [selectedEmail]);

  // Function to strip HTML tags
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  if (!selectedEmail) return null;

  return (
    <div
      className="email-body"
      style={{ display: selectedEmail ? "block" : "none" }}
    >
      <div className="email-header">
        <div className="avatar">{selectedEmail.from.name[0]}</div>
        <div className="email-info">
          <h1>{selectedEmail.subject}</h1>
          <span>{new Date(selectedEmail.date).toLocaleString()}</span>
        </div>
        <a href="/" className="mark-favorite" onClick={toggleFavorite}>
          {isFavorite ? "Unmark as favorite" : "Mark as favorite"}
          {/* Use local state for immediate feedback */}
        </a>
      </div>
      {emailBody ? (
        <div>
          <p className="email-text">{stripHtml(emailBody.body)}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EmailBody;
