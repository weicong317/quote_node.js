// node.js set up
const http = require("http");
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer();

// database which is json
const fileName = "./try.json";

// read the database and parse the file into json
let returnDataString = fs.readFileSync(fileName, "utf8");
let returnDataObject = JSON.parse(returnDataString);

// this is to get to the route to the that page when node.js is on
fetch("http://127.0.0.1:3000/quotes/random").then(
	function(response){
		if (!response.ok){
			return;
		} else {
			return response.json();
		}
	}
).then(
	function(json){
		if (!json){
			return;
		}
		console.log(json);
	}
)

// print the quote out
function JSONString(result, message){
	result.write(JSON.stringify({quote: message}));
	result.end();	
}

// to get random quote from database
function getRandomQuote(){
	return returnDataObject.quotes[Math.floor(Math.random() * returnDataObject.quotes.length)];
}

// what the node.js server do
server.on("request", function(request, result){
	// setting up
	result.setHeader("Content-Type", "text/json");
	result.setHeader("Access-Control-Allow-Origin", "*");
	result.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
	result.setHeader("Access-Control-Allow-Headers", "*");

	// if the request is get
	if (request.method === "GET"){
		if (request.url === "/quotes"){
			// return all the quotes in database
			JSONString(result, returnDataObject.quotes);		
		} else if (request.url === "/quotes/random"){
			// return random quote from database
			JSONString(result, getRandomQuote());
		} 
	} else if (request.method === "POST"){
		if (request.url === "/quotes/submit"){
			const temporaryArr = [];
			request.on("data", function(chunk){
				// the data input will be return back as chunk and push to temp array
				temporaryArr.push(chunk);
			}).on("end", function(){
				// make the array into a string
				const temporaryString = (Buffer.concat(temporaryArr).toString()).split("=")[1];
				// replace all the + become space using regex
				const replaceSpace = temporaryString.replace(/\+/g, " ");
				// write into database
				returnDataObject.quotes.push(replaceSpace);
				fs.writeFileSync(fileName, JSON.stringify(returnDataObject));
				result.write("Quote submitted. Visit 127.0.0.1:3000/quotes to visit all the quote available");
				result.end();
			});
		} 
	} else {
		result.write("<p>Please go to 127.0.0.1:3000/quotes<p>");
		result.end();
	}
});

// to print out the message when run node.js
server.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});