var db = require('../data.js');
var search = require('../search.js');
var Recipe = require('./recipeModel.js');
var request = require('request');
var url = require('url');
var Q = require('q');

module.exports = {
  getRecipes: function (req, res, next) {
    // insert api id and api password for api call
    var YUMMLY_API_ID = 'aca21f0d';
    var YUMMLY_API_KEY = '54f02d95d4b66adc893bb036c3165e3f';
    var params = url.parse(req.url).query;

    if (url.parse(req.url).query) {
      var apiUrl = 'http://api.yummly.com/v1/api/recipes?_app_id=' + YUMMLY_API_ID + '&_app_key=' + YUMMLY_API_KEY + '&' + params + '&requirePictures=true';

      request(apiUrl, function (err, response, body) {
        if (err) {
          res.status(401).send();
        } else {
          res.json(body);
        }
      });
    } else {
      res.status(200);
      res.json(JSON.stringify(db)); 
    }
  },
  saveRecipe: function(req, res, next) {
    var id = req.body.id;
    
    var findRecipe = Q.nbind(Recipe.findOne, Recipe);
    findRecipe({id: id})
      .then(function (recipe) {
        // if recipe exists, we want to iterate the number of saves
        // to keep track of popularity
        if (recipe) {
          recipe.numberOfSaves++;
          recipe.save();
        } else {
          var newRecipe = new Recipe(req.body);
          return newRecipe.save();
        }
      });
  }
};
