import eel
import os

from core.log import conso


def onclse( url, list ):
	# signal.SIGINT = 2
	os.kill( os.getpid(), 2 )




# inicia a pasta root onde fica o arquivo html
eel.init( '' )
print( '' )
conso.info( 'Eel started: Everything seems to have started correctly.' ).close(
	'Running on the server: <%underline http://localhost:8800/templates/index.html %>'
)


# Inicia o banco de dados
import core.db

# Crie todos os métodos antes de inicar o arquivo
# from core import exposejs


# say_hello_py('Python World!')
# eel.say_hello_js('Python World!')   # Call a Javascript function



# A partir desta funcção não executa mais nada em baixo a menos que faça o "desbloqueio".
# Se for "desbloquear", algo precisa manter o scipt funcionando se não ele encerrará.
eel.start( 'templates/index.html', port = 8800, block = True )