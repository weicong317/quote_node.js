const insertHere = document.getElementById("quoteHere");
const formSubmit = document.getElementById("quoteSubmitForm");
const input = document.getElementById("input");

// this is to get to the route to the that page when node.js is on
fetch("http://127.0.0.1:3000/quotes/random").then(
	function(response){
		if (!response.ok){
			return;
		} else {
			return(response.json());
		}
	}
).then(
	function(item){
		insertHere.innerHTML = item.quote;
	}
);

// to post a quote
formSubmit.onsubmit = function(event){
	event.preventDefault();
    fetch('http://127.0.0.1:3000/quotes/submit', {
        method: 'POST',
        body: input.value
	}).then(response => {
		if (!response.ok){
			if (response.status === 400){
				window.alert(response.statusText);
			}
			return;
		} else {
			return response.json();
		}
	}).then(json => {
		if (!json){
			return;
		}
		window.alert(json.msg);
		input.value = "";
	});
}