import React, { useContext } from "react";
import EmailContext from "../context/emailContext";
import EmailItem from "./EmailItem";

const EmailList = () => {
  const { emails, selectedEmail } = useContext(EmailContext);

  return (
    <div className="email-list">
      {emails.length > 0 ? (
        emails.map((email) => (
          <EmailItem
            key={email.id}
            email={email}
            isSelected={selectedEmail?.id === email.id}
          />
        ))
      ) : (
        <p>No emails</p>
      )}
    </div>
  );
};

export default EmailList;
