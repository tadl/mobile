var results;
var parameters;

do_search = function () {
    var terms = wink.byId('terms').value;
    var xhr = new wink.Xhr();

    parameters = 
    [
        {name: 'utf8', value: '%E2%9C%93'},
        {name: 'mt', value: 'ALL'},
        {name: 'sort', value: 'RELEVANCE'},
        {name: 'avail', value: 'true'},
        {name: 'q', value: terms}
    ]

    xhr.sendData(
        'http://ilscatcher.herokuapp.com/main/searchjson.json', parameters, 'GET', {method: 'onsuccess'}, {method: 'onfailure'}
    );
    onsuccess = function (request) {
        var response = request.xhrObject.response;
        var json = wink.parseJSON(response);
        populate_results(json);

    }
    onfailure = function (request) {
        alert('xhr failure');
    }
    return false;
}

populate_results = function (json) {
    wink.byId('search_results').innerHTML = ''; // remove any potential previous results
    var searchAccordion = new wink.ui.layout.Accordion({openMultipleSections: false, autoScroll: true});
    for (var i=0; i<json[':items'].length; i++) {
        results = searchAccordion.addSection('<div style="margin-right:2em;">' + json[':items'][i][':item'][':title'] + '</div>', '<div>bla bla bla</div>');
    }
    wink.byId('search_results').appendChild(searchAccordion.getDomNode());
}

