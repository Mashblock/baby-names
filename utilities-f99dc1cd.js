var breakpoints = {
  lg: 1200,
  md: 992,
  sm: 768,
  xs: 0
};

var utilities = {
  bind: function(fn, me){
    return function(){ return fn.apply(me, arguments); };
  },
  media: function(){
    for (var key in breakpoints){
      if (Modernizr.mq(`(min-width:${breakpoints[key]}px)`)){
        return key;
      }
    }
  }
};

module.exports = utilities;
