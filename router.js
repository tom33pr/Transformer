/* jshint node: true */

var url = require('url');
var fs = require('fs');
var pg = require('pg');
var techLogTransformer = require('./Server/TechLogTransformer');
var tfdTransformer = require('./Server/TfdTransformer');

function handleRequest(path, response) {
    fs.readFile(path, null, function(error, data) {
        if (error) {
            response.writeHead(404);
            response.write('File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });
}

module.exports = {
    handleRequest: function(request, response) {
        var path = url.parse(request.url).pathname;
        var connectionString = 'postgres://yxzfvtgq:d9o8tljNW0RhUP4v-Evgwxuz-0Rn8W7z@elmer.db.elephantsql.com:5432/yxzfvtgq'; 
        var client = new pg.Client(connectionString);
        switch (path) {
            case '/':
                response.writeHead(200, { 'Content-Type': 'text/html' });
                handleRequest('./Client/Main.html', response); //provide your path for the Main.html here
                break;
            case '/techLog':
		    
                    
                    client.connect();
                    client.query("INSERT INTO testtable(id, testdata) values($1, $2)", [1, 'Hello world']);
                if (request.method === 'POST') {
                    var techLogBody = '';
                    request.on('data', function(data) {
                        techLogBody += data;
                    });
                }
                request.on('end', function() {
                    techLogTransformer.transformTechLog(techLogBody, function(success, failure) {
                        if (success) {
                            console.log(success);
                        }
                        else {
                            console.log(failure);
                        }
                    });
                });
                break;
            case '/tfd':
                    client.connect();
                    client.query("INSERT INTO testtable(id, testdata) values($1, $2)", [1, 'Hello world']);
                if (request.method === 'POST') {
                    var tfdLogBody = '';
                    request.on('data', function(data) {
                        tfdLogBody += data;
                    });
                }
                request.on('end', function() {
                    tfdTransformer.transformTfd(tfdLogBody, function(success, failure) {
                        if (success) {
                            console.log(success);
                        }
                        else {
                            console.log(failure);
                        }
                    });
                });
                break;
            default:
                response.writeHead(404);
                response.write('Route not defined');
                response.end();
        }
    }
}; 