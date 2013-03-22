var main = (function()
{
    var main =
    {
        panels: null,
        init: function()
        {
            this.panels = newwink.plugins.AsyncPanels
            (
                {
                    duration: 500,
                    pages:
                    [
                        'page1',
                        {id: 'page2', url: 'locations.html'},
                        {id: 'page3', url: 'search.html'}
                    ]
                }
            );
            document.body.appendChild(this.panels.getDomNode());
        }
    }

    window.addEventListener('load', wink.bind(main.init, main), false);

    return main;
}());
