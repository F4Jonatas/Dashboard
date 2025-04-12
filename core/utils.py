

class object( dict ):
	#def __init__( self, sensitive = False ):
	#   pass


	def __getattr__( self, item ):
		# print( self.sensitive )
		if item in self:
			return self[ item ]
		else:
			raise AttributeError( 'No such attribute: '+ item )


	def __setattr__( self, item, value ):
		self[ item ] = value


	def __delattr__( self, item ):
		if item in self:
			del self[ item ]
		else:
			raise AttributeError( 'No such attribute: '+ item )


	# filter object with values in key
	def _filter( self, key, value ):
		result = {}

		for id in self:
			if self[ id ][ key ] == value:
				result[ id ] = self[ id ]

		return result






###
  # aho = string in maori
  # Add string repeat
  # aho.repeat( 'Linux', 2, 6 ) retrun "LiLiLiLiLiLi"
  # aho.repeat( 'Linux', 2 ) retrun "Linux"
###
class aho:
	@staticmethod
	def repeat( word, length, index = None ):
		result = ''

		if not index:
			for i in range( length ):
				result = result + word

		else:
			if ( length > len( word )):
				length = len( word )

			repeat_string = word[:length]

			for i in range( index ):
				result = result + repeat_string

		return result