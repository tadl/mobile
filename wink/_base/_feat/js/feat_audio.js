/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * @fileOverview audio features detection.
 * 
 * @compatibility iOS2, iOS3, iOS4, iOS5, iOS6, Android 1.1, Android 1.5, Android 2.1, Android 2.2, Android 2.3, Android 3.0, Android 3.1, Android 4.0, BlackBerry 6, BlackBerry 7, Bada 1.0, Windows Phone 7.5, Windows Phone 8
 * @author Sylvain LALANDE
 * 
 */

define(['../../../_amd/core'], function()
{
	var winkhas = wink.has,
		inquireMap = winkhas.inquireMap,
		formats = {};
	
	inquireMap({
		"audio": function() {
			var audio = document.createElement("audio"),
				support = !!audio.canPlayType;
			
			if (support) {
				var cpt = function(f) {
					return audio.canPlayType(f).replace(/^no$/, '');
				};
				formats["ogg"] = cpt('audio/ogg; codecs="vorbis"');
				formats["mp3"] = cpt('audio/mpeg;');
				formats["wav"] = cpt('audio/wav; codecs="1"');
				formats["m4a"] = cpt('audio/x-m4a;') || cpt('audio/aac;');
			}
			
			delete audio;
			return support;
		},
		"audio-mp3": function() {
			return winkhas("audio") && formats["mp3"] ? true : false;
		},
		"audio-ogg": function() {
			return winkhas("audio") && formats["ogg"] ? true : false;
		},
		"audio-wav": function() {
			return winkhas("audio") && formats["wav"] ? true : false;
		},
		"audio-m4a": function() {
			return winkhas("audio") && formats["m4a"] ? true : false;
		}
	});
	
	return wink.has;
});