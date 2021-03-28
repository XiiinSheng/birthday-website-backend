/*
localhost:9000/posts/all             GET all posts
localhost:9000/posts/:id             GET one post by id
localhost:9000/posts/comment/all     GET all comments
localhost:9000/posts/comment/:id     GET one comment by id
localhost:9000/posts/new             POST a new post
localhost:9000/posts/:id/comment     POST a new comment under a post   
localhost:9000/posts/:id             PATCH a change to a post
localhost:9000/posts/comment:id      PATCH a change to a comment
localhost:9000/posts/:id             DELETE a post
localhost:9000/posts/comment/:id     DELETE a comment
*/

// res.set('Access-Control-Allow-Origin', ACAO);

const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');
// const ACAO = '*';

//GET all posts
router.get('/all', (req, res) => {
    Post.find()
        .then(r => res.json(r))
        .catch(e => res.status(500).send('GET error: ' + e));
});

//GET one post by id
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(r => res.json(r))
        .catch(e => res.status(500).send('GET error: ' + e));
})

//GET all comments
router.get('/comment/all', (req, res) => {
    Comment.find()
        .then(r => res.json(r))
        .catch(e => res.status(500).send('GET error: ' + e));
});

//GET one comment by id
router.get('/comment/:id', (req, res) => {
    Comment.findById(req.params.id)
        .then(r => res.json(r))
        .catch(e => res.status(500).send('GET error: ' + e));
})

//POST a new post
router.post('/new', (req, res) => {
    const newPost = new Post(req.body);
    newPost.save()
        .then(r => res.send(r))
        .catch(e => res.status(500).send('POST error: ' + e));
});

//POST a comment to a post
router.post('/:id/comment', async(req, res) => {
    //create new post
    const newComment = new Comment({
        name: req.body.name,
        content: req.body.content,
        parentPost: req.params.id
    })
    Post.findById(req.params.id)
        .then(r => {
            const comments = r.comment;
            //push id to comment id array
            comments.push(newComment._id);
            //save comment 
            newComment.save().then(r =>
                //update comment id array
                Post.updateOne(Post.findById(req.params.id), {comment: comments})
                .then(r1 => res.send(r)))
                .catch(e => res.status(500).send('POST error: '+ e));
            })
        .catch(e => res.status(500).send('POST error: '+ e));
});

//PATCH to make change to a post
router.patch('/:id', (req, res) => {
    const newPost = new Post(req.body);
    Post.updateOne(Post.findById(req.params.id), {content: newPost.content, date: newPost.date})
        .then(r => res.send(r))
        .catch(e => res.status(500).send('PATCH error: ' + e));
})

//PATCH to make change to a comment
router.patch('/comment/:id', (req, res) => {
    const newComment = new Comment(req.body);
    Comment.updateOne(Comment.findById(req.params.id), {content: newComment.content, date: newComment.date})
        .then(r => res.send(r))
        .catch(e => res.status(500).send('PATCH error: ' + e));
})

//DELETE a post
router.delete('/:id', async(req, res) => {
    Post.findOneAndDelete(Post.findById(req.params.id))
        .then(r => {
            for(i = 0; i < r.comment.length; i++){
                Comment.deleteOne(Comment.findById(r.comment[i]))
                    .catch(e => console.log(`Cannot delete comment ${r.comment[i]}`));
            }
            res.send(r);
        })
        .catch(e => res.status(500).send('DELETE error: ' + e));
})

//DELETE a comment
router.delete('/comment/:id', (req, res) => {
    Comment.findOneAndDelete(Comment.findById(req.params.id))
        .then(r => 
            Post.findById(r.parentPost)
                .then(r1 => {
                    const commentIndex = r1.comment.indexOf(req.params.id);
                    const newArray = r1.comment;
                    if(commentIndex != -1){
                        newArray.splice(commentIndex, 1);
                        Post.updateOne(Post.findById(r.parentPost), {comment: newArray})
                            .catch(e => res.status(500).send('DELETE error: ' + e));
                    }else{
                        console.log(`Cannot find this as a comment of parentPost`);
                    }
                })
                .catch(e => console.log(`Cannot find parent index ${r.parentPost}`))
        )
        .then(r => res.send(r))
        .catch(e => res.status(500).send('DELETE error: ' + e));

})

module.exports = router;

