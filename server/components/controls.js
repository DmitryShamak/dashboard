module.exports = function(collections) {
    var db = {};
    db.find = function(collection, query, cb) {
        if(!query) {
            return cb(true, null);
        }

        collections[collection].find(query, cb);
    };

    db.findOne = function(collection, query, cb) {
        if(!query) {
            return cb(true, null);
        }

        collections[collection].findOne(query, cb);
    };

    db.findOrCreate = function(collection, query, obj, cb) {
        db.findOne(collection, query, function(err, data) {
            if(err || !data) {
                return db.save(collection, obj, cb);
            }

            cb(null, data);
        });
    };

    db.save = function(collectionName, data, cb) {
        var model = new collections[collectionName](data);
        model.save(cb);
    };

    db.delete = function(collection, query, cb) {
        if(!query) {
            return cb(true, null);
        }

        collections[collection].remove(query, cb);
    };

    db.update = function(collection, query, data, cb) {
        collections[collection].update(query, data, {upsert: true}, cb);
    };

    return db;
};