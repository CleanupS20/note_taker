const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express();
const noteId = require('./helpers/noteId');
const noteData = require('./db/db.json');

// Server Port

const PORT = process.env.PORT || 3001


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Setting up HTML routes

app.get('/', (req,res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

// Setting up get method routes

app.get('/api/notes', (req, res) =>  fs.readFile('./db/db.json', 'utf-8', (err, data) => res.json(JSON.parse(data))));
  
app.post('/api/notes', (req,res) => {
  
  const {title , text} = req.body;
  const newNote = {
    title,
    text,
    id:noteId(500)
  };

  fs.readFile('./db/db.json', 'utf-8', (err, data) => {

    const parsedNotes = JSON.parse(data);
    parsedNotes.push(newNote);
    fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => {
      console.log(err)
      res.json(parsedNotes)
    });
  });
});

//Delete  notes

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', "utf8", (err, data) => {
    array = JSON.parse(data);

      parsedNotes = array.filter(note => note.id != req.params.id);

    fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (err) => {
      if (err) throw err;

      res.json(parsedNotes);
    })
  })
});


// All other routes

  app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

// Node Listener to ensure my server is running. 

app.listen(PORT, () =>
  console.log(`This server is listening on http://localhost:${PORT}`));