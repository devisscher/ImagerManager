"use strict"
var express = require('express');
var router = express.Router();
var path = require('path');
var busboy = require('connect-busboy'); //middleware for form/file upload
var fs = require('fs-extra');
var path = require('path');
var sharp = require('sharp');

var walkSync = function(dir, filelist) {
    var path = path || require('path');
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            filelist = walkSync(path.join(dir, file), filelist);
        } else {
            if (file.indexOf('300x200') > -1) {
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
        if (directoryExists(process.env.IMG_DIR + req.session.team)) {
            files = walkSync(process.env.IMG_DIR + req.session.team + "/");
        }
        console.log(req.session.id)
        res.render('index', {
            title: 'Image Manager',
            img_dir: process.env.IMG_DIR,
            url: process.env.URL,
            domain: req.session.id,
            files: files,
            team: req.session.team
        });
    } else {
        res.redirect('/users');
    }

});
router.post('/', function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var ext = path.extname(filename).toLowerCase();
        var team = req.session.team;
        if (directoryExists(process.env.IMG_DIR + req.session.team)) {
            //var myFilename = convertToSlug(filename)
            var myFilename = guid()
            var fstream = fs.createWriteStream(process.env.IMG_DIR + req.session.team + "/" + myFilename + ext);
            file.pipe(fstream);
            fstream.on('close', function() {
                sharp(process.env.IMG_DIR + req.session.team + '/' + myFilename + ext).resize(300, 200).toFile(process.env.IMG_DIR + req.session.team + "/" + myFilename + '_300x200' + ext, function(err) {
                    // output.jpg is a 300 pixels wide and 200 pixels high image
                    // containing a scaled and cropped version of input.jpg
                    if (err) {
                        console.log(err);
                    } else {
                        sharp(process.env.IMG_DIR + req.session.team + '/' + myFilename + ext).resize(1920, 1080).toFile(process.env.IMG_DIR + req.session.team + "/" + myFilename + '_1920x1080' + ext, function(err) {
                            // output.jpg is a 300 pixels wide and 200 pixels high image
                            // containing a scaled and cropped version of input.jpg
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Success")
                                res.redirect('/');
                            }

                        });
                    }

                });

            });
        } else {
            //var myFilename = convertToSlug(filename)
            var myFilename = guid()
            fs.mkdirSync(process.env.IMG_DIR + req.session.team);
            var fstream = fs.createWriteStream(process.env.IMG_DIR + req.session.team + "/" + myFilename + ext);
            file.pipe(fstream);
            fstream.on('close', function() {

                sharp(process.env.IMG_DIR + req.session.team + '/' + myFilename + ext).resize(300, 200).toFile(process.env.IMG_DIR + req.session.team + "/" + myFilename + '_300x200' + ext, function(err) {
                    // output.jpg is a 300 pixels wide and 200 pixels high image
                    // containing a scaled and cropped version of input.jpg
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Success")
                        res.redirect('/');

                    }

                });
            });
        }

    });
});
router.post('/upload', function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var ext = path.extname(filename).toLowerCase();
        var team = "snaphole";
        if (directoryExists(process.env.IMG_DIR + team)) {
            //var myFilename = convertToSlug(filename)
            var myFilename = guid()
            var fstream = fs.createWriteStream(process.env.IMG_DIR + team + "/" + myFilename + ext);
            file.pipe(fstream);
            fstream.on('close', function() {
                sharp(process.env.IMG_DIR + team + '/' + myFilename + ext).resize(300, 200).toFile(process.env.IMG_DIR + team + "/" + myFilename + '_300x200' + ext, function(err) {
                    // output.jpg is a 300 pixels wide and 200 pixels high image
                    // containing a scaled and cropped version of input.jpg
                    if (err) {
                        console.log(err);
                    } else {
                        sharp(process.env.IMG_DIR + team + '/' + myFilename + ext).resize(1920, 1080).toFile(process.env.IMG_DIR + team + "/" + myFilename + '_1920x1080' + ext, function(err) {
                            // output.jpg is a 300 pixels wide and 200 pixels high image
                            // containing a scaled and cropped version of input.jpg
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Success")
                                res.redirect('/');
                            }

                        });
                    }

                });

            });
        } else {
            //var myFilename = convertToSlug(filename)
            var myFilename = guid()
            fs.mkdirSync(process.env.IMG_DIR + team);
            var fstream = fs.createWriteStream(process.env.IMG_DIR + team + "/" + myFilename + ext);
            file.pipe(fstream);
            fstream.on('close', function() {

                sharp(process.env.IMG_DIR + team + '/' + myFilename + ext).resize(300, 200).toFile(process.env.IMG_DIR + team + "/" + myFilename + '_300x200' + ext, function(err) {
                    // output.jpg is a 300 pixels wide and 200 pixels high image
                    // containing a scaled and cropped version of input.jpg
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Success")
                        res.redirect('/');

                    }

                });
            });
        }
    });
});
router.get('/image/:file_path', function(req, res, next) {
    var myFile = req.params.file_path
    if (req.session.team) {
        var file = '/image_uploads/' + req.session.team + '/' + myFile;
        var img_path = '/image_uploads/' + req.session.team + '/' + myFile;
        console.log(req.session.id)
        res.render('image', {
            title: 'Image',
            domain: req.session.id,
            file: file,
            img_path: img_path,
            team: req.session.team
        });
    } else {
        res.redirect('/users');
    }

});
router.get('/destroy_session', function(req, res, next) {
    req.session = null;
    res.redirect('/');
});


module.exports = router;