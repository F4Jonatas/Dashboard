import './bring.js'
import str from './str.js'

// https://javascript.plainenglish.io/8-javascript-libraries-for-better-handling-local-storage-d8cd4a05dbfa
// https://github.hubspot.com/sortable/docs/welcome/


document.body.parentElement.setAttribute( 'style',
	`--dppx: ${ window.devicePixelRatio };` +
	`--dpi: ${ window.devicePixelRatio * 96 };` +
	`--dpcm: ${ window.devicePixelRatio * ( 96 / 2.54 )}px;`
) ;


// global vars
window.vars = {}


$( document ).ready(() => {
	$( 'form.login' ).submit( event => {
		event.preventDefault()

		const form = event.target
		form.style.removeProperty( 'animation' )

		eel.tryconnect( form.login.value, form.pass.value )().then( data => {
			// Se não existe a senha ou usuário retorna null
			if ( ! data )
				return form.style.animation = 'wiggle 2s linear'

			// se tudo estiver correto e retornar o usuário
			else {
				console.log( data )
				localStorage.setItem( 'empresa_id', data.user.company )
				vars = data
				document.head.insertAdjacentHTML( 'beforeend', '<link rel="stylesheet" href="../css/home.css">' )
				document.body.insertAdjacentHTML( 'afterbegin', '<div is="m-bring" data-src="./home.html"></div>' )

				// eel.getmeta( user.company )().then( loja => console.log( loja ) )
			}
		})
	})


	// Dispara o evento sempre que for importado um html
	// Quando o arquivo for refenrete ao html importado, importa um js para ele e assim executa a função
	document.addEventListener( 'bring', event => {
		if ( event.detail.path === './home.html' )
			import( '/js/home.js' )
	})
})