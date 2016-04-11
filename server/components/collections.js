
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
        date: String,
        link: String
    });
    collections.plugin = mongoose.model('plugins', collections.PluginSchema);

    collections.NoteSchema = new Schema({
        user: String,
        date: Date,
        text: String
    });
    collections.note = mongoose.model('notes', collections.NoteSchema);

    return collections;
};