const mongoose = require("mongoose");

const Actor = require("../models/actor");
const Movie = require("../models/movie");

module.exports = {
  getAll: function (req, res) {
    Actor.find(function (err, actors) {
      if (err) {
        return res.status(404).json(err);
      } else {
        res.json(actors);
      }
    });
  },

  getAllVersion2: function (req, res) {
    Actor.find({})
      .populate("movies")
      .exec(function (err, actor) {
        if (err) return res.status(400).json(err);
        if (!actor) return res.status(404).json();
        res.json(actor);
      });
  },

  createOne: function (req, res) {
    let newActorDetails = req.body;
    newActorDetails._id = new mongoose.Types.ObjectId();

    Actor.create(newActorDetails, function (err, actor) {
      if (err) return res.status(400).json(err);

      res.json(actor);
    });
  },

  getOne: function (req, res) {
    Actor.findOne({ _id: req.params.id })
      .populate("movies")
      .exec(function (err, actor) {
        if (err) return res.status(400).json(err);
        if (!actor) return res.status(404).json();
        res.json(actor);
      });
  },

  updateOne: function (req, res) {
    Actor.findOneAndUpdate({ _id: req.params.id }, req.body, function (
      err,
      actor
    ) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      res.json(actor);
    });
  },

  deleteOne: function (req, res) {
    Actor.findOneAndRemove({ _id: req.params.id }, function (err) {
      if (err) return res.status(400).json(err);

      res.json();
    });
  },

  addMovie: function (req, res) {
    Actor.findOne({ _id: req.params.id }, function (err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      Movie.findOne({ _id: req.body.id }, function (err, movie) {
        if (err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();

        actor.movies.push(movie._id);
        actor.save(function (err) {
          if (err) return res.status(500).json(err);

          res.json(actor);
        });
      });
    });
  },

  //   //additional
  //   deleteMovies: function (req, res) {
  //     Actor.findOne({ id: req.params.id }, function (err, actor) {});
  //   },

  deleteActorMovies: function (req, res) {
    //   let actorId = req.params.actorId;
    Actor.findOneAndDelete({ _id: req.params.id }, function (err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json;

      for (let i = 0; i < actor.movies.length; i++) {
        Movie.deleteOne({ _id: actor.movies[i] }, function (err) {
          if (err) return res.status(500).json(err);
        });
      }

      res.json("OK");
    });
  },
  deleteMovieArray: function (req, res) {
    Actor.findOne({ _id: req.params.id }, function (err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      actor.movies = [];
      actor.save(function (err) {
        if (err) return res.status(500).json(err);

        res.json(actor);
      });
    });
  },

  removeSpecificMovie: function (req, res) {
    Actor.findOne({ _id: req.params.actorID }, function (err, actor) {
      if (err) return res.status(400).json(err);
      if (!actor) return res.status(404).json();

      Movie.findOne({ _id: req.params.movieID }, function (err, movie) {
        if (err) return res.status(400).json(err);
        if (!movie) return res.status(404).json();

        actor.movies.pull(movie._id);
        actor.save(function (err) {
          if (err) return res.status(500).json(err);

          res.json(actor);
        });
      });
    });
  },
};
