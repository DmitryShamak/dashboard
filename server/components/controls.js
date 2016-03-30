module.exports = function(collections) {
    var db = {};
    db.find = function(collection, query, cb) {
        if(!query) {
            cb(true, null);
        }

        collections[collection].findOne(query, cb);
    };

    db.findOrCreate = function(collection, query, obj, cb) {
        db.find(collection, query, function(err, data) {
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

    db.update = function(collection, query, data, cb) {
        collections[collection].update(query, data, {upsert: true}, cb);
    };

    return db;
};