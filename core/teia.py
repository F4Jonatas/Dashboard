
import eel
import sys
import os
import re
import subprocess

# from lib.fetchy import fetchy
from .logger import log




###
  # teia(
  # [string/required] file/folder path html location
  # asdasddasd
  # )
###
class teia:
	@staticmethod
	def threadstart():
		log( 'qweqew', 10 )

	# @staticmethod
	# def chekfont( fonts ):
	# 	typeof   = type( fonts )
	# 	out      = subprocess.Popen( 'fc-list', stdout = subprocess.PIPE, stderr = subprocess.PIPE )
	# 	out, err = out.communicate()

	# 	if not err:
	# 		out = out.decode( 'utf-8' )
	# 		if typeof == str:
	# 			out = re.search( fonts, out, flags = re.IGNORECASE )

	# 			if out and out.group() != '':
	# 				return True


	# 		elif typeof == list or typeof == tuple:
	# 			for x in fonts:
	# 			  print( x )




	def __init__( self, url, port = None, exts = None, workingdir = None, js = None, webview = False ):
		self.webview = False

		if webview:
			self.webview = True
			import webview
			import threading

			teia.webview = webview
			teia.threading = threading



		self.scriptdir = os.path.dirname( os.path.realpath( sys.argv[0] )) + os.sep

		if workingdir == True:
			os.chdir( self.scriptdir )

		# if you choose the folder where the HTML is and don't want to name the file. Default: "index.html"
		# There is also no need to put the full path, I will try to find it for you from the current script path
		find = re.match( r'(.*[\\/])?(([a-z0-9]+\.[HhTtMmLl]+)$)?', url )
		if not find:
			log( 'error', f'error on match url:. "{url}"' )
			return


		if find.group( 1 ):
			url  = re.sub( r'\\' if os.sep == r'\\' else r'/', r'\\' if os.sep != r'\\' else r'/', find.group( 1 ))
			url += ( os.sep if url[-1] != os.sep else '' )
		else:
			url = ''

		# path = os.path.dirname( os.path.realpath( url ))
		path = os.getcwd() + '/' + url
		path = path.replace( '\\', '/' )
		file = find.group( 2 )
		file = file if file else 'index.html'

		self.port = port or 8000
		exts = exts or [ '.js', '.html', '.txt', '.htm', '.xhtml' ]


		# check values
		if not os.path.exists( path ):
			log( 'error', f'error on init: path don\'t exist. "{ path }"' )
			return

		if not os.path.exists( path +'/'+ file ):
			log( 'error', f'error on init: file path don\'t exist. "{path}/{file}"' )
			return


		# imbued files
		# em teste com erros
		if js:
			isfile = os.path.exists( js )
			file = open( path +'/'+ file, 'r' )
			fread = file.read()
			fread = re.sub( r'(<\/head>)', ( '<script src="'+ js +'">' if isfile else '<script>'+ js ) +'</script></head>', fread )
			log( 'INFO', fread )
			os.pause()


		self.file = path + file

		# start ell or thread
		# https://github.com/ChrisKnott/Eel/issues/585
		eel.init( path, allowed_extensions = exts )

		if self.webview:
			self.thread = threading.Thread( target = lambda: eel.start( self.file, port = self.port, mode = None, shutdown_delay = 0.0 ))
			self.thread.setDaemon( True )




	def title( self, value ):
		return eel.teia_title( value )



	def run( self ):
		log( 'runing', self.file )
		if self.webview:
			self.thread.start()
			teia.webview.create_window( 'Teia app', f'http://localhost:{self.port}/{self.file}' )
			teia.webview.start()

		else:
			eel.start( self.file, port = self.port )




	def exit( self ):
		sys.exit()







# @eel.expose
# teia