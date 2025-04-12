/*
	version: 1.1.4
	+ Added filter for import if mobile or desktop only
	+ Added attribute to know where elements came from
	+ Prevent error with 'repeat' attribute less than 0
	- Removed supports: AMD, Node


	With this module you can load html files
	Can add a filter to load only for mobiles or desktops
	You can add repeat to load the same file

	eg:
		Import to desktop only:
			<link rel="himport-desktop" href="./foo.html">

		Import to mobile only:
			<link rel="himport-mobile" href="./foo.html">

		Import to both with repetition from the same file:
			<link rel="himport" href="./foo.html" repeat="3">


	https://github.com/dsheiko/html-import
	document.addEventListener( 'himportdone', function() {})
*/
// const himport = class {
// 	static selector = 'link[rel^=himport]' ;

// 	// static tablet   = navigator.userAgent.match( /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i )
// 	static mobile = (
// 		navigator.userAgent.match( /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i )
// 		? true
// 		: false
// 	) ;



// 	static init( listener = false ) {
// 		const importer = new himport() ;
// 		himport.listener = listener ;
// 		window.__himport = 'loading' ;


// 		himport.ready(() => {
// 			importer.import()
// 				.then(( urls ) => {
// 					window.__himport = 'complete'

// 					if ( himport.listener )
// 						himport.sendevent( 'himport-done', { urls }) ;
// 				}) ;
// 		}) ;

// 		/*
// 			Load JavaScript - utility that is handy to used in conjuction with the tool
// 			@param {string} url
// 			@returns {Promise}
// 		*/
// 		// importer.loadJs = ( url ) => {
// 		// 	return new Promise( resolve => {
// 		// 		const script = document.createElement( 'script' ) ;
// 		// 		script.src = url ;
// 		// 		script.onload = resolve ;
// 		// 		document.head.appendChild( script ) ;
// 		// 	}) ;
// 		// } ;
// 	} ;




// 	/*
// 		Invoke a given handler when DOM is ready
// 		@param {function} cb
// 	*/
// 	static ready( cb ) {
// 		if ( document.attachEvent ? document.readyState == 'complete' : document.readyState !== 'loading' )
// 			return cb() ;

// 		document.addEventListener( 'DOMContentLoaded', cb ) ;
// 	} ;




// 	/*
// 		CustomEvent with support for IE (9+)
// 		@param {string} type
// 		@param {Object} detail
// 		@returns {object}
// 	*/
// 	static sendevent( type, detail ) {
// 		let event ;
// 		try {
// 			event = new CustomEvent( type, { detail: detail } ) ;
// 			document.dispatchEvent( event ) ;
// 		}

// 		catch( e ) {
// 			event = document.createEvent( 'CustomEvent' ) ;
// 			event.initCustomEvent( type, false, false, { detail: detail }) ;
// 			document.dispatchEvent( event ) ;
// 		} ;
// 	} ;



// 	/*
// 		Process all th eimports in the newly fetched HTML
// 		@param {string} html
// 		@returns Promise
// 	*/
// 	processHtmlString( url = '', html ) {
// 		// Convert the HTML string into a document object
// 		const div = document.createElement( 'div' ) ;
// 		div.innerHTML = html ;

// 		const els = Array.from( div.querySelectorAll( himport.selector )) ;

// 		return (
// 			els.length
// 			? this.importForElements( els ).then(() => { return div })
// 			: div
// 		) ;
// 	} ;




// 	/*
// 		Load all given imports
// 		@param {Node[]} imports
// 		@returns {Promise}
// 	*/
// 	importForElements( imports ) {
// 		// Process imports in a given Node. Returns promise
// 		return Promise.all( imports.map( el => {
// 			// Added filter for import if mobile or desktop only
// 			// remove the dom that will not be used
// 			const filter = el.rel.match( /^\s*(himport-(\w+)?\s*)$/ ) || false ;
// 			if ( filter && (( filter[2] !== 'desktop' && ! himport.mobile ) || ( filter[2] !== 'mobile' && himport.mobile ))) {
// 				el.parentNode.removeChild( el ) ;
// 				return ;
// 			} ;


// 			const url = el.getAttribute( 'href' ) ;
// 			const processHtmlString = this.processHtmlString.bind( this, url ) ;


// 			// if you use repeat with a number less than 0 it causes an error and with this method it doesn't happen
// 			const repeat = Math.max( parseInt( el.getAttribute( 'repeat' ) || 1 ), 0 ) ;


// 			// Load files and parse to html string
// 			return fetch( url )
// 				.then( response => response.text() )
// 				.then( processHtmlString )
// 				.then(( div ) => {
// 					if ( ! el.parentNode )
// 						return ;

// 					// This will help me know all the tags I've imported, in case I need it.
// 					for ( let dom of div.children )
// 						dom.setAttribute( 'himport-path', url ) ;


// 					el.insertAdjacentHTML( 'beforebegin', div.innerHTML.repeat( repeat )) ;

// 					// remove the dom that was used
// 					el.parentNode.removeChild( el ) ;

// 					if ( himport.listener == true )
// 						himport.sendevent( 'himport', {
// 							path: url,
// 							basename: url.replace( /.*\//g, '' )
// 						}) ;

// 					return url ;
// 				}) ;
// 		})) ;
// 	}




// 	/*
// 		Find and process all the imports in the DOM
// 		@returns {Promise}
// 	*/
// 	import() {
// 		const imports = Array.from( document.querySelectorAll( himport.selector )) ;
// 		if ( ! imports.length )
// 			return Promise.resolve() ;

// 		return this.importForElements( imports ) ;
// 	} ;
// } ;


// export default himport ;












/*
	version: 1.3.4
	+ Added filter for import if mobile or desktop only
	+ Added an attribute to know which file was imported
	+ Added attribute to remove initial module import
	+ Prevent error with 'repeat' attribute less than 0
	- Removed supports: AMD, Node


	With this module you can load html files
	Can add a filter to load only for mobiles or desktops
	You can add repeat to load the same file

	Attributes:
		media    : The media attribute specifies what media/device the target
			options: desktop, mobile

		repeat   :

		remove   : The remove attribute remove the dom that will not be used. Defaul false

		src      : The src attribute specifies the URL of an external file


	e.g:
		Bring to desktop only:
			<div is="m-bring" data-media="desktop" data-src="./foo.html"></div>

		Bring to mobile only:
			<div is="m-bring" data-media="mobile" data-src="./foo.html"></div>

		Bring to both with repetition from the same file:
			<div is="m-bring" data-src="./foo.html" data-repeat="3"></bring>


	document.addEventListener( 'bring', function( event ) {})

	https://github.com/dsheiko/html-import
*/

const ismobile   = !! navigator.userAgent.match( /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i )
// export object to see html imported
const importlist = []

/*
	@param {string} type
	@param {Object} detail
	@returns {object}
*/
const sendevent = ( type, detail ) => {
	let event = new CustomEvent( type, { detail: detail })
	document.dispatchEvent( event )
}


customElements.define( 'm-bring',
	class extends HTMLDivElement {
		constructor() {
			super()
		}


		async connectedCallback() {
			let url = this.dataset.src

			// remove the dom that will not be used
			if ( this.dataset.media ) {
				if (( this.dataset.media === 'desktop' && ismobile ) || ( this.dataset.media === 'mobile' && ! ismobile ))
					return this.remove()
			}


			await fetch( url )
				.then( response => response.text())
				.then( html => {
					const div = document.createElement( 'div' )
					// It is not expected to use a number less than 0, but if this occurs, this check prevents errors
					const repeat = Math.max( parseInt( this.dataset.repeat || 1 ), 0 )

					// eruda create large file
					// if ( window.hasOwnProperty( 'eruda' ) && ( div.children.length > 0 && /^(\/\*! eruda)/.test( div.children[0].text )))
						// div.children[0].parentNode.removeChild( div.children[0] )

					// Adds an attribute to know which file was imported
					div.innerHTML = html.replace(/<\s*([^\s\t]+)/i, `<\$1 data-import="${ url }"`)

					importlist.push( url )
					this.insertAdjacentHTML( 'beforebegin', div.innerHTML.repeat( repeat ))
					this.remove()


					// trigger event on import finalized
					if ( ! this.dataset.event || this.dataset.event === 'true' )
						sendevent( 'bring', {
							node: this,
							list: importlist,
							path: url,
							basename: url.replace( /.*\//g, '' )
						})
					// console.log('added',url)
				})
				// console.log('creeee',url)
		}
	},


	{ extends: 'div' }
)