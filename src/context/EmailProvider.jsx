import React, { useState, useEffect } from "react";
import EmailContext from "./emailContext";

const EmailProvider = ({ children }) => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmailIds, setSelectedEmailIds] = useState([]); // State to track selected email IDs
  const [readEmailIds, setReadEmailIds] = useState([]); // State to track read email IDs
  const [isFavorite, setIsFavorite] = useState(false); // Initialize as false

  const [filters, setFilters] = useState({
    read: false,
    unread: false,
    favorite: false,
  });

  // Fetch emails initially
  useEffect(() => {
    fetch("https://flipkart-email-mock.now.sh/")
      .then((response) => response.json())
      .then((data) => setEmails(data.list));
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
      const updatedReadIds = [...new Set([...prevReadIds, emailId])]; // Ensure uniqueness
      localStorage.setItem("readEmailIds", JSON.stringify(updatedReadIds)); // Store updated read IDs
      return updatedReadIds; // Update the state with the new array
    });
  };

  // Filter emails based on current filters
  const filteredEmails = () => {
    let favoriteEmails = getFavoriteEmailIds();

    return emails.filter((email) => {
      const isFavorite = favoriteEmails.includes(email.id);
      const isRead = readEmailIds.includes(email.id); // Check from readEmailIds array

      // Filter logic
      if (filters.favorite && !isFavorite) return false; // If filtering by favorite
      if (filters.read && !isRead) return false; // If filtering by read emails
      if (filters.unread && isRead) return false; // If filtering by unread emails

      return true; // Include the email if none of the filters block it
    });
  };

  // Function to toggle selection of an email
  const toggleEmailSelection = (emailId) => {
    setSelectedEmailIds((prevSelectedIds) => {
      const emailIsSelected = prevSelectedIds.includes(emailId);

      // If email is selected, remove it from selectedEmailIds, otherwise add it
      const newSelectedIds = emailIsSelected
        ? prevSelectedIds.filter((id) => id !== emailId) // Remove if already selected
        : [...prevSelectedIds, emailId]; // Add if not selected

      updateSelectedEmailIds(newSelectedIds); // Update local storage with new list
      return newSelectedIds;
    });
  };

  // Function to handle toggling the favorite status
  const toggleFavorite = () => {
    // Update the emails array by toggling the favorite status
    const updatedEmails = emails.map((email) => {
      if (email.id === selectedEmail.id) {
        // Toggle the favorite status
        const newFavoriteStatus = !isFavorite; // Use local state to determine the new status
        setIsFavorite(newFavoriteStatus); // Update local state immediately
        return { ...email, favorite: newFavoriteStatus }; // Return a new object with the updated status
      }
      return email; // Return the unchanged email
    });

    setEmails(updatedEmails); // Update the emails in context

    // Get existing favorite emails from localStorage or create a new array
    const favoriteEmails =
      JSON.parse(localStorage.getItem("favoriteEmails")) || [];

    // Check if the email is already a favorite
    if (!isFavorite) {
      // If it's not marked as favorite, add it to the array
      favoriteEmails.push(selectedEmail.id); // Use selectedEmail.id to store the email ID
    } else {
      // If it's already a favorite, remove it from the array
      const index = favoriteEmails.indexOf(selectedEmail.id); // Use selectedEmail.id to find the email ID
      if (index > -1) {
        favoriteEmails.splice(index, 1); // Remove the email ID from the array
      }
    }

    // Store the updated favorite emails in localStorage
    localStorage.setItem("favoriteEmails", JSON.stringify(favoriteEmails));
  };

  return (
    <EmailContext.Provider
      value={{
        toggleFavorite,
        isFavorite,
        setIsFavorite,
        emails: filteredEmails(), // Use the filtered emails in context
        setEmails,
        selectedEmail,
        setSelectedEmail,
        selectedEmailIds, // Provide selected email IDs in context
        toggleEmailSelection, // Provide the toggle function in context
        markEmailAsRead, // Provide the function to mark emails as read
        readEmailIds, // Provide read email IDs in context
        filters,
        setFilters,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export default EmailProvider;
