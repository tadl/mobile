/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * @fileOverview A plugin that allows to be notified when the top or the bottom of the page is reached
 * 
 * @author Sylvain Lalande
 */
define(['../../../_amd/core'], function(wink) {
	/**
	 * @class A plugin that allows to be notified when the top or the bottom of the page is reached
	 * 
	 * @param {object} properties The properties object
	 * @param {function} properties.onTop The onTop callback
	 * @param {function} properties.onBottom The onBottom callback
	 * @param {boolean} properties.thresholdTop The threshold which is used to determine if the top is reached
	 * @param {boolean} properties.thresholdBottom The threshold which is used to determine if the bottom is reached
	 * 
	 * @example
	 * 
	 * var tb = new wink.plugins.TopBottom({
	 *   onTop: function(d) {
	 *     alert("onTop! " + d);
	 *   },
	 *   onBottom: function(d) {
	 *     alert("onBottom! " + d);
	 *   },
	 *   thresholdTop: 5,
	 *   thresholdBottom: 5
	 * });
	 * 
	 * @compatibility Iphone OS3, Iphone OS4, Android 2.3, Android 3.0, Android 3.1, BlackBerry 6, BlackBerry 7, Bada 1.0, Windows Phone 8
	 * 
	 * @winkVersion 1.4
	 * 
	 */
	wink.plugins.TopBottom = function(properties)
	{
		/**
		 * Unique identifier
		 * 
		 * @property uId
		 * @type integer
		 */
		this.uId = wink.getUId();
		
		wink.mixin(this, properties);
		
		if (this._validateProperties() === false) return;
		
		this._init();
	};
	
	/**
	 * @ignore
	 */
	var _y = 0,
		_view_height = 0,
		_doc_height = 0,
		_atTop = false,
		_atBottom = false,
		_initialized = false;
	
	wink.plugins.TopBottom.prototype =
	{
		/**
		 * Handles a scroll to the top
		 */
		_handleTop: function(dist, callback)
		{
			if (dist <= this.thresholdTop) {
				if (!_atTop) {
					_atTop = true;
					callback(dist);
				}
			} else {
				_atTop = false;
			}
		},
		/**
		 * Handles a scroll to the bottom
		 */
		_handleBottom: function(dist, callback)
		{
			if (dist <= this.thresholdBottom) {
				if (!_atBottom) {
					_atBottom = true;
					callback(dist);
				}
			} else {
				_atBottom = false;
			}
		},
		/**
		 * Handles scroll event
		 */
		_onScroll: function()
		{
			var plugin = this,
				de = document.documentElement;
			
			_y = window.pageYOffset || de.scrollTop;
			_view_height = window.innerHeight;
			_doc_height = de.scrollHeight;
			
			if (plugin.onTop) {
				plugin._handleTop(_y, function(dist) {
					if (_initialized) {
						plugin.onTop(dist);
					}
				});
			}
			if (plugin.onBottom) {
				plugin._handleBottom(_doc_height - (_view_height + _y), function(dist) {
					if (_initialized) {
						plugin.onBottom(dist);
					}
				});
			}
		},
		/**
		 * Initialize the plugin
		 */
		_init: function()
		{
			var plugin = this;
			
			plugin.thresholdTop = plugin.thresholdTop || 0;
			plugin.thresholdBottom = plugin.thresholdBottom || 0;

			plugin._onScroll();
			window.onscroll = wink.bind(plugin._onScroll, plugin);
			_initialized = true;
		},
		/**
		 * Validate the properties of the component
		 * @returns {boolean} True if the properties are valid, false otherwise
		 */
		_validateProperties: function()
		{
			return true;
		}
	};
	
	return wink.plugins.TopBottom;
});