/*
  * Change events "click" and "touchstart" to "pointerdown"
  * Setup clickable for only table head.
    Antes adicionava clicks no body, se adicionado "th"
  + Added Customized built-in elements



  Options:
    <th data-sortable-type="TYPE">
      data-sortable-type: "alpha", "numeric" or "date"
      Use the "data-sortable-type" attribute in the th thread to specify the type of the column. This minimizes class initialization time
      By default, the data type in each column is determined by reading the FIRST CELL of a column and trying to match it with the list of types.


	https://github.com/tofsjonas/sortable/blob/main/sortable.js
	https://github.com/HubSpot/sortable/blob/master/js/sortable.js

	https://www.syncfusion.com/javascript-ui-controls/js-data-grid?utm_medium=ads&utm_source=googleads&utm_campaign=javascript-controls
	https://www.ag-grid.com/javascript-data-grid/
	https://bryntum.com/products/grid/
	https://handsontable.com/#
*/




const selector    = 'table[data-sortable]'
const clearnumb   = /[^0-9.-]/g
const trimRegExp  = /^\s+|\s+$/g
const clickEvents = [ 'pointerdown' ]


// Eu costumo usar essa validação, porque atualmente é muito comum usar icon fonts. eg: Font Awesome
// Caso não queria essa validação é só definir o tipo da coluna.
// https://stackoverflow.com/a/39134560
const strvalidate = /^([\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+)$/

// currency symbols
// https://en.wikipedia.org/wiki/Currency_symbol
// https://minershaven.fandom.com/wiki/Cash_Suffixes
const numbmatch   = /^-?[£R$¤€]?[\d,.]+%?$/i


const typesObject = {
	numeric: {
		name                : 'numeric',
		defaultSortDirection: 'descending',
		match               : test => test.match( numbmatch ),
		comparator          : numb => ( parseFloat( numb.replace( clearnumb, '' ), 10 ) || 0 )
	},

	date: {
		name                : 'date',
		defaultSortDirection: 'ascending',
		reverse             : true,
		match               : test => ! isNaN( Date.parse( test )),
		comparator          : date => ( Date.parse( date ) || 0 )
	},

	alpha: {
		name                : 'alpha',
		defaultSortDirection: 'ascending',
		match               : test              => test.match( strvalidate ), // typeof test === 'string',
		compare             : ( before, after ) => before.localeCompare( after )
	}
}





/*
	https://stackoverflow.com/questions/6520192/how-to-get-the-text-node-of-an-element
	https://stackoverflow.com/a/35213639
*/
const nodevalue = node => {
	if ( ! node )
		return ''

	const datavalue = node.dataset.value
	if ( datavalue !== undefined )
		return datavalue

	if ( typeof node.innerText !== 'undefined' )
		return node.innerText.replace( trimRegExp, '' )

	return node.textContent.replace( trimRegExp, '' )
}


/*
*/
const columntype = ( table, thead ) => {
	if ( 'sortableType' in thead.dataset )
		return typesObject[ thead.dataset.sortableType ]

	for ( let row of table.tBodies[0].rows ) {
		const text = nodevalue( row.cells[ thead.cellIndex ])

		for ( let [ key, type ] of Object.entries( typesObject )) {
			if ( type.match( text )) {
				thead.dataset.sortableType = type.name
				return type
			}
		}
	}

	thead.dataset.sortable = 'invalid'
	return false
	// return typesObject.alpha
}



/*
*/
const mounttable = table => {
	// check if existe table head with rows
	if ( ! table.tHead.rows.length )
		return

	for ( const thead of table.tHead.getElementsByTagName( 'th' )) {
		if ( thead.dataset.sortable !== 'false' )
			addevent( table, thead )
		console.log(thead)
	}

	return table
}





/*
*/
const addevent = ( table, th ) => {
	const type = columntype( table, th )
	if ( ! type )
		return

	const result = []
	for ( let type of clickEvents )
		result.push( th.addEventListener( type, onclick ))

	return result
}



/*
*/
const onclick = function( e ) {
	if ( e.handled !== true )
		e.handled = true
	else
		return false

	let compare
	let newSortedDirection
	const table           = this.offsetParent
	const sorted          = this.dataset.sorted === 'true'
	const sortedDirection = this.dataset.sortedDirection
	const type            = typesObject[ this.dataset.sortableType ]

	if ( sorted )
		newSortedDirection = sortedDirection === 'ascending' ? 'descending' : 'ascending'
	else
		newSortedDirection = type.defaultSortDirection

	for ( let th of this.parentNode.querySelectorAll( 'th' )) {
		th.dataset.sorted = 'false'
		delete th.dataset.sortedDirection
	}

	this.dataset.sorted = 'true'
	this.dataset.sortedDirection = newSortedDirection
	const tBody    = table.tBodies[0]
	const rowArray = []

	if ( ! sorted ) {
		let _compare
		if ( type.compare != null )
			_compare = type.compare
		else
			_compare = ( a, b ) => b - a


		compare = function( a, b ) {
			if ( a[0] === b[0] )
				return a[2] - b[2]

			if ( type.reverse )
				return _compare( b[0], a[0] )
			else
				return _compare( a[0], b[0] )
		}


		for ( let index = 0 ; index < tBody.rows.length; index++ ) {
			const row = tBody.rows[ index ]
			let value = nodevalue( row.cells[ e.target.cellIndex ])

			if ( type.comparator != null )
				value = type.comparator( value )

			rowArray.push([ value, row, index ])
		}

		rowArray.sort( compare )
		for ( const [, row, ] of rowArray )
			tBody.appendChild( row )
	}

	else {
		for ( const row of tBody.rows )
			rowArray.push( row )

		rowArray.reverse()

		for ( const row of rowArray )
			tBody.appendChild( row )
	}

	if ( taula.event ) {
		table.dispatchEvent( new CustomEvent( 'taula-sorted', {
			bubbles: true
		}))
	}
}





// Taula é table em Basco
const taula = class {
	static event = true

	static init = function( target ) {
		if ( ! target )
			target = selector

		for ( let table of document.querySelectorAll( target ))
			mounttable( table )
	}
}


// Customized built-in elements
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#customized_built-in_elements
customElements.define( 'm-taula',
	class extends HTMLTableElement {
		constructor() {
			super()
			mounttable( this )
		}
},

{ extends: 'table' })



export default taula ;