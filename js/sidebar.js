// https://codyhouse.co/gem/css-multi-level-accordion-menu
document.addEventListener( 'DOMContentLoaded', _ => {
	for ( let dom of document.querySelectorAll( '.acortree .navigation-link' )) {
		dom.addEventListener( 'click', event => animateAccordion( dom ))
	}
})

function animateAccordion( dom ) {
	const bool = dom.dataset.open === 'true' ? true : false
	const dropdown = dom.parentNode.getElementsByClassName( 'acortree-sub' )[0]

	// make sure subnav is visible while animating height
	dropdown.classList.add( 'acortree-sub-open' )

	const initHeight   = bool ? dropdown.offsetHeight : 0
	const finalHeight  = bool ? 0 : dropdown.offsetHeight

	dropdown.animate(
		[ // keyframe
			{ height: `${initHeight}px` },
			{ height: `${finalHeight}px` },
		],
		{ // options
			duration: 200,
			iterations: 1,
		}
	).addEventListener( 'finish', ( event ) => {
		if ( bool ) {
			dom.dataset.open = false

			dropdown.classList.remove( 'acortree-sub-open' )
			dropdown.removeAttribute( 'style' )
		}
		else {
			dom.dataset.open = true
		}
	})
}