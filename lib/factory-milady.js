(function() {
  var utils = {
    merge: function(obj1, obj2) {
      if(obj1 && obj2) {
        var key;
        for(key in obj2) {
          if(obj2.hasOwnProperty(key)) {
            obj1[key] = obj2[key];
          }
        }
      }
      return obj1;
    }
  , copy: function(obj) {
      var newObj = {};
      if(obj) {
        utils.merge(newObj, obj);
      }
      return newObj;
    }
  , keys: function(obj) {
      var keys = [], key;
      for(key in obj) {
        if(obj.hasOwnProperty(key)) {
         keys.push(key);
        }
      }
      return keys;
    }
  };

  var asyncForEach = function(array, handler, callback) {
    var length = array.length, index = -1;

    var processNext = function() {
      index ++;
      if(index < length) {
        var item = array[index];
        handler(item, processNext);
      } else {
        callback();
      }
    };

    processNext();
  };

    var factories = {};

    var define = function(name, model, attributes) {
        if(arguments.length == 2) {
            attributes = model;
            model = function() {};
        }

        factories[name] = {
            model: model,
            attributes: attributes
        };
    };

  var object = function(name, userAttrs, callback) {
      if(typeof userAttrs === 'function') {
          callback = userAttrs;
          userAttrs = {};
      }

      var attrs = utils.copy(factories[name].attributes);
      utils.merge(attrs, userAttrs);

      asyncForEach(utils.keys(attrs), function(key, cb) {
          var fn = attrs[key];
          if(typeof fn === 'function') {
              fn(function(value) {
                  attrs[key] = value;
                  cb();
              });
          } else {
              cb();
          }
      }, function() {
          callback(attrs);
      });
  }

  var build = function(name, userAttrs, callback) {
        if(typeof userAttrs === 'function') {
            callback = userAttrs;
            userAttrs = {};

            var attrs = utils.copy(factories[name].attributes);
            utils.merge(attrs, userAttrs);
        }

        var model = factories[name].model;
        var attrs = utils.copy(factories[name].attributes);
        utils.merge(attrs, userAttrs);

        asyncForEach(utils.keys(attrs), function(key, cb) {
            var fn = attrs[key];
            if(typeof fn === 'function') {
                fn(function(value) {
                    attrs[key] = value;
                    cb();
                });
            } else {
                cb();
            }
        }, function() {
            var doc = new model();
            var key;
            for(key in attrs) {
                if(attrs.hasOwnProperty(key)) {
                    doc[key] = attrs[key];
                }
            }
            callback(doc);
        });
  };

    var create = function(name, userAttrs, callback) {
        if(typeof userAttrs === 'function') {
            callback = userAttrs;
            userAttrs = {};
        }

        build(name, userAttrs, function(doc) {
            if(typeof doc.save === 'function') {

                doc.save(function(err, savedDoc) {
                    if(err) {
                        callback(err, null);
                    }
                    callback(null, savedDoc);
                });
            } else {
                callback(new Error('Save is not supported'), null);
            }
        });
    };

    var assoc = function(name, attr) {
        return function(callback) {
            build(name, function(doc) {
                if(attr) {
                    callback(doc[attr]);
                } else {
                    callback(doc);
                }
            });
        };
    };

  var Factory    = create;
  Factory.define = define;
  Factory.build  = build;
  Factory.create = create;
  Factory.assoc  = assoc;
  Factory.object = object;

  if(typeof module !== 'undefined' && module.exports) {
    module.exports = Factory;
  } else {
    this.Factory = Factory;
  }
}());

