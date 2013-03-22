var main = (function()
{
	var main =
	{
		panels: null,
		
		init: function()
		{
			this.panels = new wink.ui.layout.SlidingPanels
			(
				{
					duration: 500,
					pages: 
					[
					 	'page1', 
					 	'page2',
					 	'page3'
					 ]
				}
			);
			
			document.body.appendChild(this.panels.getDomNode());
			
			wink.subscribe('/slidingpanels/events/slidestart', {context: this, method: 'toggleBackButtonDisplay', arguments: 'start'});
			wink.subscribe('/slidingpanels/events/slideend', {context: this, method: 'toggleBackButtonDisplay', arguments: 'end'});
			
			scrollTo(0, 0, 0);
		},
		
		toggleBackButtonDisplay: function(params, status)
		{
			switch ( params.id )
			{
				case 'page1':
					if ( status == 'start' )
					{
						wink.byId('back').style.display = 'none';
					}
					
					break;
					
				default:
					if ( status == 'end' )
					{
						wink.byId('back').style.display = 'block';
					}
					
					break;
			};
		},
		
		checkboxes:
		{
			toggle: function(input)
			{
				if( input.checked )
				{
					wink.addClass(input, 'w_checked');
				} else
				{
					wink.removeClass(input, 'w_checked');
				}
			}
		},
		
		radios:
		{
			toggle: function(input)
			{
				var radios = $$('input[name="' + input.name + '"]');

				for ( var i in  radios)
				{
					if ( radios[i] == input)
					{
						wink.addClass(input, 'w_checked');
					} else
					{
						wink.removeClass(radios[i], 'w_checked');
					}
				}
			}
		}
	};
	
	window.addEventListener('load', wink.bind(main.init, main), false);
	
	return main;
}());