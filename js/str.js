



const str = class {
	static titlecase( text ) {
		let sentence = text.toLowerCase().split( ' ' )
		for( let i = 0; i < sentence.length; i++ ) {
			sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
		}

		return sentence.join( ' ' )
	}
}



export default str