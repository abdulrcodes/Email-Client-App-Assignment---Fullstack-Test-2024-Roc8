import React, { useContext, useEffect, useState } from "react";
import EmailContext from "../context/emailContext";

const EmailItem = ({ email, isSelected }) => {
  const {
    setSelectedEmail,
    toggleEmailSelection,
    markEmailAsRead,
    readEmailIds,
  } = useContext(EmailContext);

  const [isFavoriteEmail, setIsFavoriteEmail] = useState(false);

  useEffect(() => {
    // Check localStorage for favorite emails
    const favoriteEmails =
      JSON.parse(localStorage.getItem("favoriteEmails")) || [];
    setIsFavoriteEmail(favoriteEmails.includes(email.id));
  }, [email.id]);

  useEffect(() => {
    // This effect will re-run whenever the email's favorite status changes in local storage
    const favoriteEmails =
      JSON.parse(localStorage.getItem("favoriteEmails")) || [];
    setIsFavoriteEmail(favoriteEmails.includes(email.id));
  }, [isFavoriteEmail]);

  // Function to handle email click
  const handleEmailClick = () => {
    setSelectedEmail(email);
    toggleEmailSelection(email.id);

    // Mark as read and update local storage if not already marked
    if (!readEmailIds.includes(email.id)) {
      markEmailAsRead(email.id);
    }
  };

  return (
    <div
      className={`email-item ${isSelected ? "selected" : ""}`}
      onClick={handleEmailClick}
      style={{
        backgroundColor: readEmailIds.includes(email.id) ? "white" : "",
      }}
    >
      <div className="avatar">{email.from.name[0]}</div>
      <div className="email-info">
        <div className="from">
          <p>From:</p>
          <h5>
            {email.from.name}{" "}
            <span className="email-address">&lt;{email.from.email}&gt;</span>
          </h5>
        </div>
        <div className="subject">
          <p>Subject:</p>
          <h5>{email.subject}</h5>
        </div>
        <p>{email.short_description}</p>
        <span>{new Date(email.date).toLocaleString()}</span>
        {isFavoriteEmail && <span className="favorite-label">Favorite</span>}
      </div>
    </div>
  );
};

export default EmailItem;
