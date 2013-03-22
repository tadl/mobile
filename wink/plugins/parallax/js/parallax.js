/*--------------------------------------------------------
 * Copyright (c) 2011, The Dojo Foundation
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * @fileOverview A plugin to add a parallax effect.
 * This effect gives an illusion of depth for the elements during the navigation.
 *  
 * @author Kevin AUVINET
 */
define(['../../../_amd/core', '../../../ui/layout/scroller/js/scroller'], function(wink)
{      
    var abs = Math.abs,
        max = Math.max,
        
        fx  = wink.fx;
    
    /**
     * @class Implements a parallax effect navigation
     * 
     * Based on the module "Scroller" of Wink, this plugin allow you to add at your elements some displacements giving a depth illusion.<br />
     * Only the x and y directions for the scroller are enabled.
     * Each displacement can be customed with:
     * <ul>
     *  <li>A direction: x, y, xy, -x, -y, -xy, x-y, -x-y</li>
     *  <li>A depth defined by the zIndex (an element with a zIndex of 0 is more far than an element with a zIndex of 10)</li>
     *  <li>A speed displacement for each direction choosed</li>
     * </ul>
     * <br>
     * You can also enable, or not, the magnetism for each section anchor and the duration of the effect.
     * The layers keys must be your class names for define the different level of your elements.
     * Your sections and your movable elements must be defined with absolute positions in your css.
     * 
     * @param {object} properties The properties object
     * @param {string} properties.target the dom container
     * @param {string} properties.direction The direction of the scrollable area - possible values are "x", "y", or "xy"
     * @param {boolean} properties.activeAnchor Active or not the anchor magnetism for the sections
     * @param {integer} properties.anchorDuration Define the anchor magnetism duration
     * @param {object} properties.layers An associative array with each layers defined in the dom and their properties (direction, zIndex and speed)
     * @param {boolean} properties.elasticity Enables or not an elasticity effect
     * @param {integer} [properties.friction=14] Value that determines the friction forces and influences the deceleration of the movement (value between 1 and 100)
     * 
     * @requires wink.ui.layout.Scroller
     * @requires wink.ux.MovementTracker
     * @requires wink.ux.Inertia
     * 
     * @example
     * 
     *  var properties = 
     *  {
     *      target: "targetElementId",
     *      direction: "x",
     *      activeAnchor: true,
     *      anchorDuration: 1500,
     *      layers: {
     *          "layer1": {direction: 'x',   zIndex: 100, speed: {x: 10.5}},
     *          "layer2": {direction: '-x',  zIndex: 300, speed: {x: 5.5}},
     *          "layer3": {direction: 'y',   zIndex: 400, speed: {y: 0.3}},
     *          "layer4": {direction: '-yx', zIndex: 200, speed: {x: 6.5,  y: 0.3}},
     *          "layer5": {direction: 'xy',  zIndex: 500, speed: {x: 0.3,  y: 1.0}}
     *      }
     *  };
     * 
     * parallax = new wink.plugins.Parallax(properties);
     * 
     * @compatibility IOS 4, IOS 5, IOS 6, Android 3.0 (slow), Android 3.1 (slow), Android 4, BlackBerry PlayBook 2.0, Windows Phone 8
     * 
     * @see <a href="WINK_ROOT_URL/plugins/parallax/test/test_parallax_1.html" target="_blank">Test page (horizontal)</a>
     * @see <a href="WINK_ROOT_URL/plugins/parallax/test/test_parallax_2.html" target="_blank">Test page (vertical)</a>
     * @see <a href="WINK_ROOT_URL/plugins/parallax/test/test_parallax_3.html" target="_blank">Test a concrate case (horizontal)</a>
     * @see <a href="WINK_ROOT_URL/plugins/parallax/test/timeline.html" target="_blank">An animated timeline for Wink</a>
     * 
     */
    wink.plugins.Parallax = function(properties) 
    {
        /**
         * Unique identifier
         * 
         * @property uId
         * @type integer
         */
        this.uId = wink.getUId();
        
        /**
         * Active or not the magnetism to the anchors
         * 
         * @property
         * @type boolean
         * @default true
         */
        this.activeAnchor = true;
        
        /**
         * Define the duration to move at an anchor if it's active
         * 
         * @property
         * @type boolean
         * @default true
         */
        this.anchorDuration = 1000;
        
        /**
         * A tab of layers
         * 
         * @property
         * @type associative array
         */
        this.layers = {};
        
        /**
         * The scroll direction (x or y)
         * 
         * @property
         * @type string
         */
        this.direction = null;
        
        /**
         * Enable or not an elasticity effect
         * 
         * @property
         * @type boolean
         */
        this.elasticity = false;
        
        wink.mixin(this, properties);
        
        this._scroller = null;
        this._interval = null;
        
        this._animationFrame = null;
        
        this._target = wink.byId(properties.target);
        this._sections = wink.query('section.parallax', this._target);
        this._currentSection = null;
        
        this._layersNames = [];
        
        this._scrollPosition = {
            x: 0,
            y: 0
        };
        this._scrollPercentPosition = {
            x: 0, 
            y: 0
        };
        
        this._direction_x = wink.plugins.Parallax.Direction._DIRECTION_X;
        this._direction_y = wink.plugins.Parallax.Direction._DIRECTION_Y;
        
        this._callbacks = {
            startSliding: null,
            sliding: null,
            stopSliding: null
        };
        
        this._initProperties();
        this._initAnimationFrame();
        this._extendsLastSection(this._sections[this._sections.length - 1]);
        this._initScroller();
        this._initDOM();
        
        this.scrollTo(1, 1, 100);
    };
    
    /**
     * Define constant direction values
     */
    wink.plugins.Parallax.Direction = {
        _DIRECTION_X: "x",
        _DIRECTION_Y: "y",
        _DIRECTION_REVERSE_X: "-x",
        _DIRECTION_REVERSE_Y: "-y"
    };
    
    wink.plugins.Parallax.prototype = 
    {
        /**
         * Scroll explicitly to the given position
         * 
         * @param {number} x x targeted coordinates
         * @param {number} y y targeted coordinates
         * @param {integer} [duration=0] The duration of the scroll
         */
        scrollTo: function(x, y, duration) 
        {
            if(this._scrollPosition.x == x
            && this._scrollPosition.y == y) {
                return;
            } 
            
            this._scroller.scrollTo(x, y, duration);
        },
    
        /**
         * Get the current section
         * 
         * return {HTMLElement}
         */
        getCurrentSection: function() {
            var pos = this._scrollPosition;
            var nearest = this._findTheNearestSection(pos.x, pos.y);
            return nearest.section;
        },
    
        /**
         * Initializes properties
         */
        _initProperties: function() 
        {
            // Init layers
            var layers = this.layers;
            for(var layer_id in layers) 
            {
                if(!(layers[layer_id] instanceof wink.plugins.Parallax.Layer)) {
                    var l = layers[layer_id],
                        o = new wink.plugins.Parallax.Layer({
                            id:         layer_id,
                            direction:  l.direction,
                            speed:      l.speed,
                            zIndex:     l.zIndex
                        });
                }
                
                if(wink.isNull(o.id)) {
                    continue;
                }
                
                layers[layer_id] = o;
                this._layersNames.push(layer_id);
            }
            
            // Init size
            if(this._isMoveOn_X_Axis()) {
                fx.apply(this._target, {height: "100%"});
            } else 
            if(this._isMoveOn_Y_Axis()) {
                fx.apply(this._target, {width: "100%"});
            }
            
            // Init callbacks
            this._initCallBacks();
        },
        
        /**
         * Initializes callbacks
         */
        _initCallBacks: function() {
            if(!wink.isSet(this.callbacks))
                return;
            
            var cbs = this.callbacks;
            if(wink.isCallback(cbs.onStartSliding))
                this._callbacks.startSliding = cbs.onStartSliding;
            
            if(wink.isCallback(cbs.onSliding))
                this._callbacks.sliding = cbs.onSliding;
            
            if(wink.isCallback(cbs.onStopSliding))
                this._callbacks.stopSliding = cbs.onStopSliding;
        },
        
        /**
         * Initializes the animation process
         */
        _initAnimationFrame: function() {
            this._animationFrame = new wink.plugins.Parallax.AnimationFrame({
                context: this,
                method: '_onScrolling'
            });
        },
        
        /**
         * Return an object which will be used for the callback arguments
         * 
         * @return {object}
         */
        _getArgs: function() {
            return {
                posX: abs(this._scrollPosition.x),
                posY: abs(this._scrollPosition.y)
            };
        },
        
        /**
         * Places all "movable" elements at a specific position such as these 
         * elements will be at a good position when the user will put the focus on their section.
         * 
         * @param {HTMLElement} section
         * @param {HTMLElement} movable_wrapper
         * @param {wink.plugins.Parallax.Layer} layer
         */
        _shiftsSectionElements: function(section, movable_wrapper, layer) 
        {   
            // If no layer, continue
            if(wink.isNull(layer.getDomNode())) {
                return;
            }
            
            var section_perc_x = 0, 
                section_perc_y = 0,
                view_props = this._scroller.getViewProperties();
            
            // horizontal offset
            if(this._isMoveOn_X_Axis()) {
                section_perc_x = (section.offsetLeft * 100) / view_props.limitX,
                section_perc_y = (section.offsetLeft * 100) / view_props.limitX;
            }
        
            // vertical offset
            if(this._isMoveOn_Y_Axis()) {
                section_perc_x = (section.offsetTop * 100) / view_props.limitY,
                section_perc_y = (section.offsetTop * 100) / view_props.limitY;
            }
            
            var dec_x = layer.speed.x * section_perc_x,
                dec_y = layer.speed.y * section_perc_y;
            
            // The horizontal direction
            var left = 0;
            if(layer.isRightToLeft()) {
                left = (movable_wrapper.offsetLeft + dec_x)+'px';
            } else 
            if(layer.isLeftToRight()) {
                left = (movable_wrapper.offsetLeft - dec_x)+'px';
            }
            
            // The vertical direction
            var top = 0;
            if(layer.isBottomToTop()) {
                top = (movable_wrapper.offsetTop + dec_y)+'px';
            } else 
            if(layer.isTopToBottom()) {
                top = (movable_wrapper.offsetTop - dec_y)+'px';
            }
        
            fx.apply(movable_wrapper, {
                'left': left,
                'top': top
            });
        },
        
        /**
         * Build the wrapper of the movable elements 
         * which will be moved in the layers elements after
         * 
         * @param {HTMLElement} section
         */
        _buildLayerWrapper: function(section)
        {
            // Find parallax elements
            var movables = wink.query('.parallax', section),
                adjustWidth  = wink.ua.isIE ? 1 : 0; // missing 1px on IE
            
            // For each movables, build div layer wrapper 
            for(var i=0, l=movables.length; i<l; i++)
            {
                var movable = movables[i],
                    layer_id = movable.className.match(eval('/('+this._layersNames.join('|')+')/'))[0],
                    layer = this.layers[layer_id];
                
                if(!wink.isSet(layer)) {
                    continue;
                }
                
                // create div for a layer if not exists
                if(wink.isNull(layer.getDomNode())) {
                    layer.build(this._target);
                }
                
                // create wrapper for elements of the same div
                var para_wrapper = document.createElement('div');
                wink.addClass(para_wrapper, "wrapper-element");
                wink.addClass(para_wrapper, movable.parentNode.id);
                fx.apply(para_wrapper, {
                    position: 'absolute',
                    width: (movable.scrollWidth + adjustWidth)+'px'
                });
                
                var top = parseInt(section.offsetTop + movable.offsetTop),
                    left= parseInt(section.offsetLeft + movable.offsetLeft);
                fx.translate(para_wrapper, left, top);
                
                layer.addChild(para_wrapper);
                
                // add element into the new wrapper div and remove elem from the section
                var n_elem = movable.cloneNode(true);
                para_wrapper.appendChild(n_elem);
                section.removeChild(movable);
                
                // Decale elements according to this position and the speed of this layer
                this._shiftsSectionElements(section, para_wrapper, layer);
            }
        },
        
        /**
         * Gets all elements which will move and for each element 
         * regroup them by layer which will have a direction and a speed rate
         */
        _initDOM: function()
        {
            for(var i=0, l=this._sections.length; i<l; i++) {
                this._buildLayerWrapper(this._sections[i]);
            }
        },
        
        /**
         * Enlarged the last section for keep elements at the good position
         * 
         * @param {HTMLElement} section
         */
        _extendsLastSection: function(section)
        {
            if(this._isMoveOn_X_Axis()) {
                var padding_w = (window.innerWidth - section.offsetWidth);
                fx.apply(this._target, {
                    width: (this._target.offsetWidth + padding_w) + 'px'
                });
            }
            else
            if(this._isMoveOn_Y_Axis()) {
                var padding_h = (window.innerHeight - section.offsetHeight);
                fx.apply(this._target, {
                    height: (this._target.offsetHeight + padding_h) + 'px'
                });
            }
        },
        
        /**
         * Initializes Scroller object that we used
         */
        _initScroller: function()
        {
            if(wink.isNull(this._scroller)) 
            {
                this.callbacks = {
                    scrolling:      { context: this, method: '_onScrolling'     },
                    startSliding:   { context: this, method: '_onStartSliding'  },
                    stopSliding:    { context: this, method: '_onStopSliding'   }
                }
                
                this._scroller = new wink.ui.layout.Scroller(this);
                
                if(this.elasticity == false) {
                    var _obj = this;
                    this._scroller._handleMovementStored = function(publishedInfos) {
                        _obj._handleMovementStored.apply(this, [publishedInfos, _obj]);
                    };
                }
                
                // Remove after scroller initialization
                delete this.callbacks;
            }
        },
        
        /**
         * @override 
         * @fileOverview ui\layout\scroller\js\scroller.js
         */
        _handleMovementStored: function(publishedInfos, _obj) {
            var publisher = publishedInfos.publisher;
			if (publisher.uId != this._inertia.uId) {
				return;
			}
			
            if (this._activated == false) {
				return;
			}
            
			if (wink.isSet(this._callbacks.endScrolling)) {
				wink.call(this._callbacks.endScrolling, { uxEvent: publishedInfos.uxEvent });
			}
			
			var movement = publishedInfos.movement;
			this._interpretInertia(movement);
            
            if(_obj.activeAnchor == true || movement.destX > 0 || movement.destX < this._view.limitX) {    
                var pos = _obj._findTheNearestSection(movement.destX, movement.destY);
                    movement.destX = -pos.x;
                    movement.destY = -pos.y;
            }
            
			if (!this._moveOutside && !this._isAtPosition(movement.destX, movement.destY)) {
                this._slideTo(movement.destX, movement.destY, { duration: movement.duration, speed: movement.speed });
			} else {
				this._backToBounds();
				this._hideScrollbars();
			}
        },
        
        /**
         * Event called when the sliding effect starts
         */
        _onStartSliding: function()
        {
            if(!this._animationFrame.isRunning()) {
                this._animationFrame.start();
                
                if(wink.isCallback(this._callbacks.startSliding)) {
                    wink.call(this._callbacks.startSliding, this._getArgs());
                }
            }
        },
        
        /**
         * Event called when the sliding effect stops
         */
        _onStopSliding: function()
        {   
            this._animationFrame.stop();
            
            if(wink.isCallback(this._callbacks.stopSliding)) {
                wink.call(this._callbacks.stopSliding, this._getArgs());
            }
            
            if(this.activeAnchor || (true == this.elasticity && this._isOutBounds())) {
                this._slideToNearSection();
            }
        },
        
        /**
         * Event called during the sliding effect 
         */
        _onScrolling: function() {
            this._scrollPosition = fx.getTransformPosition(this._target);
            
            this._scrollPercentPosition.x = ((this._scrollPosition.x * 100) / this._scroller.getViewProperties().limitX) || 0;
            this._scrollPercentPosition.y = ((this._scrollPosition.y * 100) / this._scroller.getViewProperties().limitY) || 0;
            
            if(wink.isCallback(this._callbacks.sliding)) {
                wink.call(this._callbacks.sliding, this._getArgs());
            }
            
            this._moveElements();
        },
        
        /**
         * Moves layers for to give the parallax effect
         */
        _moveElements: function() 
        {   
            for(var layer_id in  this.layers) 
            {
                if(wink.isNull(this.layers[layer_id].getDomNode())) {
                    continue;
                }
                
                this.layers[layer_id].moveTo(
                    this.direction, 
                    this._scrollPercentPosition);
            }
        },
        
        /**
         * Scrolls to the nearest section
         */
        _slideToNearSection: function() {
            var nearest = this._findTheNearestSection(
                this._scrollPosition.x, 
                this._scrollPosition.y);
            
            if(nearest.min > 1) {
                this.scrollTo(-nearest.x, -nearest.y, this.anchorDuration);
            }
        },
        
        /**
         * Finds and returns the nearest section
         * 
         * @return {object} the position (x, y) of the nearest section and this distance (min)
         */
        _findTheNearestSection: function(destX, destY) 
        {
            var pos_x = -destX, 
                pos_y = -destY;
            
            var find = {
                    section: null,
                    min: null,
                    x: null,
                    y: null
                };
            
            var distance    = 0, 
                offsetLeft  = 0, 
                offsetTop   = 0,
                section     = null;
                
            for(var i=0, l=this._sections.length; i<l; i++) 
            {
                section = this._sections[i];
                offsetLeft = section.offsetLeft;
                offsetTop = section.offsetTop;
                
                distance = 0;
                if(this._isMoveOn_X_Axis()) {
                    distance = abs(pos_x - offsetLeft);
                } else
                if(this._isMoveOn_Y_Axis()) {
                    distance = abs(pos_y - offsetTop);
                }
                
                if(wink.isNull(find.min) || find.min > distance) {
                    find = {
                        'section': section,
                        'min': distance,
                        'x': offsetLeft,
                        'y': offsetTop
                    };
                }
            }
            
            return find;
        },
        
        /**
         * @return {boolean} true if the scroll direction is horizontal or false otherwise
         */
        _isMoveOn_X_Axis: function() {
            return this.direction == this._direction_x;
        },
        
        /**
         * @return {boolean} true if the scroll direction is vertical or false otherwise
         */
        _isMoveOn_Y_Axis: function() {
            return this.direction == this._direction_y;
        },
        
        /**
         * @return {boolean} true if the scroll position is out of the bounds or false otherwise
         */
        _isOutBounds: function() {
            var pos  = this._scrollPosition,
                view = this._scroller.getViewProperties();
                
            var res = null;
            if(this._isMoveOn_X_Axis()) {
                res = pos.x > 0 || pos.x < view.limitX;
            } else
            if(this._isMoveOn_Y_Axis()) {
                res = pos.y > 0 || pos.y < view.limitX;
            } 
            
            return res;
        }
    };
    
    /**
     * @class Manage a layer for the parallax effect
     * 
     * @param {object} properties The properties object
     * @param {direction} properties.direction The direction : possible values are "x", "y", "xy", "-x", "-y", "-xy", "x-y" or "-x-y"
     * @param {integer} [properties.zIndex=0] The z-index of the layer
     * @param {object} [properties.speed] The speed displacement of the layer in x and y axis
     */
    wink.plugins.Parallax.Layer = function(properties) 
    {
        /**
         * Unique identifier
         * 
         * @property uId
         * @type integer
         */
        this.uId            = wink.getUId();
        
        this.id             = null;
        this.direction      = null;
        this.zIndex         = 0;
        
        this.speed          =  {
            x: 0, 
            y: 0
        }
        
        this._x_axis        = null;
        this._y_axis        = null;
        
        this._dom_node      = null;
        this._offset_left   = null;
        this._offset_top    = null;
        
        this._direction_x = wink.plugins.Parallax.Direction._DIRECTION_X;
        this._direction_y = wink.plugins.Parallax.Direction._DIRECTION_Y;
        this._direction_reverse_x = wink.plugins.Parallax.Direction._DIRECTION_REVERSE_X;
        this._direction_reverse_y = wink.plugins.Parallax.Direction._DIRECTION_REVERSE_Y;
        
        wink.mixin(this, properties);
        
        if (this._validateProperties() === false) {
            return;
        }
        
        this._parseDirection();
    };
    
    wink.plugins.Parallax.Layer.prototype = 
    {
        /**
         * Builds the layer dom node element and appends to this parent
         * 
         * @param {HTMLElement} parentNode
         */
        build: function(parentNode) 
        {
            var elem = document.createElement('div');
                elem.id = this.id;
            wink.addClass('parallax');
            fx.apply(elem, { 
                position: "absolute",
                top: "0px",
                left: "0px",
                zIndex: this.zIndex
            });
            
            parentNode.appendChild(elem);
            
            // Initializes the DOM properties just one time
            this._dom_node      = wink.byId(this.id);
            this._offset_left   = this._dom_node.offsetLeft;
            this._offset_top    = this._dom_node.offsetTop;
            
            return elem;
        },
        
        /**
         * Add child to the layer
         * @param {HTMLElement} childNode
         */
        addChild: function(childNode) {
            var layerNode = this.getDomNode(); 
            if(wink.isNull(layerNode)) {
                return;
            }
            
            layerNode.appendChild(childNode);
        },
        
        /**
         * @return {HTMLElement} the layer dom node element
         */
        getDomNode: function() {
            return this._dom_node;
        },
        
        /**
         * Moves the layer according to the scroll direction 
         * and the scroll position in percentage
         * 
         * @param {wink.plugins.Parallax.Direction} scroll_direction
         * @param {object} pos_percent: The position in percent {x, y}
         */
        moveTo: function(scroll_direction, pos_percent) 
        {
            var left = this._offset_left,
                top  = this._offset_top;
                
            if(scroll_direction == this._direction_x) 
            {    
                if(this.isLeftToRight() || this.isRightToLeft()) {
                    left = pos_percent.x * this.speed.x;
                }
                
                if(this.isTopToBottom() || this.isBottomToTop()) {
                    top  = pos_percent.x * this.speed.y;
                }
            } else 
            if(scroll_direction == this._direction_y) 
            {
                if(this.isLeftToRight() || this.isRightToLeft()) {
                    left = pos_percent.y * this.speed.x;
                }
                
                if(this.isTopToBottom() || this.isBottomToTop()) {
                    top  = pos_percent.y * this.speed.y;
                }
            }
            
            if(!this.isRightToLeft()) {
                left = -left;
            }
            
            if(!this.isBottomToTop()) {
                top = -top;
            }
            
            fx.translate(this.getDomNode(), left, top);
        },
        
        /**
         * @return {boolean} True if elements move from the left to the right, false otherwise
         */
        isLeftToRight: function() {
            return this._x_axis != null 
                && this._x_axis == this._direction_x;
        },
        
        /**
         * @return {boolean} True if elements move from the right to the letf, false otherwise
         */
        isRightToLeft: function() {
            return this._x_axis != null 
                && this._x_axis == this._direction_reverse_x;
        },
        
        /**
         * @return {boolean} True if elements move from the top to the bottom, false otherwise
         */
        isTopToBottom: function() {
            return this._y_axis != null 
                && this._y_axis == this._direction_y;
        },
        
        /**
         * @return {boolean} True if elements move from the bottom to the top, false otherwise
         */
        isBottomToTop: function() {
            return this._y_axis != null 
                && this._y_axis == this._direction_reverse_y;
        },
        
        /**
         * Validate the properties of the component
         */
        _validateProperties: function() 
        {
            if(wink.isNull(this.id) || !this.id.match(/^[a-z0-9]+$/i)) {
                wink.log('[Layer] Error: The id "'+this.id+'" is not correct');
                return false;
            }
            
            if((wink.isNull(this.direction))
                || (!this.direction.match(eval('/'+this._direction_x+'/i')) 
                    &&  !this.direction.match(eval('/'+this._direction_y+'/i')))) {
                wink.log('[Layer] Error: The direction is not correct for the layer "'+this.id+'"');
                return false;
            }
            
            if(!wink.isNumber(this.zIndex)) {
                wink.log('[Layer] Error: The zIndex given is not correct for the layer "'+this.id+'"');
                return false;
            }
            
            return true;
        },
        
        /**
         * Parse the layer direction given by the user
         */
        _parseDirection: function() 
        {
            // Check for "x" axis
            if(this.direction.match(eval('/'+this._direction_reverse_x+'/i'))) {
                this._x_axis = this._direction_reverse_x;
            } else
            if(this.direction.match(eval('/'+this._direction_x+'/i'))) {
                this._x_axis = this._direction_x;
            }
        
            // Check for "y" axis
            if(this.direction.match(eval('/'+this._direction_reverse_y+'/i'))) {
                this._y_axis = this._direction_reverse_y;
            } else 
            if(this.direction.match(eval('/'+this._direction_y+'/i'))) {
                this._y_axis = this._direction_y;
            }
        }
    };
    
    
    /**
     * @class Class for manage an animation frame
     * 
     * @param {callback} cb: A callback function or a callback object with as parameters "context" and "method"
     */
    wink.plugins.Parallax.AnimationFrame = function(cb) 
    {
        /**
         * Unique identifier
         * 
         * @property uId
         * @type integer
         */
        this.uId                    = wink.getUId();
        
        /**
         * A callback
         * 
         * @property callback
         * @type function or callback object
         */
        this.callback               = cb;
        
        this._callback              = null;
        this._lastTime              = 0;
        this._interval              = null;
        this._vendors               = ['ms', 'moz', 'webkit', 'o'];
        
        this._requestAnimationFrame = null;
        this._cancelAnimationFrame  = null;
        
        this._initAnimationFrame();
    };
    
    wink.plugins.Parallax.AnimationFrame.prototype = 
    {
        /**
         * Start the requestAnimationFrame
         */
        start: function() {
            this._interval = wink.call(this._requestAnimationFrame, wink.bind(function(t) {
                wink.call(this.callback, t);
                this.start();
            }, this), window);
        },
        
        /**
         * Stop the requestAnimationFrame
         */
        stop: function() {
            wink.bind(wink.call(this._cancelAnimationFrame, this._interval), window);
            this._interval = null;
        },
        
        /**
         * Check if the requestAnimationFrame is running
         * 
         * @return {boolean} True if is running or false otherwise
         */
        isRunning: function() {
            return !wink.isNull(this._interval);
        },
        
        /**
         * Initializes and creates a requestAnimationFrame (RaF) object 
         * according to the browser used
         */
        _initAnimationFrame: function() 
        {
            // Get function from vendor if exists
            this._requestAnimationFrame = window.requestAnimationFrame;
            for(var i=0, l=this._vendors.length; i < l && !this._requestAnimationFrame; ++i) {
                this._requestAnimationFrame = window[this._vendors[i]+'RequestAnimationFrame'];
                this._cancelAnimationFrame  = window[this._vendors[i]+'CancelAnimationFrame']
                || window[this._vendors[i]+'CancelRequestAnimationFrame'];
            }
            
            if(!this._requestAnimationFrame) 
            {
                this._requestAnimationFrame = function(callback) {
                    var currTime = new Date().getTime(),
                        timeToCall = max(0, 16 - (currTime - this._lastTime));
                    
                    var interval = window.setTimeout(function() { 
                        callback(currTime + timeToCall); 
                    }, timeToCall);
                    
                    this._lastTime = currTime + timeToCall;
                    
                    return interval;
                };
            }
            
            if(!this._cancelAnimationFrame) {
                this._cancelAnimationFrame = function(interval) {
                    clearTimeout(interval);
                };
            }
        }
    };
    
    return wink.plugins.Parallax;
});
