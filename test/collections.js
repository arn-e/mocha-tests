//test 1

var assert = require('assert')
    , should = require('should')
    , http = require('http')
    , config = require('../config')
    , request = require('request')
    , Seq = require('seq')
    , exec = require("child_process").exec;
    ;

describe('Collections', function() {

    describe('Collections : ', function(){

        it('Should test basic integrity and functionality', function(done){
            console.log('\n');
            this.timeout(60000);

            Seq().seq(function() { var next = this;

                // database name variable
                var db1 = 'es1test';

                exec("sh ../create.sh " + db1, function (error, stdout, stderr){
                    if (error !== null){
                        console.log('exec error: ' + error);
                    }
                    //console.log(stdout);
                    console.log(db1 + ' has been created');
                    next();
                })

            }).seq(function() { var next = this;

                var db2 = 'ita';
                exec("sh ../create_2.sh " + db2, function(error, stdout, stderr){
                    if (error !== null){
                        console.log('exec error: ' + error);
                    }
                    //console.log(stdout);
                    console.log(db2 + ' has been created');
                    next();
                })


            }).seq(function() { var next = this;

              //login
                request({
                    method: 'POST',
                    uri: config.web.url + '/api/login',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'username=username;password=password'
                }, function(err, response, body) {
                    response.should.have.status(200);
                    next();
                });

            }).seq(function() { var next = this;

                    //check login status
                    request({
                        method:'GET',
                        uri : config.web.url + '/api/login/status'
                    }, function(err,response,body){
                        //console.log(body);
                        next();
                })

            }).seq(function() { var next = this;

                    //retrieve /api/search JSON
                    request({
                        method: 'GET',
                        uri : config.web.url + '/api/search',
                        json : true
                    }, function(err, response, body){
                        next();
                })

            }).seq(function() { var next = this;

                    //test #1 : retrieve & test number of collections
                    request({
                        method: 'GET',
                        uri : config.web.url + '/api/search'
                    }, function(err, response, body){
                        var collections = JSON.parse(body);
                        //collections.length.should.equal(8);
                        next();
                    })

            }).seq(function() { var next = this;

                    //test #2 : retrieve number of search results from the first (chronological) collection (id : 10)
                    request({
                        method: 'GET',
                        uri : config.web.url + '/api/search'
                    }, function(err, response, body){
                        var collections = JSON.parse(body);
                        // searching based on id in case new collections are added
                        for (var i in collections){
                            if(collections[i].id === 10){
                                collections[i].numDocs.should.equal(3);
                                continue;
                            }
                        }
                        next();
                    })

            }).seq(function() { var next = this;

                    //test #3 : create a new collection with the search string 'message'
                    var searchQuery = 'message';
                    request({
                        method: 'POST',
                        uri : config.web.url + '/api/search',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        body : 'query=' + encodeURIComponent(searchQuery)
                    }, function(err, response, body){
                        response.should.have.status(200);
                        function sleep(ms)
                        {
                            var dt = new Date();
                            dt.setTime(dt.getTime() + ms);
                            while (new Date().getTime() < dt.getTime());
                        }
                        sleep(10000);
                        next();
                    })

            }).seq(function() { var next = this;

                    //test #4 : test values (numDocs) from newly created collection
                    request({
                        method: 'GET',
                        uri : config.web.url + '/api/search'
                    }, function(err, response, body){
                        var collections = JSON.parse(body);
                        //console.log(collections[0])
                        //collections[0].numDocs.should.equal(3);
                        next();
                    })

            }).seq(function() {done(); });
        })
    })
})
