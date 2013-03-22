/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * @fileOverview The web storage abstraction layer
 * 
 * @author Sylvain Lalande
 */
define(['../../../_amd/core', '../../../_base/_feat/js/feat_api'], function(wink) {
	/**
	 * @class The web storage abstraction layer. It allows to prevent unnecessary and costly access to storage, keeping the name-value pairs known in memory.
	 * The interest is that if it is not supported, the code works and it is stored in memory even if it is not persistent.
	 * 
	 * @param {object} properties The properties object
	 * 
	 * @example
	 * 
	 * var ss = new wink.plugins.SimpleStorage();
	 * ss.set("p1", "value1");
	 * var stored = ss.get("p1");
	 * 
	 * @compatibility Iphone OS3, Iphone OS4, Android 2.1, Android 2.2, Android 2.3, Android 3.0, Android 3.1, BlackBerry 6, BlackBerry 7, Bada 1.0, Windows Phone 8
	 * 
	 * @winkVersion 1.4
	 * 
	 */
	wink.plugins.SimpleStorage = function(properties)
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
	};
	
	/**
	 * @ignore
	 */
	var wls = window.localStorage,
		_isSupported = wink.has("native-localstorage"),
		_set = {};
	
	wink.plugins.SimpleStorage.prototype =
	{
		/**
		 * Get the current value of the named property
		 * 
		 * @param {string} key The key
		 */
		get: function(key)
		{
			if (_isSupported && wink.isUndefined(_set[key])) {
				_set[key] = wls.getItem(key);
			}
			return _set[key];
		},
		/**
		 * Set a value for the named property
		 * 
		 * @param {string} key The key
		 * @param {string} value The value to set
		 */
		set: function(key, value)
		{
			if (_isSupported) {
				wls.setItem(key, value);
			}
			_set[key] = value;
		},
		/**
		 * Remove the named property
		 * 
		 * @param {string} key The key
		 */
		remove: function(key)
		{
			if (_isSupported) {
				wls.removeItem(key);
			}
			_set[key] = undefined;
		},
		/**
		 * Clear the storage
		 */
		clear: function()
		{
			if (_isSupported) {
				wls.clear();
			}
			_set = {};
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
	
	return wink.plugins.SimpleStorage;
});