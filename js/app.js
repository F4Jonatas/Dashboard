// document.body.addEventListener( "DOMSubtreeModified", mutation => {
// 	console.log( mutation );
// }) ;

// new MutationObserver((mutationRecords, observer) => {
// 	//Once we have resolved we don't need the observer anymore.
// 	// observer.disconnect();
// 	console.log( mutationRecords, observer )
// })
// .observe(document.documentElement, {
// 	childList: true,
// 	subtree: true,
// 	attributes: true,
// 	// attributeFilter: true,
// 	attributeOldValue: true,
// 	characterData: true,
// 	characterDataOldValue: true
// });
// https://stackoverflow.com/a/6700



/*
	Version: 0.1.1
*/
const app = class {
	static location = window.location.href + '?' ;
	static history = [] ;
	static user = {} ;
	static me = {} ;
	static mobile = navigator.userAgent.match( /(Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile)/i ) ;



	static init() {
		const cssmedia = window.matchMedia( '(pointer:none), (pointer:coarse)' )
		cssmedia.onchange = query => {
			if ( query.matches === false ) {
				app.mobile = false ;
				document.body.classList.remove( 'mobile' ) ;
			} else {
				app.mobile = true ;
				document.body.classList.add( 'mobile' ) ;
			}
		} ; cssmedia.onchange( cssmedia ) ;

		//for ( let key in window)
		//console.log(key, window[key])



		// Add events for page url changed
		window.addEventListener( 'popstate', function( event ) {
			if ( app.user.history ) {
				app.user.history( event )
			}

			// // var r = confirm("You pressed a Back button! Are you sure?!");
		}) ;


		// Add events for doc loaded
		document.addEventListener( 'DOMContentLoaded', event => {
			app.me.docloaded = event ;

			if ( app.user.docloaded )
				app.user.docloaded( event )
		}) ;
	}


	static click( item, event, id ) {
		switch( id ) {
			case 'itemclose':
				console.log( 'err' ) ;
				break ;
		}
	}



	/*
	*/
	static fetch( url ) {
		return new Promise(function( resolve, reject ) {
			const xhr = new XMLHttpRequest ;
			xhr.onload = event => resolve({ 'text': () => {
				return new Promise( function( resolve, reject ) {
					resolve( xhr.responseText )
				});
			}, 'status': xhr.status, 'event': event }) ;

			xhr.onerror = event => reject( new TypeError( 'Local request failed' )) ;
			xhr.open( 'GET', url, true ) ;
			xhr.send( null ) ;
		}) ;
	}


	/*
		Metodo usada para navegar na pagina.
		Pode ser usado para verificar se existe ou coletar a chave.

		Ex: Check/Get value. If existe return value else true.
	*/
	static nav( param, value ) {
		if ( param === 'back' ) {
			if ( app.history.length > 0 )
				app.history.pop() ;
				history.back()
			return
		}


		let url = new URL( this.location ) ;

		// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get
		if ( value === undefined ) {
			if ( url.searchParams.has( param ))
				return url.searchParams.get( param )
			else return false
		}

		url = new URL( this.location + param + '=' + value ) ;
		this.location = url.origin + url.pathname + '?' + param + '=' + value ;
		history.pushState( value, null, this.location ) ;
		// app.history.push( this.location ) ;
	}



	static on( type, func ) {
		if ( type === 'docloaded' ) {
			if ( app.me.docloaded )
				func( app.me.docloaded ) ;
			else
				app.user.docloaded = func ;
		}

		else if ( type === 'history' ) {
			app.user.history = func ;
		}
	}
} ;

export default app ;