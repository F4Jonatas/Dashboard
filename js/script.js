import app from './app.js' ;
import $ from './jquery.js' ;
import './core/bring.js' ;

app.init() ;




app.on( 'docloaded', event => {
	const db = {} ;
	console.log('done')
	db.dropdownactive = false ;


	// change theme
	document.querySelector( '.dark-light' ).addEventListener( 'click', event => {
		document.body.classList.toggle( 'light-mode' )
		// event.target.insertAdjacentHTML( 'beforeend', '<m-import src="/img/moon.svg"></m-import>' )
	}) ;


	// menu links
	for ( let dom of document.querySelectorAll( '.menu-link' )) {
		dom.addEventListener( 'click', evetn => {
			// remove class in all links
			for ( let link of dom.parentNode.children )
				link.classList.remove( 'is-active' ) ;

			// add class fo link clicked
			dom.classList.add( 'is-active' ) ;
		}) ;
	} ;


	// header links
	for ( let dom of document.querySelectorAll( '.main-header-link' )) {
		dom.addEventListener( 'click', event => {
			// remove class in all links
			for ( let link of dom.parentNode.children )
				link.classList.remove( 'is-active' ) ;

			// add class fo link clicked
			dom.classList.add( 'is-active' ) ;
		}) ;
	} ;


	// dropdowns
	for ( let dom of document.querySelectorAll( '.dropdown' ))
		dom.addEventListener( 'click', event => {
			document.querySelector( '.content-wrapper' ).classList.add( 'overlay' ) ;
			db.dropdownactive = true ;
			event.stopPropagation() ;

			// remove class in all links
			for ( let link of dom.parentNode.children )
				link.classList.remove( 'is-active' ) ;

		dom.classList.add( 'is-active' ) ;
	}) ;



	const input = document.querySelector( '.search-bar input' ) ;
	input.addEventListener( 'focus', event => event.path[2].classList.add( 'wide' )) ;
	input.addEventListener( 'blur', event => event.path[2].classList.remove( 'wide' ));

	document.addEventListener( 'click', event => {
		if ( db.dropdownactive === true ) {
			db.dropdownactive = false ;

			for ( let dom of document.querySelectorAll( '.dropdown' ))
				dom.classList.remove( 'is-active' ) ;

			document.querySelector( '.content-wrapper' ).classList.remove( 'overlay' ) ;
		} ;


		const container = document.querySelectorAll( '.status-button' ) ;
		const dd = document.querySelectorAll( '.dropdown' ) ;

		// Array.from(container).filter( e => console.log( e ))
		for ( let dom of container )
		// 	console.log( dom , event.target )
		// console.log( container, event.target )
		if ( dom !== event.target ) {
		// 	dd.removeClass( 'is-active' ) ;
		//console.log(999)
		}
	}) ;



	// close popups
	for ( let dom of document.querySelectorAll( '.pop-up .close' )) {
		dom.addEventListener( 'click', () => {
			document.querySelector( '.pop-up' ).classList.remove( 'visible' ) ;
			document.querySelector( '.overlay-app' ).classList.remove( 'is-active' ) ;
		}) ;
	} ;


	// open popups
	for ( let dom of document.querySelectorAll( '.status-button:not(.open)' )) {
		dom.addEventListener( 'click', () => {
			document.querySelector( '.pop-up' ).classList.add( 'visible' ) ;
			document.querySelector( '.overlay-app' ).classList.add( 'is-active' ) ;
		}) ;
	} ;
}) ;


//document.addEventListener( 'import', event => alert( event ))