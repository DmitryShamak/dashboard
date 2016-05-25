
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
        lang: String,
        tips: {
            type: Boolean,
            default: true
        }
    });
    collections.user = mongoose.model('users', collections.userSchema);

    collections.ProviderSchema = new Schema({
        category: String,
        keywords: Array,
        image: String,
        rate: Number,
        name: String,
        description: String,
        available: {
            type: Boolean,
            default: false
        }
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

    collections.NotificationSchema = new Schema({
        user: String,
        tag: String,
        title: String,
        text: String,
        value: Number,
        date: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    });
    collections.notification = mongoose.model('notifications', collections.NotificationSchema);

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

    collections.VotingSchema = new Schema({
        title: String,
        items: Array,
        confirmed: Array,
        active: {
            type: Boolean,
            default: true
        },
        startDate:  {
            type: Date,
            default: Date.now
        },
        endDate:  {
            type: Date
        }
    });
    collections.voting = mongoose.model('voting', collections.VotingSchema);

    collections.VoteSchema = new Schema({
        user: String,
        voting: String,
        key: String
    });
    collections.vote = mongoose.model('vote', collections.VoteSchema);

    return collections;
};