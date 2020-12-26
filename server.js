const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Model = require("./model");
const PORT = process.env.PORT || 5000;

let server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(
    "mongodb+srv://notesadmin:notesadmin@notes-app.dgwws.mongodb.net/notes-app?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
        if (err) {
            console.log("Could not connect to database", err);
        } else {
            console.log("Connected to the database");
        }
    }
);

server.post("/login", (request, response) => {
    let { email, password } = request.body;
    let userModel = Model.userModel;
    userModel.findOne({ email: email }, (err, data) => {
        if (err) {
            console.log("Error: ", err);
            response.status(500).send("Unknown database error");
        } else {
            if (data === null) {
                response.status(401).send("Email does not exist");
            } else if (data.password === password) {
                response.json(data);
            } else {
                response.status(401).send("Incorrect Password");
            }
        }
    });
});

server.post("/addUser", (request, response) => {
    let { name, email, password } = request.body;
    let userModel = Model.userModel;
    let newUser = new userModel({
        name,
        email,
        password,
    });
    newUser.save((err, data) => {
        if (err) {
            console.log("Error: ", err);
            response.status(500).send("Unknown database error");
        } else {
            response.send(data);
        }
    });
});

server.post("/addNote", (request, response) => {
    let { id, note } = request.body;
    let userModel = Model.userModel;
    userModel.findById(id, (err, data) => {
        if (err) {
            console.log("Error: ", err);
            response.status(500).send("Unknown database error");
        } else {
            let notes = data.notes;
            let newNote = { _id: new mongoose.Types.ObjectId(), ...note };
            notes.push(newNote);
            userModel.findByIdAndUpdate(
                { _id: id },
                { notes: notes },
                (err, data) => {
                    if (err) {
                        console.log("Error: ", err);
                        response.status(500).send("Unknown database error");
                    } else {
                        response.send(data);
                    }
                }
            );
        }
    });
});

server.delete("/deleteNote", (request, response) => {
    let { id, noteId } = request.body;
    let userModel = Model.userModel;
    userModel.findById(id, (err, data) => {
        if (err) {
            console.log("Error: ", err);
            response.status(500).send("Unknown database error");
        } else {
            let notes = data.notes;
            let updatedNotes = notes.filter((note) => {
                return note._id.toString() !== noteId.toString();
            });
            userModel.findByIdAndUpdate(
                id,
                { notes: updatedNotes },
                (err, data) => {
                    if (err) {
                        console.log("Error: ", err);
                        response.status(500).send("Unknown database error");
                    } else {
                        response.json(data);
                    }
                }
            );
        }
    });
});

server.patch("/editNote", (request, response) => {
    let { id, noteId, updatedNote } = request.body;
    let userModel = Model.userModel;
    userModel.findById(id, (err, data) => {
        if (err) {
            console.log("Error: ", err);
            response.status(500).send("Unknown database error");
        } else {
            let notes = data.notes;
            let updatedNotes = notes.map((note) => {
                if (note._id.toString() === noteId.toString()) {
                    return {
                        _id: note._id,
                        ...updatedNote,
                    };
                } else {
                    return note;
                }
            });
            userModel.findByIdAndUpdate(
                id,
                { notes: updatedNotes },
                (err, data) => {
                    if (err) {
                        console.log("Error: ", err);
                        response.status(500).send("Unknown database error");
                    } else {
                        response.json(data);
                    }
                }
            );
        }
    });
});

server.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});
