//https://hub.packtpub.com/building-movie-api-express/
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const actors = require("./routers/actor");
const movies = require("./routers/movie");

const app = express();

app.listen(8080);

//our express app is configured to understand both formats:JSON and urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(
  "mongodb://localhost:27017/movies",
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
  function (err) {
    if (err) {
      return console.log("Mongoose - connection error:", err);
    }
    console.log("Connect Successfully");
  }
);

//Configuring Endpoints
//Actor RESTFul endpoionts
app.get("/actors", actors.getAll);
app.post("/actors", actors.createOne);
app.get("/actors/:id", actors.getOne);
app.put("/actors/:id", actors.updateOne);
app.post("/actors/:id/movies", actors.addMovie);
app.delete("/actors/:id", actors.deleteOne);
app.delete("/actors/:id/deleteActorMovies", actors.deleteActorMovies); //Q2
app.delete(
  "/actors/removeSpecificMovie/:actorID/:movieID",
  actors.removeSpecificMovie
); //Q3
app.get("/actorsWithMovieDetails", actors.getAllVersion2); //Q7

//Movie RESTFul  endpoints
app.get("/movies", movies.getAll);
app.post("/movies", movies.createOne);
app.get("/movies/:id", movies.getOne);
app.put("/movies/:id", movies.updateOne);
app.delete("/movies/:id", movies.deleteOneByID); //Q1

app.post("/movies/:id/actors", movies.addActor); //without this, cannnot do Q4 -- actually this is Q5
app.delete(
  "/movies/removeSpecificActor/:actorID/:movieID",
  movies.removeSpecificActor
); //Q4

app.get("/movies/:year1/:year2", movies.getByYears); //Q6
app.get("/moviesWithActorDetails", movies.getAllVersion2); //Q8
app.delete("/moviesDeleteByYears", movies.getDeleteByYears); //Q9

// app.get("/movies/actorsByMoviesYear/:selectedYear", movies.getAllVersion3); //******************EXTRA TASK*********
app.get(
  "/movies/actorsByMoviesYear/:selectedYear",
  movies.getActorListFromMovieYear
); //******************EXTRA TASK*********

//extra endpoint - clear movies array such that make it = [] for a particular actor
app.delete("/actors/clearMovieArray/:id", actors.deleteMovieArray);
