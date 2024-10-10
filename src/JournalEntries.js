import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listJournalEntries } from './graphql/queries';
import { deleteJournalEntry } from './graphql/mutations';
import './JournalEntries.css';

const client = generateClient();

const JournalEntries = ({ newEntry, user, onEdit }) => {
  const [entries, setEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const entryData = await client.graphql({ query: listJournalEntries });
      const userEntries = entryData.data.listJournalEntries.items.filter(entry => entry.owner === user.username);
      setEntries(userEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (newEntry) {
      setEntries((prevEntries) => {
        // Replace the entry if it's an update, otherwise add it
        const entryIndex = prevEntries.findIndex((entry) => entry.id === newEntry.id);
        if (entryIndex !== -1) {
          const updatedEntries = [...prevEntries];
          updatedEntries[entryIndex] = newEntry;
          return updatedEntries;
        }
        return [newEntry, ...prevEntries];
      });
    }
  }, [newEntry]);

  const handleDelete = async (id) => {
    try {
      await client.graphql({
        query: deleteJournalEntry,
        variables: { input: { id } },
      });
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div className="journal-entries">
      {entries.map((entry) => (
        <div key={entry.id} className="journal-entry">
          <h3>{entry.title}</h3>
          <p>{entry.content}</p>
          <p className="entry-trip-date">Review Date: {new Date(entry.tripDate).toLocaleDateString()}</p>
          <p className="entry-date">{new Date(entry.date).toLocaleString()}</p>
          <button onClick={() => onEdit(entry)} className="edit-button">Edit</button>
          <button onClick={() => handleDelete(entry.id)} className="delete-button">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default JournalEntries;