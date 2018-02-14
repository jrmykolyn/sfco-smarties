'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document) {
	// --------------------------------------------------
	// PRIVATE VARS.
	// --------------------------------------------------
	var config = {
		container: 'smarties_container'
	};

	var defaults = {
		intervalLength: 1000
	};

	var priv = {
		count: 0,
		instances: []
	};

	// --------------------------------------------------
	// PRIVATE FUNCTIONS
	// --------------------------------------------------
	function doSetup() {
		if (!document.getElementById('#' + config.container)) {
			var containerElem = document.createElement('div');

			containerElem.setAttribute('id', config.container);
			containerElem.style.width = '100%';
			containerElem.style.height = '100%';
			containerElem.style.position = 'fixed';
			containerElem.style.top = '0';
			containerElem.style.left = '0';
			containerElem.style.zIndex = '999999';
			containerElem.style.pointerEvents = 'none';

			document.body.appendChild(containerElem);
		}
	}

	// --------------------------------------------------
	// CONSTRUCTOR
	// --------------------------------------------------

	var Smarties = function () {
		_createClass(Smarties, null, [{
			key: 'all',

			// --------------------------------------------------
			// CLASS METHODS
			// --------------------------------------------------
			value: function all() {
				return priv.instances.slice(0);
			}
		}, {
			key: 'destroy',
			value: function destroy(id) {
				if (priv.instances.length) {
					var matchedTarget = false;

					priv.instances.forEach(function (instance) {
						if (!matchedTarget) {
							if (instance.id === id) {
								matchedTarget = true;
								instance.destroy();
							}
						}
					});
				}

				return priv.instances.slice(0);
			}
		}, {
			key: 'destroyAll',
			value: function destroyAll() {
				var instanceCount = priv.instances.length;

				if (instanceCount) {
					priv.instances.forEach(function (instance) {
						instance.destroy();
					});
				}

				return instanceCount;
			}

			// --------------------------------------------------
			// INSTANCE METHODS
			// --------------------------------------------------

		}]);

		function Smarties(options) {
			var _this = this;

			_classCallCheck(this, Smarties);

			// Validate options.
			options = options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' ? options : {};

			// Set instance props.
			this.id = ++priv.count;

			this.intervalLength = options.intervalLength && typeof options.intervalLength === 'number' ? options.intervalLength : defaults.intervalLength;
			this.delay = options.delay && typeof options.delay === 'number' ? options.delay : null;

			this.backgroundColors = options.backgroundColors && Array.isArray(options.backgroundColors) ? options.backgroundColors : ['#ddd'];
			this.sizes = options.sizes && Array.isArray(options.sizes) ? options.sizes : ['50px'];
			this.images = options.images && Array.isArray(options.images) ? options.images : null;
			this.forceBackgroundColor = !!options.forceBackgroundColor;

			this.nodes = [];
			this.callbacks = options.callbacks && _typeof(options.callbacks) === 'object' ? options.callbacks : {};

			this.createdAt = new Date().getTime();

			doSetup();

			// Initiate 'injection'.
			// NOTE: Only wrap initialization in `setTimeout` if `delay` provided (no need bump execution to end queue otherwise).
			if (this.delay) {
				this.timeoutId = setTimeout(function () {
					_this.intervalId = setInterval(_this.insert.bind(_this), _this.intervalLength);
				}, this.delay);
			} else {
				this.intervalId = setInterval(this.insert.bind(this), this.intervalLength);
			}

			// Add current instance to private collection.
			priv.instances.push(this);

			// Return current instance.
			return this;
		}

		_createClass(Smarties, [{
			key: 'destroy',
			value: function destroy() {
				var _this2 = this;

				// Preject initial inject if instantiated with `delay`.
				clearTimeout(this.timeoutId);

				// Prevent injection of additional nodes.
				clearInterval(this.intervalId);

				// Remove existing nodes.
				if (Array.isArray(this.nodes) && this.nodes.length) {
					this.nodes.forEach(function (node) {
						node.parentNode.removeChild(node);
					});

					this.nodes = [];
				}

				// Remove current instance from private data.
				priv.instances = priv.instances.filter(function (instance) {
					return instance.id !== _this2.id;
				});

				// Return current instance id.
				return this.id;
			}
		}, {
			key: 'insert',
			value: function insert() {
				// Create element.
				var elem = document.createElement('div');

				// Set attributes.
				elem.setAttribute('data-smartie-id', this.id);

				// Set styles: dimensions.
				var size = this.sizes[Math.floor(Math.random() * this.sizes.length)];

				elem.style.width = size;
				elem.style.height = size;

				// Set styles: position.
				elem.style.position = 'absolute';
				elem.style.top = Math.floor(Math.random() * 100) + '%';
				elem.style.left = Math.floor(Math.random() * 100) + '%';
				elem.style.transform = 'translate( -50%, -50% )';

				// Set styles: background.
				var backgroundColor = this.backgroundColors[Math.floor(Math.random() * this.backgroundColors.length)],
				    backgroundImage = void 0;

				if (this.images) {
					backgroundImage = this.images[Math.floor(Math.random() * this.images.length)];
					backgroundImage = 'url(' + backgroundImage + ')';
					elem.style.backgroundImage = backgroundImage;
				}

				if (!backgroundImage || this.forceBackgroundColor) {
					elem.style.backgroundColor = backgroundColor;
				}

				elem.style.backgroundPosition = 'center';
				elem.style.backgroundSize = 'contain';
				elem.style.backgroundRepeat = 'no-repeat';

				// Set styles: misc.
				elem.style.display = 'block';
				elem.style.borderRadius = '50%';

				// Add new `elem` to node list.
				this.nodes.push(elem);

				// Invoke `preInsert` callback if applicable.
				if (this.callbacks.preInsert && typeof this.callbacks.preInsert === 'function') {
					this.callbacks.preInsert.call(this, elem);
				}

				// Insert into document.
				var target = document.getElementById(config.container);
				target.appendChild(elem);

				// Invoke `postInsert` callback if applicable.
				if (this.callbacks.postInsert && typeof this.callbacks.postInsert === 'function') {
					this.callbacks.postInsert.call(this, elem);
				}

				return this;
			}
		}, {
			key: 'stop',
			value: function stop() {
				// Invoke `preStop` callback if applicable.
				if (typeof this.callbacks.preStop === 'function') {
					this.callbacks.preStop.call(this, this.nodes);
				}

				clearInterval(this.intervalId);

				// Invoke `postStop` callback if applicable.
				if (typeof this.callbacks.postStop === 'function') {
					this.callbacks.postStop.call(this, this.nodes);
				}

				return this;
			}
		}, {
			key: 'start',
			value: function start() {
				// Invoke `preStart` callback if applicable.
				if (typeof this.callbacks.preStart === 'function') {
					this.callbacks.preStart.call(this, this.nodes);
				}

				this.intervalId = setInterval(this.insert.bind(this), this.intervalLength || defaults.intervalLength);

				// Invoke `postStart` callback if applicable.
				if (typeof this.callbacks.postStart === 'function') {
					this.callbacks.postStart.call(this, this.nodes);
				}

				return this;
			}
		}]);

		return Smarties;
	}();

	// --------------------------------------------------
	// PUBLIC API
	// --------------------------------------------------


	window.Smarties = Smarties;
})(window, document);