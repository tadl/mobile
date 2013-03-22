/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * @fileOverview video features detection.
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
		"video": function() {
			var video = document.createElement("video"),
				support = !!video.canPlayType;
			
			if (support) {
				var cpt = function(f) {
					return video.canPlayType(f).replace(/^no$/, '');
				};
				var hp = 'video/mp4; codecs="avc1.42E01E';
				formats["h264"] = cpt(hp + '"') || cpt(hp + ', mp4a.40.2"');
				formats["ogg"] = cpt('video/ogg; codecs="theora, vorbis"');
				formats["webm"] = cpt('video/webm; codecs="vp8, vorbis"');
			}
			
			delete video;
			return support;
		},
		"video-h264": function() {
			return winkhas("video") && formats["h264"] ? true : false;
		},
		"video-ogg": function() {
			return winkhas("video") && formats["ogg"] ? true : false;
		},
		"video-webm": function() {
			return winkhas("video") && formats["webm"] ? true : false;
		}
	});
	
	return wink.has;
});