var token;
var user_id;

myaccount_login = function () {
    var user = wink.byId('user').value;
    var pass = wink.byId('pass').value;

    var xhr = new wink.Xhr();

    var login_params = [
        {name: 'user', value: user},
        {name: 'pass', value: pass}
    ];

    xhr.sendData(
        'http://shamrock.lib.tadl.org:3000/api/auth.json', login_params, 'GET', {method: 'onsuccess'}, {method: 'onfailure'}
    );

    onsuccess = function (request) {
        var response = request.xhrObject.response;
        var json = wink.parseJSON(response);

        if (json.uid) {
            // clear the password field
            wink.byId('pass').value = '';
            // hide the login form
            wink.byId('login_div').style.display = 'none';
            // show the logout button
            wink.byId('logout_button').style.display = 'block';
            // store the token and user id in global variables
            token = json.token;
            user_id = json.uid;

            get_user(user_id);
        }
    }

    onfailure = function (request) {
        alert('xhr failure');
    }

    return false;
}

populate_summary = function (user_obj) {
        wink.byId('myaccount_summary').innerHTML = 'Greetings, <b>' + user_obj.name + '</b>!<br />' +
        'You have:<br />' +
        user_obj.summary.checkouts + ' items checked out<br />' +
        user_obj.summary.holds + ' items on hold<br />' +
        user_obj.summary.balance + ' in fines / fees';
}

clear_summary = function () {
    wink.byId('myaccount_summary').innerHTML = '';
}

get_user = function (user) {
    var user;

    var xhr = new wink.Xhr();

    xhr.sendData(
        'http://shamrock.lib.tadl.org:3000/api/user/' + user + '.json?uid=' + user + '&token=' + token, null, 'GET', {method: 'onsuccess'}, {method: 'onfailure'}
    );

    onsuccess = function (request) {
        var response = request.xhrObject.response;
        var json = wink.parseJSON(response);

        if (json.id && json.name) {
            populate_summary(json);
        } else {
            alert('something went wrong in get_user');
        }

    }

    onfailure = function (request) {
        alert('xhr failure');
    }

    return false;
}

logout = function() {
    token = undefined;
    user_id = undefined;
    clear_summary();
    wink.byId('login_div').style.display = 'block';

    wink.byId('logout_button').style.display = 'none';

}
