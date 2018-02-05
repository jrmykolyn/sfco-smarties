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
	function Smarties(options) {
		// Capture reference to new instance.
		var _this = this;

		// Validate options.
		options = options && typeof options === 'object' ? options : {};

		// Set instance props.
		_this.id = ++priv.count;

		_this.intervalLength = options.intervalLength && typeof options.intervalLength === 'number' ? options.intervalLength : defaults.intervalLength;
		_this.delay = options.delay && typeof options.delay === 'number' ? options.delay : null;

		_this.backgroundColors = options.backgroundColors && Array.isArray(options.backgroundColors) ? options.backgroundColors : ['#ddd'];
		_this.sizes = options.sizes && Array.isArray(options.sizes) ? options.sizes : ['50px'];
		_this.images = options.images && Array.isArray(options.images) ? options.images : null;
		_this.forceBackgroundColor = !!options.forceBackgroundColor;

		_this.nodes = [];
		_this.callbacks = options.callbacks && typeof options.callbacks === 'object' ? options.callbacks : {};

		_this.createdAt = new Date().getTime();

		doSetup();

		// Initiate 'injection'.
		// NOTE: Only wrap initialization in `setTimeout` if `delay` provided (no need bump execution to end queue otherwise).
		if (_this.delay) {
			_this.timeoutId = setTimeout(function () {
				_this.intervalId = setInterval(_this.insert.bind(_this), _this.intervalLength);
			}, _this.delay);
		} else {
			_this.intervalId = setInterval(_this.insert.bind(_this), _this.intervalLength);
		}

		// Add current instance to private collection.
		priv.instances.push(_this);

		// Return current instance.
		return _this;
	}

	// --------------------------------------------------
	// CLASS METHODS
	// --------------------------------------------------
	Smarties.all = function () {
		return priv.instances.slice(0);
	};

	Smarties.destroy = function (id) {
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
	};

	Smarties.destroyAll = function () {
		var instanceCount = priv.instances.length;

		if (instanceCount) {
			priv.instances.forEach(function (instance) {
				instance.destroy();
			});
		}

		return instanceCount;
	};

	// --------------------------------------------------
	// INSTANCE METHODS
	// --------------------------------------------------
	Smarties.prototype.destroy = function () {
		// Capture reference to current execution context.
		var _this = this;

		// Preject initial inject if instantiated with `delay`.
		clearTimeout(_this.timeoutId);

		// Prevent injection of additional nodes.
		clearInterval(_this.intervalId);

		// Remove existing nodes.
		if (Array.isArray(_this.nodes) && _this.nodes.length) {
			_this.nodes.forEach(function (node) {
				node.parentNode.removeChild(node);
			});

			_this.nodes = [];
		}

		// Remove current instance from private data.
		priv.instances = priv.instances.filter(function (instance) {
			return instance.id !== _this.id;
		});

		// Return current instance id.
		return _this.id;
	};

	Smarties.prototype.insert = function () {
		// Capture reference to current execution context.
		var _this = this;

		// Create element.
		var elem = document.createElement('div');

		// Set attributes.
		elem.setAttribute('data-smartie-id', _this.id);

		// Set styles: dimensions.
		var size = _this.sizes[Math.floor(Math.random() * _this.sizes.length)];

		elem.style.width = size;
		elem.style.height = size;

		// Set styles: position.
		elem.style.position = 'absolute';
		elem.style.top = Math.floor(Math.random() * 100) + '%';
		elem.style.left = Math.floor(Math.random() * 100) + '%';

		// Set styles: background.
		var backgroundColor = _this.backgroundColors[Math.floor(Math.random() * _this.backgroundColors.length)];
		var backgroundImage;

		if (_this.images) {
			backgroundImage = _this.images[Math.floor(Math.random() * _this.images.length)];
			backgroundImage = 'url(' + backgroundImage + ')';
			elem.style.backgroundImage = backgroundImage;
		}

		if (!backgroundImage || _this.forceBackgroundColor) {
			elem.style.backgroundColor = backgroundColor;
		}

		elem.style.backgroundPosition = 'center';
		elem.style.backgroundSize = 'contain';
		elem.style.backgroundRepeat = 'no-repeat';

		// Set styles: misc.
		elem.style.display = 'block';
		elem.style.borderRadius = '50%';

		// Add new `elem` to node list.
		_this.nodes.push(elem);

		// Invoke `preInsert` callback if applicable.
		if (_this.callbacks.preInsert && typeof _this.callbacks.preInsert === 'function') {
			_this.callbacks.preInsert.call(_this, elem);
		}

		// Insert into document.
		var target = document.getElementById(config.container);
		target.appendChild(elem);

		// Invoke `postInsert` callback if applicable.
		if (_this.callbacks.postInsert && typeof _this.callbacks.postInsert === 'function') {
			_this.callbacks.postInsert.call(_this, elem);
		}

		return _this;
	};

	Smarties.prototype.stop = function () {
		var _this = this;

		clearInterval(_this.intervalId);

		return _this;
	};

	Smarties.prototype.start = function () {
		var _this = this;

		_this.intervalId = setInterval(_this.insert.bind(_this), _this.intervalLength || defaults.intervalLength);

		return _this;
	};

	// --------------------------------------------------
	// PUBLIC API
	// --------------------------------------------------
	window.Smarties = Smarties;
})(window, document);