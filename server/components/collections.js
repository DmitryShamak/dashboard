
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
        providers: Array,
        lang: {
            type: String,
            default: "en"
        }
    });
    collections.user = mongoose.model('users', collections.userSchema);

    collections.ProviderSchema = new Schema({
        category: String,
        keywords: Array,
        image: String,
        rate: Number,
        name: String,
        description: String
    });
    collections.provider = mongoose.model('providers', collections.ProviderSchema);

    collections.NoteSchema = new Schema({
        user: String,
        date: Date,
        link: String,
        text: String
    });
    collections.note = mongoose.model('notes', collections.NoteSchema);

    collections.BookmarkSchema = new Schema({
        user: String,
        feed: String
    });
    collections.bookmark = mongoose.model('bookmarks', collections.BookmarkSchema);

    collections.HistorySchema = new Schema({
        user: String,
        feed: String
    });
    collections.history = mongoose.model('history', collections.HistorySchema);

    collections.UpdateSchema = new Schema({
        target: String,
        date: {
            type: Date,
            default: Date.now
        }
    });
    collections.update = mongoose.model('updates', collections.UpdateSchema);

    collections.FeedSchema = new Schema({
        provider: String,
        label: String,
        image: String,
        link: String,
        date:  {
            type: Date,
            default: Date.now
        }
    });
    collections.feed = mongoose.model('feeds', collections.FeedSchema);

    return collections;
};