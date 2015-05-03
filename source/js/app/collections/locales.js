var Backbone = require('backbone'),
    Locale = require('../models/locale');

var Locales = Backbone.Collection.extend({
  model: Locale
});

module.exports = Locales;
