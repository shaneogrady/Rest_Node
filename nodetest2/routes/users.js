var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('userlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.put('/updateuser/:id', function(req, res){
    var db = req.db
    db.collection('userlist').update({_id: ObjectID.createFromHexString(req.params.id)}, 
            {$set: {"username": req.body.username}}, function(err, updated) {
       if (updated) {
          console.log('updated');
       }
       console.log(req.params.id);  // don't need to do toString(), it's string
    })
});

module.exports = router;
