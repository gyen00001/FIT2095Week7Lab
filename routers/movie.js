var Actor = require("../models/actor");
var Movie = require("../models/movie");
const mongoose = require("mongoose");
const movie = require("../models/movie");

module.exports = {
  getAll: function (req, res) {
    Movie.find(function (err, movies) {
      if (err) return res.status(400).json(err);

      res.json(movies);
    });
  },

  getAllVersion2: function (req, res) {
    Movie.find({})
      .populate("actors")
      .exec(function (err, movie) {
        if (err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();
        res.json(movie);
      });
  },

  createOne: function (req, res) {
    let newMovieDetails = req.body;
    newMovieDetails._id = new mongoose.Types.ObjectId();
    Movie.create(newMovieDetails, function (err, movie) {
      if (err) return res.status(400).json(err);

      res.json(movie);
    });
  },

  getOne: function (req, res) {
    Movie.findOne({ _id: req.params.id })
      .populate("actors")
      .exec(function (err, movie) {
        if (err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();

        res.json(movie);
      });
  },

  updateOne: function (req, res) {
    Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (
      err,
      movie
    ) {
      if (err) return res.status(400).json(err);
      if (!movie) return res.status(404).json();

      res.json(movie);
    });
  },

  deleteOneByID: function (req, res) {
    Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
      if (err) return res.status(400).json(err);
      res.json();
    });
  },

  addActor: function (req, res) {
    Movie.findOne({ _id: req.params.id }, function (err, movie) {
      if (err) return res.status(400).json(err);
      if (!movie) return res.status(404).json();

      Actor.findOne({ _id: req.body.id }, function (err, actor) {
        if (err) return res.status(400).json(err);
        if (!actor) return res.status(404).json();

        movie.actors.push(actor._id);
        movie.save(function (err) {
          if (err) return res.status(500).json(err);

          res.json(movie);
        });
      });
    });
  },

  removeSpecificActor: function (req, res) {
    Movie.findOne({ _id: req.params.movieID }, function (err, movie) {
      if (err) return res.status(400).json(err);
      if (!movie) return res.status(404).json(); //if that particular object 'movie' is not found

      Actor.findOne({ _id: req.params.actorID }, function (err, actor) {
        if (err) return res.status(400).json(err);
        if (!actor) return res.status(404).json();

        movie.actors.pull(actor._id);
        movie.save(function (err) {
          if (err) return res.status(500).json(err);

          res.json(movie);
        });
      });
    });
  },

  getByYears: function (req, res) {
    if (req.params.year1 <= req.params.year2) {
      let myQuery = {
        year: {
          $gte: parseInt(req.params.year1),
          $lte: parseInt(req.params.year2),
        },
      };
      console.log(myQuery);

      Movie.find(myQuery).exec(function (err, movie) {
        if (err) return res.status(400).json();
        if (!movie) return res.status(404).json(err);
        res.json(movie);
      });
    } else res.json("Year 2 must be greater than or equal to Year 1"); //res.send will do too
  },

  getDeleteByYears: function (req, res) {
    if (req.params.year1 <= req.params.year2) {
      let alsoQuery = {
        year: {
          $gte: parseInt(req.body.year1),
          $lte: parseInt(req.body.year2),
        },
      };
      Movie.deleteMany(alsoQuery).exec(function (err, movie) {
        if (err) return res.status(400).json();
        if (!movie) return res.status(404).json(err);
        res.json(movie);
      });
    } else res.json("Year 2 must be greater than or equal to Year 1"); //res.send will do too
  },

  getActorListFromMovieYear: function (req, res) {
    actorList = [];
    Movie.find({ year: parseInt(req.params.selectedYear) })
      .populate("actors")
      .exec(function (err, movie) {
        if (err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();
        actorList.push(movie.actors.name);
        console.log(movie.actors.name);
        res.json(actorList);
      });
  },

  // getAllVersion3: function (req, res) {
  //   Movie.find({ year: parseInt(req.params.selectedYear) })
  //     .populate("actors")
  //     .exec(function (err, movie) {
  //       if (err) return res.status(400).json(err);
  //       if (!movie) return res.status(404).json();
  //       res.json(movie);
  //     });
  // },
};
