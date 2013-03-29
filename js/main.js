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
                    'events',
                    'news',
                    {id: 'help', url: 'help.html'},
                    {id: 'eastbay', url: 'location-eastbay.html'},
                    {id: 'fifelake', url: 'location-fifelake.html'},
                    {id: 'interlochen', url: 'location-interlochen.html'},
                    {id: 'kingsley', url: 'location-kingsley.html'},
                    {id: 'peninsula', url: 'location-peninsula.html'},
                    {id: 'woodmere', url: 'location-woodmere.html'}
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
                    if ( status == 'end' ) {
                        try {
                            wink.byId('news').removeChild(newsAccordion.getDomNode());
                            wink.byId('events').removeChild(eventsAccordion.getDomNode());
                        } catch(err) {}
                    }
                    break;

                case 'news':
                    if ( status == 'end' ) {
                        wink.byId('back').style.display = 'block';
                        newsAccordionInit();
                    }
                    break;

                case 'events':
                    if ( status == 'end' ) {
                        wink.byId('back').style.display = 'block';
                        eventsAccordionInit();
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

