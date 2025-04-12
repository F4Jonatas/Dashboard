import str from './str.js'

const db = {} ;
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









// change user image if necessery
if ( vars.user.img ) {
	$( '.profile-img', event.detail.node ).attr({
		'src': vars.user.img,
		'alt': vars.user.name
	})
}

const salers = document.querySelector( '.content-section ul' )
for ( let id in vars.vendedor ) {
	const saler = vars.vendedor[ id ]
	const name  = str.titlecase( saler.nome )
	salers.insertAdjacentHTML( 'beforeend',
		'<li class="adobe-product">' +
			'<div class="products" title="' + name + '">' +
				'<m-import src="../img/users/usr.svg" remove="true"></m-import>' +
					name +
				'</div>' +

				'<span class="status">' +
					'<span class="status-circle green"></span>' +
					parseFloat( saler.pa ).toFixed( 2 ) +
				'</span>' +

				'<div class="button-wrapper">' +
					'<button class="content-button status-button open">Open</button>' +
					'<div class="menu">' +
						'<button class="dropdown">' +
							'<ul>' +
								'<li><a href="#">Go to Discover</a></li>' +
								'<li><a href="#">Learn more</a></li>' +
								'<li><a href="#">Uninstall</a></li>' +
							'</ul>' +
						'</button>' +
					'</div>' +
				'</div>' +
			'</li>'
	)
}


$( '.img-content' ).text( vars.loja.nome )
$( '#telalogin' ).remove()







// var options = {
// 	series: [ 76 ],
// 	chart: {
// 		type: 'radialBar',
// 		offsetY: -20,
// 		sparkline: {
// 			enabled: true
// 		}
// 	},

// 	plotOptions: {
// 		radialBar: {
// 			startAngle: -90,
// 			endAngle: 90,
// 			track: {
// 				background: "#e7e7e7",
// 				strokeWidth: '97%',
// 				margin: 5, // margin is in pixels

// 				dropShadow: {
// 					enabled: true,
// 					top: 2,
// 					left: 0,
// 					color: '#999',
// 					opacity: 1,
// 					blur: 2
// 				}
// 			},
// 			dataLabels: {
// 				name: {
// 					show: false
// 				},
// 				value: {
// 					offsetY: -2,
// 					fontSize: '22px'
// 				}
// 			}
// 		}
// 	},

// 	grid: {
// 		padding: {
// 			top: -10
// 		}
// 	},

// 	fill: {
// 		type: 'gradient',
// 		gradient: {
// 			shade: 'light',
// 			shadeIntensity: 0.4,
// 			inverseColors: false,
// 			opacityFrom: 1,
// 			opacityTo: 1,
// 			stops: [0, 50, 53, 91]
// 		},
// 	},

// 	labels: [ 'Average Results' ],
// }

// // https://apexcharts.com/javascript-chart-demos/radialbar-charts/semi-circle-gauge/
// var chart = new ApexCharts( $( "#home-chart" )[0], options )
// chart.render()



const gaugeOptions = {
	chart: {
		type: 'solidgauge'
	},

	title: null,

	pane: {
		center: [ '50%', '70%' ],
		size: '90%',
		startAngle: -90,
		endAngle: 90,
		background: {
			backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
			innerRadius: '60%',
			outerRadius: '100%',
			shape: 'arc'
		}
	},

	exporting: {
		enabled: false
	},

	tooltip: {
		enabled: false
	},

	// the value axis
	yAxis: {
		stops: [
			[ 0.9, '#55BF3B' ],  // red
			[ 0.5, '#DDDF0D' ], // yellow
			[ 0.1, '#DF5353' ] // green
		],
		lineWidth: 0,
		tickWidth: 0,
		minorTickInterval: null,
		tickAmount: 2,
		title: {
			y: -70
		},
		labels: {
			y: 16
		}
	},

	plotOptions: {
		solidgauge: {
			dataLabels: {
				y: 5,
				borderWidth: 0,
				useHTML: true
			}
		}
	}
};


const chartSpeed = Highcharts.chart('container-speed', Highcharts.merge(gaugeOptions, {
	yAxis: {
		min: 0,
		max: vars.loja.meta,
		title: {
			text: 'Meta'
		}
	},

	credits: {
		enabled: false
	},

	series: [{
		data: [ vars.loja.value ],
		// dataLabels: {
		// 	format:
		// 		'<div style="text-align:center">' +
		// 		'<span style="font-size:25px">{y}</span><br/>' +
		// 		'<span style="font-size:12px;opacity:0.4">km/h</span>' +
		// 		'</div>'
		// },

			tooltip: {
				valueSuffix: ''
			}
	}]
}))








// https://codyhouse.co/gem/css-multi-level-accordion-menu
for ( let dom of document.querySelectorAll( '.acortree .navigation-link' )) {
	dom.addEventListener( 'click', event => animateAccordion( dom ))
}

function animateAccordion( dom ) {
	const bool = dom.dataset.open === 'true' ? true : false
	const dropdown = dom.parentNode.getElementsByClassName( 'acortree-sub' )[0]

	// make sure subnav is visible while animating height
	dropdown.classList.add( 'acortree-sub-open' )

	// check if exist icon animatoin
	const ico = dom.querySelector( '.anima-arrow' )
	if ( ico )
		ico.classList.toggle( 'active' )

	const initHeight   = bool ? dropdown.offsetHeight : 0
	const finalHeight  = bool ? 0 : dropdown.offsetHeight

	dropdown.animate(
		[ // keyframe
			{ height: `${initHeight}px` },
			{ height: `${finalHeight}px` }
		],
		{ // options
			duration: 700,
			// iterations: 1,
			easing: 'cubic-bezier(.34,.5,.05,.98)'
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