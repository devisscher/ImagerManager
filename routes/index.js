var express = require('express');
var router = express.Router();
var path = require('path');
var busboy = require('connect-busboy'); //middleware for form/file upload
var fs = require('fs-extra');
var path = require('path');
var walkSync = function(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            if (file.indexOf('.jpg' || '.png') > -1) {

                filelist.push(file);
            }
        }
    });
    return filelist;
};

function guid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function directoryExists(path) {
    try {
        return fs.statSync(path).isDirectory();
    } catch (err) {
        return false;
    }
}

function convertToSlug(Text) {
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}
/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.team) {
        var files;
        if (directoryExists('/Users/tdev/Sites/node/nodeimg/public/images/' + req.session.team)) {
            files = walkSync("/Users/tdev/Sites/node/nodeimg/public/images/" + req.session.team + "/");
        }
        console.log(req.session.id)
        res.render('index', { title: 'Image Manager', domain: req.session.id, files: files, team: req.session.team });
    } else {
        res.redirect('/users');
    }

});
router.post('/', function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var ext = path.extname(filename)
        var team = req.session.team;
        if (directoryExists('/Users/tdev/Sites/node/nodeimg/public/images/' + req.session.team)) {
            //var myFilename = convertToSlug(filename)
            var myFilename = guid()
            var fstream = fs.createWriteStream('/Users/tdev/Sites/node/nodeimg/public/images/' + req.session.team + "/" + myFilename + ext);
            file.pipe(fstream);
            fstream.on('close', function() {
                res.redirect('/');
            });
        } else {
            //var myFilename = convertToSlug(filename)
            var myFilename = guid()
            fs.mkdirSync('/Users/tdev/Sites/node/nodeimg/public/images/' + req.session.team);
            var fstream = fs.createWriteStream('/Users/tdev/Sites/node/nodeimg/public/images/' + req.session.team + "/" + myFilename + ext);
            file.pipe(fstream);
            fstream.on('close', function() {
                res.redirect('/');
            });
        }

    });
});
router.get('/image/:file_path', function(req, res, next) {
    var myFile = req.params.file_path
    if (req.session.team) {
        var file = 'http://localhost:3000/images/' + req.session.team + '/' + myFile;
        console.log(req.session.id)
        res.render('image', { title: 'Express', domain: req.session.id, file: file, team: req.session.team });
    } else {
        res.redirect('/users');
    }

});
router.get('/destroy_session', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    })

});
module.exports = router;