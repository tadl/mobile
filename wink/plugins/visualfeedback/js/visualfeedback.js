/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * @fileOverview The visual feedback
 * 
 * @author Sylvain Lalande
 */
define(['../../../_amd/core'], function(wink) {
	/**
	 * @class The visual feedback
	 * 
	 * @param {object} properties The properties object
	 * @param {integer} [properties.size=200] The size of the component
	 * @param {integer} [properties.refreshRate=50] The refresh rate
	 * @param {string} [properties.color="#000"] The color
	 * @param {integer} [properties.linewidth=1] The line width
	 * @param {integer} [properties.count=5] The number of circles
	 * @param {boolean} [properties.underway=true] The running status
	 * 
	 * @example
	 * 
	 * var vfb = new wink.plugins.VisualFeedback({
	 *   refreshRate: 15,
	 *   count: 4,
	 *   size: size,
	 *   color: "rgb(0, 0, 0)",
	 *   underway: false,
	 *   onEnd: function() {
	 *     document.body.removeChild(vfb.getDomNode());
	 *   }
	 * });
	 * document.body.appendChild(vfb.getDomNode());
	 * vfb.show();
	 * 
	 * 
	 * @compatibility Iphone OS2, Iphone OS3, Iphone OS4, Android 1.5, Android 2.1, Android 2.2, Android 2.3, Android 3.0, Android 3.1, BlackBerry 6, BlackBerry 7, Bada 1.0, Windows Phone 7.5, Windows Phone 8
	 * 
	 * @winkVersion 1.4
	 * 
	 */
	wink.plugins.VisualFeedback = function(properties)
	{
		this.uId             = wink.getUId();
		
		this._domNode        = null;
			
		wink.mixin(this, properties);
			
		if (this._validateProperties() === false)return;
		
		this._initProperties();
		this._initDom();
	};
	
	wink.plugins.VisualFeedback.prototype = 
	{
		/**
		 * @returns {HTMLElement} The DOM node of the component
		 */
		getDomNode: function()
		{
			return this._domNode;
		},
		
		/**
		 * Set the color
		 * 
		 * @param {string} the color to set
		 */
		setColor: function(c) {
			this.color = c;
			this._rgb = _getRGB(c);
		},
		
		/**
		 * Show the component
		 */
		show: function()
		{
			if (!this._underway)
			{
				this._underway = true;
				this._circles.push({
					r: 0
				});
				this._startRendering();
			}
		},
		
		/**
		 * Hide the component
		 * 
		 * @param {function} onEnd the function invoked when the rendering is finished
		 */
		hide: function(onEnd)
		{
			if (this._underway)
			{
				if (onEnd) {
					this.onEnd = onEnd;
				}
				this._underway = false;
			}
		},
		
		/**
		 * Starts the rendering process
		 */
		_startRendering: function()
		{
			var _this = this;
			if (_this._timer)
			{
				return;
			}
			this._domNode.style.display = "";
			_this._timer = wink.setInterval(_this, '_render', _this.refreshRate);
		},
		
		/**
		 * Stops the rendering process
		 */
		_stopRendering: function()
		{
			clearInterval(this._timer);
			this._timer = null;
			this._domNode.style.display = "none";
			if (this.onEnd) {
				this.onEnd();
			}
		},
		
		/**
		 * The render process
		 */
		_render: function()
		{
			var _this = this;
			_this._ctx.clearRect(0, 0, _this.size, _this.size);
			
			var i, circles = _this._circles;
			
			for (i = 0; i < circles.length; i++) {
				var circle = circles[i],
					ri = circle.r,
					ri2 = ri + 1;
				
				if (_this._underway && ri < _this._space && ri2 >= _this._space) {
					circles.push({
						r: 0
					});
				}
				circles[i].r = ri2;
				
				if (ri2 > (_this.size / 2)) {
					circles.splice(i, 1);
					i--;
				}
			}
			
			if (circles.length == 0) {
				this._stopRendering();
				return;
			}
			
			var i, circles = _this._circles, l = circles.length;
			for (i = 0; i < l; i++) {
				var circle = circles[i],
					ri = circle.r,
					rgb = _this._rgb,
					alpha = wink.math.round(1 - (ri / (_this.size / 2)), 2),
					ci = "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + (rgb.a * alpha) + ")";
				_drawArc(_this._ctx, _this._cx, _this._cy, ri, ci, _this.linewidth);
			}
		},
		
		/**
		 * Validate the properties of the component
		 * @returns {boolean} True if the properties are valid, false otherwise
		 */
		_validateProperties: function()
		{
			return true;
		},
		
		/**
		 * Initialize the DOM node
		 */
		_initDom: function()
		{
			var _this = this,
				dn = _this._domNode = document.createElement('canvas');
			
			wink.fx.translate(dn, 0, 0);
			
			_this._ctx = dn.getContext('2d');
			
			dn.width = _this.size;
			dn.height = _this.size;
			dn.style.zIndex = 998;
			
			if (_this._underway) {
				_this._circles.push({
					r: 0
				});
				_this._render();
				_this._startRendering();
			}
		},
		
		/**
		 * Initialize the properties
		 */
		_initProperties: function()
		{
			var _this = this,
				_assign = function(p, defaultValue) {
					if (_this[p] === false) {
						_this[p] = false;
						return;
					}
					if (_this[p] === 0) {
						_this[p] = 0;
						return;
					}
					_this[p] = _this[p] || defaultValue;
				};
			
			_assign('size', 200);
			_assign('refreshRate', 50);
			_assign('color', '#000');
			_assign('linewidth', 1);
			_assign('count', 5);
			_assign('underway', true);
			
			_this._cx = _this.size / 2;
			_this._cy = _this.size / 2;
			_this._rgb = _getRGB(_this.color);
			
			_this._space = Math.floor((_this.size / 2) / _this.count);
			_this._circles = [];
			_this._underway = _this.underway;
		}
	};
	
	/**
	 * @ignore
	 */
	var _drawArc = function(ctx, x, y, r, linecolor, linewidth)
	{
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.lineWidth = linewidth;
		ctx.strokeStyle = linecolor || 'transparent';
		ctx.stroke();
	};
	
	/**
	 * @ignore
	 */
	var _getRGB = function(colorS)
	{
		var mt = null,
			rgb = null;
		
		if (!mt) {
			mt = (/^#?([a-fA-F0-9]{1,2})([a-fA-F0-9]{1,2})([a-fA-F0-9]{1,2})$/).exec(colorS);
			if (mt) {
				for (var i = 1; i < 4; i++) {
					mt[i] = mt[i].length == 1 ? mt[i] + mt[i] : mt[i];
				}
				rgb = { r: parseInt(mt[1], 16), g: parseInt(mt[2], 16), b: parseInt(mt[3], 16), a: 1.0 };
			}
		}
		if (!mt) {
			mt = (/[^0-9]*([0-9\.]+)[^0-9]*([0-9\.]+)[^0-9]*([0-9\.]+)[^0-9]*([0-9\.]+)?/).exec(colorS);
			if (mt) {
				rgb = { r: mt[1], g: mt[2], b: mt[3], a: mt[4] || 1.0 };
			}
		}
		return rgb;
	};
	
	return wink.plugins.VisualFeedback;
});