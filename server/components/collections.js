
module.exports = function(mongoose) {
    var collections = {};
    var Schema = mongoose.Schema,
        ObjectId = Schema.ObjectId;

    collections.userSchema = new Schema({
        id: String,
        name: String,
        photo: String,
        lastname: String,
        address: String,
        phone: String,
        dob: Date,
        email: String,
        password: String,
        token: String,
        history: Array,
        plugins: Array
    });
    collections.user = mongoose.model('users', collections.userSchema);

    collections.PluginSchema = new Schema({
        category: String,
        keywords: Array,
        image: String,
        rate: Number,
        label: String,
        description: String,
        useLink: Boolean,
        sources: Object,
        date: String,
        link: String
    });
    collections.plugin = mongoose.model('plugins', collections.PluginSchema);

    return collections;
};