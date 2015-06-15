var Backbone = require('backbone'),
    Gender = require('../models/gender');

var Genders = Backbone.Collection.extend({
  model: Gender
});

module.exports = Genders;
