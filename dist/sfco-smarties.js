( function( window, document ) {
	// --------------------------------------------------
	// PRIVATE VARS.
	// --------------------------------------------------
	var config = {
		container: 'smarties_container',
	};

	var priv = {
		count: 0,
		instances: [],
	};

	// --------------------------------------------------
	// PRIVATE FUNCTIONS
	// --------------------------------------------------
	function doSetup() {
		if ( !document.getElementById( '#' + config.container ) ) {
			let containerElem = document.createElement( 'div' );

			containerElem.setAttribute( 'id', config.container );
			containerElem.style.width = '100%';
			containerElem.style.height = '100%';
			containerElem.style.position = 'fixed';
			containerElem.style.top = '0';
			containerElem.style.left = '0';
			containerElem.style.zIndex = '999999';
			containerElem.style.pointerEvents = 'none';

			document.body.appendChild( containerElem );
		}
	}

	function doInsert() {
		// Create element.
		var elem = document.createElement( 'div' );

		// Set attributes.
		elem.setAttribute( 'data-smartie-id', this.id );
		elem.style.width = '100px';
		elem.style.height = '100px';
		elem.style.display = 'block';
		elem.style.background = 'red'; /// TEMP
		elem.style.borderRadius = '50%';
		elem.style.position = 'absolute'; /// TEMP
		elem.style.top = ( Math.floor( Math.random() * 100 ) ) + '%';
		elem.style.left = ( Math.floor( Math.random() * 100 ) ) + '%';

		// Insert into document.
		var target = document.getElementById( config.container );
		target.appendChild( elem );

		// Return element.
		return elem;
	}

	// --------------------------------------------------
	// CONSTRUCTOR
	// --------------------------------------------------
	function Smarties( options ) {
		// Validate options.
		options = ( options && typeof options === 'object' ) ? options : {};

		let interval = options.interval && typeof options.interval === 'number' ? options.interval : 1000;

		// Set instance props.
		this.id = ++priv.count;
		this.createdAt = new Date().getTime();

		doSetup();

		// Initiate 'injection'.
		this.intervalId = setInterval( doInsert.bind( this ), interval );

		// Add current instance to private collection.
		priv.instances.push( this );

		// Return current instance.
		return this;
	}

	// --------------------------------------------------
	// CLASS METHODS
	// --------------------------------------------------
	Smarties.all = function() {
		return priv.instances.slice( 0 );
	}

	Smarties.destroy = function( id ) {
		if ( priv.instances.length ) {
			let matchedTarget = false;

			priv.instances.forEach( function( instance ) {
				if ( !matchedTarget ) {
					if ( instance.id === id ) {
						matchedTarget = true;
						instance.destroy();
					}
				}
			} );
		}

		return priv.instances.slice( 0 );
	}

	Smarties.destroyAll = function() {
		var instanceCount = priv.instances.length;

		if ( instanceCount ) {
			priv.instances.forEach( function( instance ) {
				instance.destroy();
			} );
		}

		return instanceCount;
	}

	// --------------------------------------------------
	// INSTANCE METHODS
	// --------------------------------------------------
	Smarties.prototype.destroy = function() {
		// Capture reference to current execution context.
		var _this = this;

		// Prevent injection of additional nodes.
		clearInterval( this.intervalId );

		// Remove existing notes.
		var elems = document.querySelectorAll( '[data-smartie-id="' + this.id + '"]' );

		if ( elems ) {
			elems.forEach( function( elem ) {
				elem.parentNode.removeChild( elem );
			} );
		}

		// Remove current instance from private data.
		priv.instances = priv.instances.filter( function( instance ) {
			return instance.id !== _this.id;
		} );

		// Return current instance id.
		return this.id;
	}

	// --------------------------------------------------
	// PUBLIC API
	// --------------------------------------------------
	window.Smarties = Smarties;
} )( window, document );
