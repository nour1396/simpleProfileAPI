const Post = require('../models/posts').Post;

exports.postHandler = async(req, res) => {
    try {
        let { postTitle, postContent } = req.body;
        let post = new Post({
            postContent,
            postTitle,
            userID: req.session.userID,
            publishDate: Date.now()
        });
        await post.save();
        res.json('success')
    } catch (error) {
        res.json(error)
    }
};

exports.profile = async(req, res) => {
    try {
    
        let userPosts = await Post.find({}).populate('userID', '-_id -password');
        res.json(userPosts)
    } catch (error) {
        res.json(error, 'ss')
    }
};

exports.getEditPost = async(req, res) => {
    let id = req.params.id
    let post = await Post.findOne({ _id: id })
    res.json({ post: post, pageTitle: 'Edit Post', currentUser: req.session.firstName, userImage: req.session.userImg })
};

exports.handleEditPost = async(req, res) => {
    try {
        let id = req.params.id
        let { postTitle, postContent } = req.body;
        await Post.updateOne({ _id: id }, { postTitle, postContent })
        res.json('success')
    } catch (error) {
        res.json(error)
    }
};

exports.handleDeletePost = async(req, res) => {
    try {
        let id = req.params.id
        await Post.deleteOne({ _id: id })
        res.json('success')
    } catch (error) {
        res.json(error)
    }
};