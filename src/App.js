import React, { useState } from 'react';
import JournalEntryForm from './JournalEntryForm';
import JournalEntries from './JournalEntries';
import './App.css'; // Ensure to import your CSS file

const App = ({ signOut, user }) => {
  const [newEntry, setNewEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null); // State to hold the entry being edited

  const handleNewEntry = (entry) => {
    setNewEntry(entry);
    setEditingEntry(null); // Clear editing mode when a new entry is created
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry); // Set the entry to be edited in the form
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Write your review below Mr/Ms. {user.username}</h1>
        <div className="navbar">
          <a href="/welcome" className="nav-link">Home</a>
          <button className="sign-out-button" onClick={signOut}>Sign Out</button>
        </div>
      </header>
      <main>
        <JournalEntryForm
          onNewEntry={handleNewEntry}
          user={user}
          editingEntry={editingEntry} // Pass the entry being edited to the form
        />
        <JournalEntries
          newEntry={newEntry}
          user={user}
          onEdit={handleEdit} // Pass the edit handler to JournalEntries
        />
      </main>
    </div>
  );
};

export default App;
