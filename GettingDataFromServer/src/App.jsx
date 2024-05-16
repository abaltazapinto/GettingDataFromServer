import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './Note.jsx';
import noteService from './services/notes';




function App() {
  //state to store the notes
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editText, setEditText] = useState(''); // State to hold the input value while editing
  const [editId, setEditId] = useState('');  // State to track the currently edited note

  const handleEdit = (note) => {
    setEditId(note.id);
    setEditText(note.content);  // Initialize the input with the current content
  };

  const handleUpdate = (id) => {
    console.log('Updating note with ID:', id); // Ensure this logs a number or string
    const noteToUpdate = notes.find(n => n.id === id);
    if (!noteToUpdate) {
      console.error('Note not found with ID:', id);
      return; // Exit if no note is found to prevent errors
    }
  
    const updatedNote = { ...noteToUpdate, content: editText };
    console.log('Sending update for:', updatedNote);
  
    axios.put(`http://localhost:3001/notes/${id}`, updatedNote)
      .then(response => {
        setNotes(notes.map(n => n.id !== id ? n : response.data));
        setEditId(null);  // Exit edit mode
        setEditText('');  // Clear edit text after update
      })
      .catch(error => console.error('Error updating note:', error));
  };
  
  const handleChange = (event) => {
    setEditText(event.target.value);
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };
  
    axios.post('http://localhost:3005/notes', noteObject)
      .then(response => {
        setNotes(notes.concat(response.data));
        setNewNote('');
      });
  };
  
  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    if (!note) {
      return; //early return if note not found...
    }

    const changedNote = { ...note, important: !note.important };
  
    axios.put(`http://localhost:3005/notes/${id}`, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data));
      })
      .catch(error => {
        console.error('Error updating note:', error);
        setNotes(notes.filter(n => n.id !== id));
      });
  };

  // useEffect to handle fetching data when the component mounts
  useEffect(() => {
    
    axios.get('http://localhost:3005/notes')
      .then(response => {
        //update the state with the fetched notes
        setNotes(response.data);
        console.log(response.data);
        
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  }, []) // The empty array as the second argument ensures this runs once the on mount
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {editId === note.id ? (
              <input
                type="text"
                value={editText}
                onChange={handleChange}
              />
            ) : (
              <span>{note.content}</span>
            )}
            {editId === note.id ? (
              <button onClick={handleUpdate(note.id)}>Save</button>
            ) : (
              <button onClick={() => handleEdit(note)}>Edit</button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

//   return (
//     <div>
//       <h1>Notes</h1>
//       <ul>
//         {notes.map(note => (
//           <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
//         ))}
//       </ul>
//       <form onSubmit={addNote}>
//         <input value={newNote} onChange={(e) => setNewNote(e.target.value)} />
//         <button type="submit">Save</button>
//       </form>
//     </div>
//   );
// }

export default App
