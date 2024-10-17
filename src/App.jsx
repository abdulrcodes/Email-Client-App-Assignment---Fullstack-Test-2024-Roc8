import React, { useContext } from "react";
import EmailProvider from "./context/EmailProvider";
import EmailList from "./components/EmailList";
import EmailBody from "./components/EmailBody";
import FilterBar from "./components/FilterBar";
import Pagination from "./components/Pagination";
import EmailContext from "./context/emailContext"; // Ensure this is the correct import
import "./styles.css";

const App = () => {
  return (
    <EmailProvider>
      <InnerApp />
    </EmailProvider>
  );
};

// Separate component to use context properly
const InnerApp = () => {
  const { selectedEmail } = useContext(EmailContext); // Move context use here

  return (
    <main className="app-container">
      <FilterBar /> {/* Filter bar to filter emails */}
      <div className="email-view">
        <section
          className="email-list-container"
          style={{
            width: selectedEmail ? "40%" : "100%", // Adjust width based on email selection
            transition: "width 0.3s ease",
          }}
        >
          <EmailList /> {/* Email list component */}
          <Pagination /> {/* Pagination controls */}
        </section>
        {selectedEmail && (
          <section className="email-body-container">
            <EmailBody /> {/* Email body component (on selection) */}
          </section>
        )}
      </div>
    </main>
  );
};

export default App;
