// --------------------------------------------------
// PRIVATE VARS.
// --------------------------------------------------
const config = {
	container: 'smarties_container',
};

const defaults = {
	intervalLength: 1000,
};

const priv = {
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

// --------------------------------------------------
// DECLARE CLASSES
// --------------------------------------------------
class Smarties {
	// CLASS METHODS
	static all() {
		return priv.instances.slice( 0 );
	}

	static destroy( id ) {
		if ( priv.instances.length ) {
			let matchedTarget = false;

			priv.instances.forEach( ( instance ) => {
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

	static destroyAll() {
		let instanceCount = priv.instances.length;

		if ( instanceCount ) {
			priv.instances.forEach( ( instance ) => {
				instance.destroy();
			} );
		}

		return instanceCount;
	}

	// INSTANCE METHODS
	constructor( options ) {
		// Validate options.
		options = ( options && typeof options === 'object' ) ? options : {};

		// Set instance props.
		this.id = ++priv.count;

		this.intervalLength = options.intervalLength && typeof options.intervalLength === 'number' ? options.intervalLength : defaults.intervalLength;
		this.delay = options.delay && typeof options.delay === 'number' ? options.delay : null;

		this.backgroundColors = options.backgroundColors && Array.isArray( options.backgroundColors ) ? options.backgroundColors : [ '#ddd' ];
		this.sizes = options.sizes && Array.isArray( options.sizes ) ? options.sizes : [ '50px' ];
		this.images = options.images && Array.isArray( options.images ) ? options.images : null;
		this.forceBackgroundColor = !!options.forceBackgroundColor;

		this.nodes = [];
		this.callbacks = ( options.callbacks && typeof options.callbacks === 'object' ) ? options.callbacks : {};

		this.createdAt = new Date().getTime();

		doSetup();

		// Initiate 'injection'.
		// NOTE: Only wrap initialization in `setTimeout` if `delay` provided (no need bump execution to end queue otherwise).
		if ( this.delay ) {
			this.timeoutId = setTimeout( () => {
				this.intervalId = setInterval( this.insert.bind( this ), this.intervalLength );
			}, this.delay );
		} else {
			this.intervalId = setInterval( this.insert.bind( this ), this.intervalLength );
		}

		// Add current instance to private collection.
		priv.instances.push( this );

		// Return current instance.
		return this;
	}

	destroy() {
		// Preject initial inject if instantiated with `delay`.
		clearTimeout( this.timeoutId );

		// Prevent injection of additional nodes.
		clearInterval( this.intervalId );

		// Remove existing nodes.
		if ( Array.isArray( this.nodes ) && this.nodes.length ) {
			this.nodes.forEach( ( node ) => {
				node.parentNode.removeChild( node );
			} );

			this.nodes = [];
		}

		// Remove current instance from private data.
		priv.instances = priv.instances.filter( ( instance ) => {
			return instance.id !== this.id;
		} );

		// Return current instance id.
		return this.id;
	}

	insert() {
		// Create element.
		let elem = document.createElement( 'div' );

		// Set attributes.
		elem.setAttribute( 'data-smartie-id', this.id );

		// Set styles: dimensions.
		let size = this.sizes[ Math.floor( Math.random() * this.sizes.length ) ];

		elem.style.width = size;
		elem.style.height = size;

		// Set styles: position.
		elem.style.position = 'absolute';
		elem.style.top = ( Math.floor( Math.random() * 100 ) ) + '%';
		elem.style.left = ( Math.floor( Math.random() * 100 ) ) + '%';
		elem.style.transform = 'translate( -50%, -50% )';

		// Set styles: background.
		let backgroundColor = this.backgroundColors[ Math.floor( Math.random() * this.backgroundColors.length ) ],
			backgroundImage;

		if ( this.images ) {
			backgroundImage = this.images[ Math.floor( Math.random() * this.images.length ) ];
			backgroundImage = 'url(' + backgroundImage + ')';
			elem.style.backgroundImage = backgroundImage;
		}

		if ( !backgroundImage || this.forceBackgroundColor ) {
			elem.style.backgroundColor = backgroundColor;
		}

		elem.style.backgroundPosition = 'center';
		elem.style.backgroundSize = 'contain';
		elem.style.backgroundRepeat = 'no-repeat';

		// Set styles: misc.
		elem.style.display = 'block';
		elem.style.borderRadius = '50%';

		// Add new `elem` to node list.
		this.nodes.push( elem );

		// Invoke `preInsert` callback if applicable.
		if ( this.callbacks.preInsert && typeof this.callbacks.preInsert === 'function' ) {
			this.callbacks.preInsert.call( this, elem );
		}

		// Insert into document.
		let target = document.getElementById( config.container );
		target.appendChild( elem );

		// Invoke `postInsert` callback if applicable.
		if ( this.callbacks.postInsert && typeof this.callbacks.postInsert === 'function' ) {
			this.callbacks.postInsert.call( this, elem );
		}

		return this;
	}

	stop() {
		// Invoke `preStop` callback if applicable.
		if ( typeof this.callbacks.preStop === 'function' ) {
			this.callbacks.preStop.call( this, this.nodes );
		}

		clearInterval( this.intervalId );

		// Invoke `postStop` callback if applicable.
		if ( typeof this.callbacks.postStop === 'function' ) {
			this.callbacks.postStop.call( this, this.nodes );
		}

		return this;
	}

	start() {
		// Invoke `preStart` callback if applicable.
		if ( typeof this.callbacks.preStart === 'function' ) {
			this.callbacks.preStart.call( this, this.nodes );
		}

		this.intervalId = setInterval( this.insert.bind( this ), this.intervalLength || defaults.intervalLength );

		// Invoke `postStart` callback if applicable.
		if ( typeof this.callbacks.postStart === 'function' ) {
			this.callbacks.postStart.call( this, this.nodes );
		}

		return this;
	}
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------
module.exports = Smarties;
