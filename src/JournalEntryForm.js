// src/JournalEntryForm.js
import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createJournalEntry, updateJournalEntry } from './graphql/mutations';
import './JournalEntryForm.css';

const client = generateClient();

const JournalEntryForm = ({ onNewEntry, user, editingEntry }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tripDate, setTripDate] = useState('');

  // Populate the form fields if editingEntry is set
  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
      setTripDate(editingEntry.tripDate);
    } else {
      // Clear the form if no editing entry is present
      setTitle('');
      setContent('');
      setTripDate('');
    }
  }, [editingEntry]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const journalEntry = {
      title,
      content,
      date: new Date().toISOString(),
      tripDate,
      owner: user?.username,
    };

    try {
      if (editingEntry) {
        // If editing, update the journal entry
        const result = await client.graphql({
          query: updateJournalEntry,
          variables: { input: { id: editingEntry.id, ...journalEntry } },
        });
        onNewEntry(result.data.updateJournalEntry); // Notify parent with updated entry
      } else {
        // If not editing, create a new journal entry
        const result = await client.graphql({
          query: createJournalEntry,
          variables: { input: journalEntry },
        });
        onNewEntry(result.data.createJournalEntry); // Notify parent with the new entry
      }

      // Clear the form fields after submit
      setTitle('');
      setContent('');
      setTripDate('');
    } catch (error) {
      console.error('Error submitting journal entry: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="journal-entry-form">
      <input
        type="text"
        placeholder="College Name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="form-input"
      />
      <textarea
        placeholder="Write your review"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="form-textarea"
      />
      <input
        type="date"
        placeholder="Review Date"
        value={tripDate}
        onChange={(e) => setTripDate(e.target.value)}
        required
        className="form-input"
      />
      <button type="submit" className="form-submit-button">
        {editingEntry ? 'Update Review' : 'Add Review'}
      </button>
    </form>
  );
};

export default JournalEntryForm;
