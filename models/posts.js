const mongoose = require('mongoose');
const TimeStamp = require('mongoose-timestamp');

const postSchema = mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    postTitle: String,
    postContent: String,
    publishDate: {
        type: Date,
        default: new Date()
    }
}, { timestamps: { currentTime: () => Math.floor(Date.now() / 1000) } });

/* postSchema.plugin(TimeStamp); */

const Post = mongoose.model('posts', postSchema);
exports.Post = Post