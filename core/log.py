
# https://askubuntu.com/questions/528928/how-to-do-underline-bold-italic-strikethrough-color-background-and-size-i
# https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
###
	# Printing Template
	# suports RGB and Hexadecimal colors

	# Autor: F4Jonatas
	# Version: 1.2.1
	# Inprations/Credtis
	#    https://github.com/rxi/log.lua


	# printt(
	#  template [string/required]  Text template to print.
	#  sep      [string/optional]  Printed between objects. Default: " ".
	#  end      [string/optional]  Appended to the end of the statement. Default: "\n".
	#  file     [object/optional]  An object with write(string) method. Default: sys.stdout.
	#  flush    [boolean/optional] (Py >= 3.3) Default: False.
	# )

	# text color: use color or c
	# printt( '<%color:#ff5555 Any Message%>' )

	# back color: use fill or f
	# printt( '<%fill:56,56,56 Any Message%>' )

	# bold: use bold or b
	# printt( '<%bold Any Message%>' )

	# italic: use italic or i
	# printt( '<%italic Any Message%>' )

	# dim: use dim or d
	# printt( '<%dim Any Message%>' )

	# underline: use underline or u
	# printt( '<%underline Any Message%>' )

	# ANSI escape code: use @
	# printt( '<%@0;32 Any Message%>' )

	# Any attribute can be combined with "-" except the ANSI escape code
	# printt( '<%u-i-f:56,56,56-c:#ff5555 Any Message%>' )
###
import re

def printt( template, **args ):
	template = re.sub( '%>', chr(0), template )
	result   = template
	string   = ''


	# prepare regex
	match     = re.compile( r'(<\s*%\s*)([^\x00]*)(\x00)' )
	color     = re.compile( r'-?\b(c(olor)?\s*:\s*((#[a-fA-F\d]+)|(\d+,\d+,\d+)))\b-?\s*' )
	fill      = re.compile( r'-?\b(f(ill)?\s*:\s*((#[a-fA-F\d]+)|(\d+,\d+,\d+)))\b-?\s*' )
	italic    = re.compile( r'-?\b(i(talic)?)-?\s?' )
	underline = re.compile( r'-?\b(u(nderline)?)-?\s?' )
	strong    = re.compile( r'-?\b(b(old)?)-?\s?' )
	dimmy     = re.compile( r'-?\b(d(im)?)-?\s?' )
	codec     = re.compile( r'\B(@\s*([\d;]+))\s?' )

	# loop in template groups
	for find in re.finditer( match, template ):
		text  = find.group(2)
		fore  = re.search( color    , text )
		back  = re.search( fill     , text )
		talic = re.search( italic   , text )
		uline = re.search( underline, text )
		bold  = re.search( strong   , text )
		dim   = re.search( dimmy    , text )
		code  = re.search( codec    , text )

		if code:
			string = string + re.sub( r'(<\s*%\s*)?' + code.group(0) + r'\s?', '', text )
			result = re.sub(
				r'(<\s*%\s*)?' + code.group(0) + r'\s?',
				f'\033[{ code.group(2) }m',
				result
			)


		else:
			if fore:
				# fore_s , fore_e = fore.span()
				# hex color
				if fore.group(4):
					# text = text[:fore_s] + '\033[38;2;{0[0]};{0[1]};{0[2]}m'.format( co.extractcolor( fore.group(5) )) + text[fore_e:]
					# fore = { color: co.hex2rgb( fore.group(4) ), inner: fore.group(0) }
					result = re.sub(
						r'(<\s*%\s*)?-?' + fore.group(0) + r'-?\s*',
						'\033[38;2;{0[0]};{0[1]};{0[2]}m'.format( co.hex2rgb( fore.group(4) )),
						result
					)

				# rgb color
				elif fore.group(5):
					# text = text[:fore_s] + '\033[38;2;{0[0]};{0[1]};{0[2]}m'.format( fore.group(6).split( ',' )) + text[fore_e:]
					result = re.sub(
						r'(<\s*%\s*)?-?' + fore.group(0) + r'-?\s*',
						'\033[38;2;{0[0]};{0[1]};{0[2]}m'.format( fore.group(5).split( ',' )),
						result
					)


			if back:
				# hex color
				if back.group(4):
					result = re.sub(
						r'(<\s*%\s*)?-?' + back.group(1) + r'-?\s*',
						'\033[48;2;{0[0]};{0[1]};{0[2]}m'.format( co.extractcolor( back.group(4) )),
						result
					)

				# rgb color
				elif back.group(5):
					result = re.sub(
						r'(<\s*%\s*)?-?' + back.group(1) + r'-?\s*',
						'\033[48;2;{0[0]};{0[1]};{0[2]}m'.format( back.group(5).split( ',' )),
						result
					)


			if bold:
				result = re.sub( r'(-|<\s*%\s*)' + bold.group(1)  + r'-?\s*', '\033[1m', result )

			if dim:
				result = re.sub( r'(-|<\s*%\s*)' + dim.group(1)   + r'-?\s*', '\033[2m', result )

			if talic:
				result = re.sub( r'(-|<\s*%\s*)' + talic.group(1) + r'-?\s*', '\033[3m', result )

			if uline:
				result = re.sub( r'(-|<\s*%\s*)' + uline.group(1) + r'-?\s*', '\033[4m', result )



		# clear templete
		# result = re.sub( find.group(1), '' , result )
		result = re.sub( r'\s*\x00', r'\033[0m', result )
		# print( find.group(0) )

	print( result, **args )
	return string






from datetime import datetime

###
  # Class conso
###
class conso:
	# methotd: return current time
	tick  = lambda: datetime.now().strftime( '%H:%M:%S.%f' )[:-3]


	@classmethod
	def error( self, msg: str ):
		return self.group( printt( f'<%@0;31 [ERROR { conso.tick() }]%> { msg }' ))

	@classmethod
	def info( self, msg: str ):
		return self.group( printt( f'<%@0;32 [INFO  { conso.tick() }]%> { msg }' ))

	@classmethod
	def warn( self, msg: str ):
		return self.group( printt( f'<%@0;33 [WARN  { conso.tick() }]%> { msg }' ))

	@classmethod
	def trace( self, msg: str ):
		return self.group( printt( f'<%@0;34 [TRACE { conso.tick() }]%> { msg }' ))

	@classmethod
	def fatal( self, msg: str ):
		return self.group( printt( f'<%@0;35 [FATAL { conso.tick() }]%> { msg }' ))

	@classmethod
	def debug( self, msg: str ):
		return self.group( printt( f'<%@0;36 [DEBUG { conso.tick() }]%> { msg }' ))

	@classmethod
	def print( self, msg: str ):
		return self.group( printt( msg ) )



	class group():
		def __init__( self, inner: str ):
			self.__inner = inner


		def repeat( self, word: str, length: int ):
			result = ''

			for i in range( length ):
				result = result + word

			return result


		def print( self, msg: str, prefix: str = '├─' ):
			# length = len( self.__inner )
			tab = self.repeat( ' ', 2 ) #if length > 0 else ''
			return conso.group( printt( f'{ prefix }{ tab }{ msg }' ))


		def close( self, msg: str, prefix: str = '└─' ):
			tab = self.repeat( ' ', 2 )
			printt( f'{ prefix }{ tab }{ msg }' )