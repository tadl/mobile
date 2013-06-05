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
        {name: 'avail', value: 'false'},
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

hideImage = function(id) {
    document.getElementById(id).style.display = "none";
}

populate_results = function (json) {
    wink.byId('search_results').innerHTML = ''; // remove any potential previous results
    var searchAccordion = new wink.ui.layout.Accordion({openMultipleSections: false, autoScroll: true});
    // if (defined(json[':items'].length)) { // eh? yeah?
    for (var i=0; i<json[':items'].length; i++) {
        var item = json[':items'][i][':item'];
        var title = item[':title'];
        var author = item[':author'];
        var summary = item[':summary'];
        var availability = item[':availability'];
        var callnumber = item[':callnumber'];
        var recordid = item[':record_id'];
        results = searchAccordion.addSection('<div style="margin-right:2em;"><img id="' + recordid + '" onerror="hideImage(' + recordid + ');" style="height:45px;float:left;" src="http://catalog.tadl.org/opac/extras/ac/jacket/small/r/' + recordid + '"><div style="margin-left:50px;">' + author + ' : ' + title + '<br><span style="color:#000;">' + availability + ' : ' + callnumber + '</span></div></div>', '<div>' + summary + '</div>');
    }
    wink.byId('search_results').appendChild(searchAccordion.getDomNode());
}

