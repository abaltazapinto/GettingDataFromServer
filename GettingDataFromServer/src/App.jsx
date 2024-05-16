import React, { useState, useEffect } from 'react';
import axios from 'axios';


function App() {
  //state to store the notes
  const [notes, setNotes] = useState([]);

  // useEffect to handle fetching data when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/notes')
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
    <>
    <div>
      {notes.map(note => (
        <div key={note.id}> {note.content}
        </div>
      ))}
    </div>
     
    </>
  )
}

export default App
