var http = require("http"),
    express = require("express"),
    bodyParser = require("body-parser"),
    mysql = require("mysql"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    pathExists = require('path-exists'),
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname,
      filename = path.join("/data/collect/", uri);

  pathExists(filename).then(function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write(filename + " 404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += 'index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));


var connection	= mysql.createConnection({
	host	: 'mysql',
	port	: '3306',
	user	: 'admin',
	password: 'admin',
	database: 'jactivity2'
});

connection.connect(function(error) {
	if(!error) {
		console.log("Database connection established.");
	} else {
		console.log("Database connection failed.");
	}
});

var app = express();

app.use(bodyParser.text({limit: '50mb'}));

app.post('/', function(req, res) {
	//console.log(req);
	var json = JSON.parse(req.body);
	console.log(JSON.stringify(json));
    /*
	for(var component in json) {
		if(component != "userID") {
			if(json.hasOwnProperty(component)) {
				for(var timestamp in json[component]) {
					if(json[component].hasOwnProperty(timestamp)) {
						console.log(timestamp + ": " + JSON.stringify(json[component][timestamp]));
						var query = 'INSERT INTO `' + component + '` (';
						var keys = "`userID`, `timestamp`, ", values = "'" + json["userID"] +"','" + timestamp + "',";
						for(var data in json[component][timestamp]) {
							if(json[component][timestamp].hasOwnProperty(data)) {
								keys += '`' + data + '`, ';
								values += "'" + json[component][timestamp][data] + "',";
							}
						}
						keys = keys.slice(0, -2);
						values = values.slice(0, -1);
						query += keys + ') VALUES(' + values + ');';
						console.log("Keys: " + keys);
						console.log("Values: " + values);
						console.log(query);
						connection.query(query);
					}
				}
			}
		}
	}
    */
    var query = 'INSERT INTO `' + json['sensor'] + '` (';
    var keys = "", values = "";

    delete json['sensor'];

    for(var data in json) {
        keys += '`' + data + '`, ';
        values += "'" + json[data] + "',";
    }
    keys = keys.slice(0, -2);
    values = values.slice(0, -1);
    query += keys + ') VALUES(' + values + ');';
    //var query = 'INSERT INTO `deviceorientation_apple_chrome_470` (`id`,`label`,`timestamp`,`beta`,`gamma`,`alpha`,`absolute`) VALUES ("1","Sitting","' + Date.now() + '","' + json["beta"] + '","' + json["gamma"] + '","' + json["alpha"] + '","' + json["absolute"] + '")';
    console.log(query);
    connection.query(query);
    res.header("Access-Control-Allow-Origin", "*");
	res.end();
	//console.log(JSON.stringify(json));
});

app.listen(3000,function() {
	console.log("mowat-server started on port 3000");
})

console.log("Static file server running at\n  => http://localhost:" + port);