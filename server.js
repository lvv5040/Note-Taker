const express = require("express");
const path = require("path");
const fs = require("fs");

//our instacne of express class object
const app = express();
const PORT = 7777;

//body parsers
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//make public folder avaibale
app.use(express.static("public"));

//html routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

//api routes
app.get("/api/notes", function(req, res) {
    //get the data drom the json
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    //respond with data to client
    res.json(notes);
});

app.post("/api/notes", function(req, res) {
    //get notes
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    //get client post data
    const newNote = req.body;
    //create new unique ID
    const id = (notes.length).toString();
    //add id to new note data
    newNote.id = id;
    //add old notes and newnote
    notes.push(newNote);
    //overwrite the old notes json
    fs.writeFileSync("./db/db.json", JSON.stringify(notes));
    //respond with it worked
    res.json(notes);
});

app.delete("/api/notes/:id", function(req, res) {
    //get notes
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    //get client post id
    const targetId = req.params.id;
    //create new unique ID
    let id = 0;
    filtredNotes = notes.filter(note => targetId !== note.id);
    //reset ids
    for (note of filtredNotes) {
        note.id = id.toString();
        id++;
    }
    //overwrite the old notes json
    fs.writeFileSync("./db/db.json", JSON.stringify(filtredNotes));
    //respond with it worked
    res.json(filtredNotes);
});

//start listen
app.listen(PORT, function() {
    console.log(`Listening on ${PORT} .....`);
});