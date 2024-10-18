import React, { useState, useEffect } from "react";
import EmailContext from "./emailContext";

const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmailIds, setSelectedEmailIds] = useState([]);
  const [readEmailIds, setReadEmailIds] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const [filters, setFilters] = useState({
    read: false,
    unread: false,
    favorite: false,
  });

  // Fetch emails initially
  useEffect(() => {
    setLoading(true); // Start loading
    fetch("https://flipkart-email-mock.now.sh/")
      .then((response) => response.json())
      .then((data) => {
        setEmails(data.list);
        setLoading(false); // Stop loading after data is fetched
      });
  }, []);

  // Load selected email IDs and read email IDs from local storage when component mounts
  useEffect(() => {
    const storedSelectedEmailIds =
      JSON.parse(localStorage.getItem("selectedEmailIds")) || [];
    setSelectedEmailIds(storedSelectedEmailIds);

    const storedReadEmailIds =
      JSON.parse(localStorage.getItem("readEmailIds")) || [];
    setReadEmailIds(storedReadEmailIds);
  }, []);

  // Function to get favorite email IDs from localStorage
  const getFavoriteEmailIds = () => {
    return JSON.parse(localStorage.getItem("favoriteEmails")) || [];
  };

  // Function to update local storage with selected email IDs
  const updateSelectedEmailIds = (ids) => {
    localStorage.setItem("selectedEmailIds", JSON.stringify(ids));
  };

  // Function to mark an email as read
  const markEmailAsRead = (emailId) => {
    setReadEmailIds((prevReadIds) => {
      const updatedReadIds = [...new Set([...prevReadIds, emailId])];
      localStorage.setItem("readEmailIds", JSON.stringify(updatedReadIds));
      return updatedReadIds;
    });
  };

  // Filter emails based on current filters
  const filteredEmails = () => {
    let favoriteEmails = getFavoriteEmailIds();

    return emails.filter((email) => {
      const isFavorite = favoriteEmails.includes(email.id);
      const isRead = readEmailIds.includes(email.id);

      if (filters.favorite && !isFavorite) return false;
      if (filters.read && !isRead) return false;
      if (filters.unread && isRead) return false;

      return true;
    });
  };

  // Function to toggle selection of an email
  const toggleEmailSelection = (emailId) => {
    setSelectedEmailIds((prevSelectedIds) => {
      const emailIsSelected = prevSelectedIds.includes(emailId);
      const newSelectedIds = emailIsSelected
        ? prevSelectedIds.filter((id) => id !== emailId)
        : [...prevSelectedIds, emailId];

      updateSelectedEmailIds(newSelectedIds);
      return newSelectedIds;
    });
  };

  // Function to handle toggling the favorite status
  const toggleFavorite = () => {
    const updatedEmails = emails.map((email) => {
      if (email.id === selectedEmail.id) {
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        return { ...email, favorite: newFavoriteStatus };
      }
      return email;
    });

    setEmails(updatedEmails);

    const favoriteEmails =
      JSON.parse(localStorage.getItem("favoriteEmails")) || [];

    if (!isFavorite) {
      favoriteEmails.push(selectedEmail.id);
    } else {
      const index = favoriteEmails.indexOf(selectedEmail.id);
      if (index > -1) {
        favoriteEmails.splice(index, 1);
      }
    }

    localStorage.setItem("favoriteEmails", JSON.stringify(favoriteEmails));
  };

  return (
    <EmailContext.Provider
      value={{
        toggleFavorite,
        isFavorite,
        setIsFavorite,
        emails: filteredEmails(),
        setEmails,
        selectedEmail,
        setSelectedEmail,
        selectedEmailIds,
        toggleEmailSelection,
        markEmailAsRead,
        readEmailIds,
        filters,
        setFilters,
        loading,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export default EmailProvider;
