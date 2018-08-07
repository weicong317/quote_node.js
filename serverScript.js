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
		} else {
			result.statusCode = 404;
			result.statusMessage = "Page Not Found";
			result.write(result.statusMessage);
			result.end();
		}
	} else if (request.method === "POST"){
		if (request.url === "/quotes/submit"){
			const temporaryArr = [];
			request.on("data", function(chunk){
				// the data input will be return back as chunk and push to temp array
				temporaryArr.push(chunk);
			}).on("end", function(){
				// make the array into a string
				const temporaryString = (Buffer.concat(temporaryArr).toString());
				// server side validation to and return specific status code as fixed if failed
				if (temporaryString.length === 0 || temporaryString.length < 10){
					result.statusCode = 400;
					result.statusMessage = "Input cannot be empty or less than 10 characters";
					result.end();
				} else {
					const res = {
						"msg": "Quote submitted!"
					}
					// write into database
					returnDataObject.quotes.push(temporaryString);
					fs.writeFileSync(fileName, JSON.stringify(returnDataObject));
					result.write(JSON.stringify(res));
					result.end();
				}
			});
		} 
	}
});

// to print out the message when run node.js
server.listen(port, hostname, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});