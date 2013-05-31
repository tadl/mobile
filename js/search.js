var results;

do_search = function () {
    var terms = wink.byId('terms').value;
    var xhr = new wink.Xhr();

    var parameters = 
    [
        {name: 'utf8', value: '%E2%9C%93'},
        {name: 'mt', value: 'ALL'},
        {name: 'sort', value: 'RELEVANCE'},
        {name: 'avail', value: 'true'},
        {name: 'q', value: terms}
    ]

    xhr.sendData(
        'http://catton.staff.lib.tadl.org:4000/main/searchjson.json', terms, 'GET', {method: 'onsuccess'}, {method: 'onfailure'}
    );
    onsuccess = function (request) {
        alert('xhr success');
        var response = request.xhrObject.response;
        var json = wink.parseJSON(response);
        wink.byId('search_results').innerHTML = "boing" + json;

        if (json.uid) {
            token = json.token;
            user_id = json.uid;
        }
    }
    onfailure = function (request) {
        alert('xhr failure');
    }
    return false;
}

/*
populate_summary = function (user_obj) {
        var fines = new Number(user_obj.summary.balance);
        wink.byId('myaccount_summary').innerHTML = 'Greetings, <b>' + user_obj.name + '</b>!<br />' +
        'You have:<br />' +
        user_obj.summary.checkouts + ' items checked out<br />' +
        user_obj.summary.holds + ' items on hold<br />' +
        '$' + fines.toFixed(2) + ' in fines / fees';
}

clear_summary = function () {
    wink.byId('myaccount_summary').innerHTML = '';
}
*/
