var http = require("http");
var express = require('express');
var app=express();
var mysql=require('mysql');
var bodyParser=require('body-parser');


var connection = mysql.createConnection({
	host: "my1stazuremysql.mysql.database.azure.com",
	user: "adminuser@my1stazuremysql",
	password: "my1stMySQL",
	database: "test",
	port: 3306,
	ssl:{rejectUnauthorized: false}
})

/*
var connection = mysql.createConnection({
	host: '172.17.0.2',
	user: 'root',
	password: 'password',
	database: 'test'
})
*/

connection.connect(function(err) {
	if (err) throw err
		console.log('You are connected to MySQL database...')
})


app.use( bodyParser.json() );    //to support JSON-encoded bodies
app.use(bodyParser.urlencoded({  //to support URL-encoded bodies
	extended: true
}));



/*var server = app.listen(8088, "127.0.0.1", function () {


	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)
});
*/

app.listen(8080, function () {
    console.log('app listening on port 8080!')
})


//rest api to get all customers
app.get('/customer', function (req, res) {
   connection.query('select * from customer', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});



//rest api to get a single customer data
app.get('/customer/:id', function (req, res) {
	connection.query('select * from customer where Id=?', [req.params.id], function (error, results, fields) {
	   if (error) throw error;
	   res.end(JSON.stringify(results));
	 });
 });



//rest api to create a new customer record into mysql database
app.post('/customer', function (req, res) {
   var params  = req.body;
   console.log(params);
   connection.query('INSERT INTO customer SET ?', params, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});



//rest api to update record into mysql database
app.put('/customer', function (req, res) {
	connection.query('UPDATE `customer` SET `Name`=?,`Address`=?,`Country`=?,`Phone`=? where `Id`=?', [req.body.Name,req.body.Address, req.body.Country, req.body.Phone, req.body.Id], function (error, results, fields) {
	   if (error) throw error;
	   res.end(JSON.stringify(results));
	 });
 });



 //rest api to delete record from mysql database
app.delete('/customer', function (req, res) {
	console.log(req.body);
	connection.query('DELETE FROM `customer` WHERE `Id`=?', [req.body.Id], function (error, results, fields) {
	   if (error) throw error;
	   res.end('Record has been deleted!');
	 });
 });