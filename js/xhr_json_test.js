xhr_json_test_init = function () {
	var endpoint = "http://shamrock.lib.tadl.org:3000/api";

	xhr = new wink.Xhr();

	xhr.sendData(endpoint + '/v0/library/1.json', null, 'GET', {method: 'onsuccess'}, {method: 'onfailure'});

	onsuccess = function(result)
	{
		var response = result.xhrObject.response;
		console.log(response);
		var res = wink.json.parse(response);
		console.log(res.id);
		console.log(res.name);
		wink.byId('xhr_json_test_result').innerHTML = 'Library ID: ' + res.id + '<br />Library Name:' + res.name + '<br /><pre>RAW: ' + response + '</pre>';
	}

	onfailure = function(result)
	{
		alert('xhr failure');
	}
}
