/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
* @fileOverview Implements a Gesture management system.
*
* @compatibility Iphone OS2, Iphone OS3, Iphone OS4, Android 1.5, Android 2.1, Android 2.2, Android 2.3, Android 3.0, Android 3.1, Android 4.0, BlackBerry 6, BlackBerry 7, Bada 1.0
* @author Laïla YATCHOU, Jerome GIRAUD
*/
define (['../../../_amd/core'], function(wink)
{
	/**
	 * @namespace The namespace of the gesture methods
	 */
	wink.plugins.gesture =
	{
		_els: [],
		
		/**
		 * Start listening to swipe gestures. The callback gets alerted if the user made a left or right swipe
		 * 
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */		
		swipe: function(domNode, callback)
		{
			if ( !this._getListener(domNode, 'swipe', callback) )
			{
				var listener =
				{
					startEvent: null,
					endEvent: null,

					handleStart: function(event)
					{
						this.startTime = event.timestamp;
						this.startEvent = event;
					},						

					handleEnd: function(event)
					{
						this.endTime = event.timestamp;
						this.endEvent = event;

						if( Math.abs(this.endTime - this.startTime) < 100 || Math.abs(this.endTime - this.startTime) > 500)
						{
							return;
						}

						if(Math.abs(this.endEvent.x - this.startEvent.x) < 100)
						{
							return ;
						}

						if(Math.abs(this.endEvent.y - this.startEvent.y) > 40)
						{
							return;
						}

						if(this.endEvent.x < this.startEvent.x)
						{
							wink.call(callback, 'left');
						}else
						{
							wink.call(callback, 'right');
						}

					}

				};

				wink.ux.touch.addListener(domNode, 'start' , {context: listener, method:'handleStart'},{preventDefault: true});
				wink.ux.touch.addListener(domNode, 'end' , {context: listener, method:'handleEnd'},{preventDefault: true});
				
				this._els.push({domNode: domNode, event: 'swipe', callback: callback, listener: listener});
			}
		},
		
		/**
		 * Stop listening to swipe gestures
		 * 
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */
		unSwipe: function(domNode, callback)
		{
			this._removeListener(domNode, 'swipe', callback);
		},
			
		/**
		 * Start listening to scroll gestures. The callback gets alerted if the user made a top or bottom scroll
		 * 
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */
		scroll: function(domNode, callback)
		{
			if ( !this._getListener(domNode, 'scroll', callback) )
			{
				var listener =
				{
					startEvent: null,
					endEvent: null,
	
					handleStart: function(event)
					{
						this.startTime = event.timestamp;
						this.startEvent = event;
					},						
	
					handleEnd: function(event)
					{
						this.endTime = event.timestamp;
						this.endEvent = event;
	
						if( Math.abs(this.endTime - this.startTime) < 100 || Math.abs(this.endTime - this.startTime) > 500)
						{
							return;
						}
	
						if(Math.abs(this.endEvent.y - this.startEvent.y) <100)
						{
							return;
						}
						
						if(Math.abs(this.endEvent.x - this.startEvent.x) > 40)
						{
							return ;
						}
	
						if(this.endEvent.y > this.startEvent.y)
						{
							wink.call(callback, 'bottom');
						} else
						{
							wink.call(callback,' top');
						}
					}
				};					       
	
				wink.ux.touch.addListener(domNode, 'start' , {context: listener, method:'handleStart'},{preventDefault: true});
				wink.ux.touch.addListener(domNode, 'end' , {context: listener, method:'handleEnd'},{preventDefault: true});
				
				this._els.push({domNode: domNode, event: 'scroll', callback: callback, listener: listener});
			}
		},
		
		/**
		 * Stop listening to scroll gestures
		 * 
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */
		unScroll: function(domNode, callback)
		{
			this._removeListener(domNode, 'scroll', callback);
		},

		/**
		 * Start listening to tap events
		 * 
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet|function} callback The callback to invoke when this gesture is done
		 */
		tap: function (domNode, callback)
		{
			if ( !this._getListener(domNode, 'tap', callback) )
			{
				var listener =
				{
					startEvent: null,
					endEvent: null,
	
					handleStart: function(event)
					{
						this.startTime = event.timestamp;
						this.startEvent = event;
					},						
	
					handleEnd: function(event)
					{
						this.endTime = event.timestamp;
						this.endEvent = event;
	
						if(Math.abs(this.endTime - this.startTime) > 250)
						{
							return;
						}
						
						if(Math.abs(this.startEvent.x - this.endEvent.x)>3)
						{
							return;
						}
						
						if(Math.abs(this.endEvent.y - this.startEvent.y)>3)
						{
							return;
						}
	
						wink.call(callback);
					}
				};
	
				wink.ux.touch.addListener(domNode, 'start' , {context: listener, method:'handleStart'},{preventDefault: true});
				wink.ux.touch.addListener(domNode, 'end' , {context: listener, method:'handleEnd'},{preventDefault: true});
				
				this._els.push({domNode: domNode, event: 'tap', callback: callback, listener: listener});
			}
		},
		
		/**
		 * Stop listening to tap events
		 * 
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet|function} callback The callback to invoke when this gesture is done
		 */
		unTap: function(domNode, callback)
		{
			this._removeListener(domNode, 'tap', callback);
		},
		
		/**
		 * Start listening to double tap events
		 *  
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */
		doubleTap: function (domNode, callback)
		{
			if ( !this._getListener(domNode, 'doubletap', callback) )
			{
				var listener =
				{
					startEvent: null,
					endEvent: null,
					firstTapTime: 0,
					nbTaps: 0,
					
					reset: function()
					{
						this.firstTapTime = 0;
						this.nbTaps = 0;
					},
	
					handleStart: function(event)
					{
						this.startTime = event.timestamp;
						this.startEvent = event;
						
						if ( (this.startTime - this.firstTapTime) > 300 )
					    {
							this.reset();
				    	}
					},						
	
					handleEnd: function(event)
					{
				    	this.endTime = event.timestamp;
					    this.endEvent = event;
	
					    if(Math.abs(this.endTime - this.startTime) > 250)
					    {
					    	this.reset();
							return;
					    }
					    
					    if(Math.abs(this.startEvent.x - this.endEvent.x) > 3)
					    {
							this.reset();
							 return;
					    }
					    
					    if(Math.abs(this.endEvent.y - this.startEvent.y) > 3)
					    {
					    	this.reset();
							return;
					     }
					
					    if ( this.nbTaps == 1 )
						{
							if ( (this.endEvent.timestamp - this.firstTapTime) < 300 )
						    {
								wink.call(callback);
					    	}
						
							this.reset();
						} else
					    {
							this.nbTaps++;
							this.firstTapTime = this.endEvent.timestamp;
					    }
			       	}
				};
	
				wink.ux.touch.addListener(domNode, 'start' , {context: listener, method:'handleStart'},{preventDefault: true});
				wink.ux.touch.addListener(domNode, 'end' , {context: listener, method:'handleEnd'},{preventDefault: true});
				
				this._els.push({domNode: domNode, event: 'doubletap', callback: callback, listener: listener});
			}
        },
        
        /**
		 * Stop listening to double tap events
		 *  
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */
        unDoubleTap: function(domNode, callback)
		{
			this._removeListener(domNode, 'doubletap', callback);
		},
		
		/**
		 * Check if there is already a listener
		 *  
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {string} event The name of the event currently being listened
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */
		_getListener: function(domNode, event, callback)
		{
			var i, l = this._els.length;
			
			for (i = 0; i < l; i++) 
			{
				var el = this._els[i];
				var isFn = wink.isFunction(callback);
				
				if (el.domNode == domNode && el.event == event && ((isFn && el.callback == callback ) || (!isFn && el.callback.method == callback.method && el.callback.context == callback.context)) ) 
				{
					return {el: el, index: i};
				}
			}
			
			return false;
		},
		
		/**
		 * Remove a listener
		 *  
		 * @param {HTMLElement} domNode the DOM node that listens to gesture
		 * @param {string} event The name of the event currently being listened
		 * @param {objet| function} callback The callback to invoke when this gesture is done
		 */
		_removeListener: function(domNode, event, callback)
		{
			var p = this._getListener(domNode, event, callback);
			
			if ( p )
			{
				wink.ux.touch.removeListener(domNode, 'start' , {context: p.el.listener, method: 'handleStart'},{preventDefault: true});
				wink.ux.touch.removeListener(domNode, 'end' , {context: p.el.listener, method: 'handleEnd'},{preventDefault: true});

				this._els.splice(p.index, 1);
			}
		}
	};

	wink.query.extend(wink.plugins.gesture, [ 'swipe', 'scroll', 'tap', 'doubleTap', 'unSwipe', 'unScroll', 'unTap', 'unDoubleTap' ], false);

	return wink.plugins.gesture;
});