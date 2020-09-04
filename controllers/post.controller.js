const Post = require('../models/posts').Post;

exports.postHandler = async(req, res) => {
    let { postTitle, postContent } = req.body;
    let post = new Post({
        postContent,
        postTitle,
        userID: req.session.userID,
        publishDate: Date.now()
    });
    await post.save();
    res.redirect('/home')
};

exports.profile = async(req, res) => {
    let userPosts = await Post.find({ userID: req.session.userID }).populate('userID', '-_id -password');
    let userName = req.session.firstName + ' ' + req.session.lastName
    res.render('profile', { pageTitle: userName, userPosts, currentUser: req.session.firstName, userImage: req.session.userImg })
};

exports.getEditPost = async(req, res) => {
    let id = req.params.id
    let post = await Post.findOne({ _id: id })
    res.render('editPost', { post: post, pageTitle: 'Edit Post', currentUser: req.session.firstName, userImage: req.session.userImg })
};

exports.handleEditPost = async(req, res) => {
    let id = req.params.id
    let { postTitle, postContent } = req.body;
    await Post.updateOne({ _id: id }, { postTitle, postContent })
    res.redirect('/profile')
};

exports.handleDeletePost = async(req, res) => {
    let id = req.params.id
    await Post.deleteOne({ _id: id })
    res.redirect('/profile')
};