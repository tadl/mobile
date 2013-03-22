/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * @fileOverview json features detection.
 * 
 * @compatibility iOS2, iOS3, iOS4, iOS5, iOS6, Android 1.1, Android 1.5, Android 2.1, Android 2.2, Android 2.3, Android 3.0, Android 3.1, Android 4.0, BlackBerry 6, BlackBerry 7, Bada 1.0, Windows Phone 7.5, Windows Phone 8
 * @author Sylvain LALANDE
 * 
 */

define(['../../../_amd/core'], function()
{
	var winkhas = wink.has,
		inquireMap = winkhas.inquireMap,
		w = window;
	
	inquireMap({
		"json-parse": function() {
			var parsed, supported = false;
			if (w["JSON"] && typeof JSON.parse == "function") {
				parsed = JSON.parse('{"w":1}');
				supported = !!(parsed && parsed.w);
			}
			return supported;
	    },
	    "json-stringify": function() {
	    	var stringified, supported = false;
	    	if (w["JSON"] && typeof JSON.stringify == "function") {
	    		stringified = JSON.stringify({w:true});
	    		supported = (stringified == '{"w":true}');
	    	}
	    	return supported;
	    }
	});
	
	return winkhas;
});