         console.log('May Node be with you')
         
        const express = require('express');
        const app = express();
        var cors = require('cors');
        var multer  = require('multer');
        var path  = require('path');
        var fs = require('fs');
        var mongo = require('mongodb');
        app.use(cors());


        var upload = multer({
            dest: './uploads'
        });

        
        app.listen(3000, function() {
        console.log('listening on 3000')
        });


        app.get('/', function(req, res) {
        res.send('Hello World')
        });


        app.post('/file',  upload.single('image'), function(req, res) {
            var result = [];

        try {  

            var data = fs.readFileSync(req.file.path, 'utf8'); 
            data = data.split("\n");

            for(var i=0;i<data.length;i++){
                console.log(data[i]);
                var json = {};
                var currentline=data[i].split(",");
                for(var j=0; j<currentline.length; j++){
                    if(j == 0){
                    var series = currentline[j]; 
                    json.SERIES = [];
                    continue;
                    }else{
                    var obj = {};
                    var line = currentline[j].split("|")
                    obj.series = line[0];
                    obj.year = line[1];
                    }
                    json.SERIES.push(obj);	
                }      
                result.push(json);	
                    console.log(result)
            }

        var url = "mongodb://localhost:27017/test";

        mongo.connect(url, function(err, db) {
            if (err) throw err;

            db.collection("series").insert(result, function(err, res) {
                if (err) throw err;
                console.log("inserted");
                db.close();
            });
        });

        } catch(e) {
            console.log('Error:', e.stack);
        }
        res.send('Hello World'+ result);

});

        app.get('/chart', function (req, res) {
            
            var series_no = req.query.id;
            var url = "mongodb://localhost:27017/test";
            var arr = [];

            mongo.connect(url, function(err, db) {
                if (err) throw err;
                var series_collection = db.collection("series").find();
                series_collection.forEach(function (doc, err) {
                     if (err) throw err;
                     arr.push(doc);
                },function () {
                    console.log(arr[series_no]);
                    res.send(arr[series_no]);
                    db.close();
                })
               
            });

        });
        