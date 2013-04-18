var main = (function() {
    var main = {
        panels: null,
        init: function() {
            this.panels = new wink.plugins.AsyncPanels ({
                duration: 500,
                pages: [
                    'page1',
                    {id: 'locations', url: 'locations.html'},
                    {id: 'search', url: 'search.html'},
                    {id: 'events', url: 'null.html', onLoad: function() {eventsAccordionInit();}},
                    {id: 'news', url: 'null.html', onLoad: function() {newsAccordionInit();}},
                    {id: 'help', url: 'help.html'},
                    {id: 'eastbay', url: 'location-eastbay.html'},
                    {id: 'fifelake', url: 'location-fifelake.html'},
                    {id: 'interlochen', url: 'location-interlochen.html'},
                    {id: 'kingsley', url: 'location-kingsley.html'},
                    {id: 'peninsula', url: 'location-peninsula.html'},
                    {id: 'woodmere', url: 'location-woodmere.html'},
                    {id: 'myaccount', url: 'myaccount.html'}
                ]
            });
            document.body.appendChild(this.panels.getDomNode());

            wink.subscribe('/slidingpanels/events/slidestart', {context: this, method: 'doStuff', arguments: 'start'});
            wink.subscribe('/slidingpanels/events/slideend', {context: this, method: 'doStuff', arguments: 'end'});
            scrollTo(0, 0, 0);

        },
        doStuff: function(params, status) {
            switch ( params.id ) {
                case 'page1':
                    if ( status == 'start' ) {
                        wink.byId('back').style.display = 'none';
                    }
                    break;

                default:
                    if ( status == 'end' ) {
                        wink.byId('back').style.display = 'block';
                    }
                    break;
            };
        }
    }

    window.addEventListener('load', wink.bind(main.init, main), false);

    return main;
}());

