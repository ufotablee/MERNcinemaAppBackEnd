import express, { response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
const apiPort = 3003;

import Cinemas from "./Models/Cinemas.js";
import Movies from "./Models/Movies.js";
import Session from "./Models/Session.js";
import SessionItem from "./Models/SessionItem.js";
mongoose
  .connect(
    "mongodb+srv://kitava:8hGJtRzZpQLMYk1C@practiceproject.qyrfvlc.mongodb.net/Practice?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => console.log("DB is not connected", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get((req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.get("/getSessions/:moviedId", async (req, res) => {
  const doc = await Session.find({ movie: req.params.moviedId }).populate(
    "times"
  );
  res.json(doc);
});
app.get("/getSessionsByCinema/:movieId/:cinemaId", async (req, res) => {
  const doc = await Session.find({
    movie: req.params.movieId,
    cinemaId: req.params.cinemaId,
  }).populate("times");
  res.json(doc);
});
app.get("/getSessionItem/:id", async (req, res) => {
  const doc = await SessionItem.findById(req.params.id);
  res.json(doc);
});
app.post("/addSession/:cinemaId/:movieId", async (req, res) => {
  let initArray = [];
  let customI = 0;
  for (let i = 1; i <= 98; i++) {
    let row;
    if (i >= 0 && i < 15) {
      row = 1;
    } else if (i >= 15 && i < 29) {
      row = 2;
    } else if (i >= 29 && i < 43) {
      row = 3;
    } else if (i >= 43 && i < 57) {
      row = 4;
    } else if (i >= 57 && i < 71) {
      row = 5;
    } else if (i >= 71 && i < 85) {
      row = 6;
    } else if (i >= 85 && i <= 98) {
      customI++;
      row = 7;
    }
    if (row == 7) {
      initArray.push({
        place: customI,
        row: row,
        isFree: true,
        _id: new mongoose.Types.ObjectId(),
        cost: Number(req.body.lux),
      });
    } else {
      initArray.push({
        place: i,
        row: row,
        isFree: true,
        _id: new mongoose.Types.ObjectId(),
        cost: Number(req.body.good),
      });
    }
  }

  const doc = await SessionItem({
    data: req.body.data,
    time: req.body.time,
    hall: req.body.hall,
    good: req.body.good,
    lux: req.body.lux,
    places: initArray,
  });
  doc.save();
  const filter = {
    cinemaId: req.params.cinemaId,
    movie: req.params.movieId,
  };
  const options = {
    new: true,
  };
  const doc1 = await Session.findOneAndUpdate(
    filter,
    {
      $push: { times: doc },
    },
    options
  ).then((data) => res.json(data));
});
app.post("/updateTickets/:sessionId", async (req, res) => {
  const doc = await SessionItem.findById(req.params.sessionId);
  const newArr = doc.places.map((c) =>
    req.body.includes(c._id.valueOf()) ? { ...c, isFree: false } : c
  );
  const doc1 = await SessionItem.findByIdAndUpdate(req.params.sessionId, {
    places: newArr,
  });
  res.json(newArr);
});

app.post("/addMovieToCinema/:cinemaId/:movieID", async (req, res) => {
  await Cinemas.findById(req.params.cinemaId).then((data) => {
    const doc = new Session({
      cinemaId: req.params.cinemaId,
      cinema: data,
      movie: req.params.movieID,
    });
    doc.save();
  });

  let movie = [];
  await Movies.findById(req.params.movieID).then((data) => (movie = data));
  const filter = { _id: req.params.cinemaId };
  const opt = { new: true };
  const doc1 = await Cinemas.findByIdAndUpdate(
    filter,
    {
      $push: { movies: movie },
    },
    opt
  );
  doc1.save();
  res.json(doc1);
});
app.get("/getMovie/:movieId/:cinemaId", async (req, res) => {
  await Cinemas.findById(req.params.cinemaId).then((data) =>
    res.json(data.movies.find((elem) => elem._id == req.params.movieId))
  );
});
app.get("/getMoviesByCinema/:cinemaId", async (req, res) => {
  await Cinemas.findById(req.params.cinemaId).then((data) =>
    res.json(data.movies)
  );
});
app.post("/deleteMovieFromCinema/:cinemaId/:movieId", async (req, res) => {
  const doc = await Cinemas.findById(req.params.cinemaId);
  const newArr = doc.movies.filter((c) => c._id != req.params.movieId);
  const doc1 = await Cinemas.findByIdAndUpdate(req.params.cinemaId, {
    movies: newArr,
  });
  res.json(newArr);
});
app.get("/getAllMovies", async (req, res) => {
  await Movies.find({}).then((data) => res.json(data));
});
app.get("/getAllMoviesExcept/:movieId", async (req, res) => {
  const doc = await Movies.find({ _id: { $ne: req.params.movieId } });
  res.json(doc);
});
app.post("/updateMovieByCinema/:cinemaId", async (req, res) => {
  const doc = new Cinemas({
    name: req.body.name,
    movies: req.body.movies,
    area: req.body.area,
    category: req.body.category,
    intesity: req.body.intesity,
    sessions: req.body.sessions,
  });

  const filter = { _id: req.params.cinemaId };
  await Cinemas.findByIdAndUpdate(filter, doc);
});
app.get("/getCinemasByArea/:areaName", async (req, res) => {
  const doc = await Cinemas.find({ area: req.params.areaName });

  res.json(doc);
});
app.post("/addCinema", (req, res) => {
  const doc = new Cinemas({
    name: req.body.name,
    area: req.body.area,
    category: req.body.category,
    intesity: req.body.intesity,
  });

  doc.save();
  res.json(doc);
});
app.post("/addMovies", (req, res) => {
  const doc = new Movies({
    name: req.body.name,
    producer: req.body.producer,
    operator: req.body.operator,
    actors: req.body.actors,
    genre: req.body.genre,
    production: req.body.production,
    duration: req.body.duration,
    image: req.body.image,
    award: req.body.award,
    bio: req.body.bio,
    year: req.body.year,
  });
  doc.save();
  res.json(doc);
});
app.get("/getCinema", (req, res) => {
  Cinemas.find({})
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
