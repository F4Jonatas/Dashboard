import threading

# https://stackoverflow.com/a/52685419
# Foi escholhido a lib "MySQLdb" por ser mais rápida que o restante.
import MySQLdb
import eel
import re
import os.path


from core.log import conso, printt
from ..utils import object, aho



class db:
	host                 = 'edi.miamarmake.com.br'
	port                 = 11306
	user                 = 'bi'
	passwd               = 'bi123'
	database             = 'ideiaerp'

	lasupdate            = None
	metavenda            = {}
	vendedor             = object()
	lojavendadia         = {}
	lojavendadiaanterior = {}
	lojavendamesatual    = {}
	lojavendamesanterior = {}



	def __init__( self ):
		pass


	###
	  # Create a new section user
	###
	@classmethod
	def connect( self ):
		self = db()

		try:
			self.connect =  MySQLdb.connect(
				host   = self.host,
				port   = self.port,
				user   = self.user,
				passwd = self.passwd,
				db     = self.database
			)

		except MySQLdb.Error as err:
			conso.error( err )

		self.cursor   = self.connect.cursor()
		self.execute  = lambda sql: self.cursor.execute( sql )
		self.fetchall = lambda: self.cursor.fetchall()
		return self






# Todos os selects que são usandos constantemente
get = object({
	'users'               : 'SELECT login,u.nome,senha,u.empresa_id,imagem_url,usuario_id,perfil_id,empresa_nome from usuario u left join empresa e on u.empresa_id=e.empresa_id where coalesce(u.flagexcluido,0)=0 and login="{}" and senha=md5("{}") and (u.empresa_id is null or perfil_id="61718DB0-7439-449D-8DD8-5A8BD7604C96");',
	'vendameta'           : 'SELECT emp.empresa_id,emp.empresa_codigo,emp.empresa_nome,if(today.venda,sum(vd.valortotalfinal)+today.venda,sum(vd.valortotalfinal)),(select sum(valor)from metavenda mv where empresa_id=vd.empresa_id and month(mv.data)=month(curdate())and year(mv.data)=year(curdate()))from tmp_venda_mes_atual vd join empresa emp on vd.empresa_id=emp.empresa_id left join(select ms.empresa_id id,sum(ms.valortotal) venda from movimentosaida ms where ms.data=curdate()and ms.flagtipooperacao=1 and coalesce(ms.flagcancelado,0)=0 and coalesce(ms.flagexcluido,0)=0 group by ms.empresa_id)today on today.id=vd.empresa_id where month(vd.data_analise)=month(curdate())and year(curdate())=year(vd.data_analise)group by vd.empresa_id;',
	'vendavendedor'       : 'SELECT p.pessoa_id,emp.empresa_id,p.nome,round(sum(db.vendas),2),round(sum(db.vendas)/count(db.id),2),sum(db.itens),count(db.id),round(sum(db.itens)/count(db.id),2)from(select ms.valortotal "vendas",ms.movimentosaida_id "id",max(mp.numeroitem)-sum(mp.flagcancelado) "itens",ms.vendedor_pessoa_id "pessoa_id",ms.empresa_id "empresa_id" from movimentosaidaproduto mp join movimentosaida ms on mp.movimentosaida_id=ms.movimentosaida_id where year(ms.data)=year(curdate()) and month(ms.data)=month(curdate())and coalesce(ms.flagcancelado,0)=0 and coalesce(ms.flagexcluido,0)=0 and ms.flagtipooperacao=1 group by mp.movimentosaida_id) db left join pessoa p on db.pessoa_id=p.pessoa_id join empresa emp on emp.empresa_id=db.empresa_id group by p.nome,emp.empresa_id;',
	'vendalojadia'        : 'SELECT e.empresa_id,e.empresa_nome,sum(ms.valortotal) as venda,count(ms.movimentosaida_id),sum(ms.valortotal)/count(ms.movimentosaida_id) from movimentosaida as ms join empresa as e on ms.empresa_id=e.empresa_id where coalesce(ms.flagcancelado,0)=0 and coalesce(ms.flagexcluido,0)=0 and ms.flagtipooperacao=1 and ms.`data`=curdate() group by e.empresa_nome;',
	'vendalojamesatual'   : 'SELECT e.empresa_id,e.empresa_nome,sum(ms.valortotal) as venda,count(ms.movimentosaida_id),sum(ms.valortotal)/count(ms.movimentosaida_id) from movimentosaida as ms join empresa as e on ms.empresa_id=e.empresa_id where coalesce(ms.flagcancelado,0)=0 and coalesce(ms.flagexcluido,0)=0 and ms.flagtipooperacao=1 and month(ms.`data`)=month(curdate())and year(ms.`data`)=year(curdate()) group by e.empresa_nome;',
	'vendalojadiaanterior': 'SELECT e.empresa_id,e.empresa_nome,sum(ms.valortotal) as venda,count(ms.movimentosaida_id),sum(ms.valortotal)/count(ms.movimentosaida_id) from movimentosaida as ms join empresa as e on ms.empresa_id=e.empresa_id where coalesce(ms.flagcancelado,0)=0 and coalesce(ms.flagexcluido,0)=0 and ms.flagtipooperacao=1 and ms.`data`=subdate(curdate(),interval 1 day) group by e.empresa_nome;',
	'vendalojamesanterior': 'SELECT e.empresa_id,e.empresa_nome,sum(ms.valortotal) as venda,count(ms.movimentosaida_id),sum(ms.valortotal)/count(ms.movimentosaida_id) from movimentosaida as ms join empresa as e on ms.empresa_id=e.empresa_id where coalesce(ms.flagcancelado,0)=0 and coalesce(ms.flagexcluido,0)=0 and ms.flagtipooperacao=1 and month(ms.`data`)=month(subdate(curdate(),interval 1 month)) and year(ms.`data`)=year(curdate()) group by e.empresa_nome;'
})





# Created connect wiht data base
db.loggin  = db.connect()
db.thread  = db.connect()




###
  # Se não encontra uma imagem no banco de dados, usa a imagem salva com o id do usuário
  # Se não encontrar uma imgam salva com o id retorna None para o js não precisar fazer nada
###
def userimage( image_url, user_id ):
	# remove as aspas do url
	if image_url:
		return re.sub( r'(^"|"$)', '' , image_url )

	# checa se existe a imagem salva na pasta
	elif os.path.isfile( f'./img/users/{ user_id }.png' ):
		return f'./img/users/{ user_id }.png'

	return None







###
  # Threading para fazer sempre a atualização das variáveis
###
def sales_update( interval = 300 ):
	while True:
		group = conso.debug( 'Thread: update database started.' )

		group.print( f'Query GetMeta started: { conso.tick() }' )
		err = getmeta()
		if err:
			group.print( f'<%@0;31 Error Code: { err[0] }.%>' )
		else:
			group.print( f'Query GetMeta ended:   { conso.tick() }' )


		group.print( f'Query GetVendaVendedor started: { conso.tick() }' )
		err = getvendavendedor()
		if err:
			group.print( f'<%@0;31 Error Code: { err[0] }.%>' )
		else:
			group.print( f'Query GetVendaVendedor ended:   { conso.tick() }' )

		# getvendalojadia( None )
		# getvendalojadiaanterior( None )
		# getvendalojamesatual( None )
		# getvendalojamesanterior( None )

		db.lasupdate = conso.tick()
		conso.debug( 'Thread: update database ended.' )
		eel.sleep( interval )





###
	# Faz a pesquisa no banco em seguida verifica se existe mais
	#   de um usuário repetido e retorna um objeto com as informações do usuário
###
@eel.expose
def tryconnect( usr, pasw ):
	db.loggin.execute( get.users.format( usr, pasw ))

	index = 0
	user = object()
	for cell in db.loggin.fetchall():
		index += 1

		user.user         = cell[0].lower()
		user.name         = cell[1]
		# user.pasw         = cell[2].lower()
		user.company      = cell[3]
		user.img          = userimage( cell[4], cell[5] )
		user.user_id      = cell[5]
		user.perfil_id    = cell[6]
		user.empresa_nome = cell[7]


	if index > 0:
		result = None
		# a consulta faz a pesquisa no usuário e senha expecífica, mas se existe mais de um usuário (duplicado)
		if index > 1:
			conso.warn( 'Este usuário está repetido uma ou mais vezes.' )


		# Validação de login permitindo apenas funcionários sem perfil e sem empresa. Basicamente, seria usuários ADMs
		if user.empresa_nome is None and not user.perfil_id:
			result = user

		# Somente o perfil de genrete está sendo válido
		elif user.empresa_nome and user.perfil_id == '61718DB0-7439-449D-8DD8-5A8BD7604C96':
			result = {
				'lasupdate': db.lasupdate,
				'user'     : user,
				'loja'     : db.metavenda[ user.company ],
				'vendedor' : db.vendedor._filter( 'empresa_id', user.company )
			}


		return result


	else:
		return None






###
  # Se tudo der certo, atualiza a variável e retorna None.
  # Se erro, retorna o erro.
###
def getmeta():
	try:
		db.thread.execute( get.vendameta )

		for row in db.thread.fetchall():
			db.metavenda[ row[0] ] = {
				'empresa_id' : row[0],
				'codigo'     : row[1],
				'nome'       : row[2] ,
				'value'      : float( row[3] ),
				'meta'       : float( row[4] )
			}

	except MySQLdb.Error as err:
		conso.error( detail.args[1] )
		return detail.args




###
  # Se tudo der certo, atualiza a variável e retorna None.
  # Se erro, retorna o erro.
###
def getvendavendedor():
	try:
		db.thread.execute( get.vendavendedor )

		for row in db.thread.fetchall():
			db.vendedor[ row[0] ] = {
				'pessoa_id'    : row[0],
				'empresa_id'   : row[1],
				'nome'         : row[2] ,
				'value'        : float( row[3] ),
				'ticket_medio' : float( row[4] ),
				'itens'        : float( row[5] ),
				'ticket'       : int( row[6] ),
				'pa'           : float( row[7] )
			}


	# MySQLdb.OperationalError
	except MySQLdb.Error as detail:
		# rollback transaction here
		# db.thread.rollback()

		conso.error( detail.args[1] )
		return detail.args







def getvendalojadia( id = None ):
	db.thread.execute( get.vendalojadia )

	for row in db.thread.fetchall():
		if id == None:
			db.lojavendadia[ row[0] ] = {
				'empresa_id'   : row[0],
				'empresa_nome' : row[1],
				'venda'        : float( row[2] ) ,
				'ticket'       : int( row[3] ),
				'ticket_medio' : float( row[4] )
			}

		elif row[0] == id:
			return {
				'empresa_id'   : row[0],
				'empresa_nome' : row[1],
				'venda'        : float( row[2] ) ,
				'ticket'       : int( row[3] ),
				'ticket_medio' : float( row[4] )
			}

	return db.lojavendadia





def getvendalojadiaanterior( id = None ):
	db.thread.execute( get.vendalojadiaanterior )

	for row in db.thread.fetchall():
		if id == None:
			db.lojavendadiaanterior[ row[0] ] = {
				'empresa_id'   : row[0],
				'empresa_nome' : row[1],
				'venda'        : float( row[2] ) ,
				'ticket'       : int( row[3] ),
				'ticket_medio' : float( row[4] )
			}

		elif row[0] == id:
			return {
				'empresa_id'   : row[0],
				'empresa_nome' : row[1],
				'venda'        : float( row[2] ) ,
				'ticket'       : int( row[3] ),
				'ticket_medio' : float( row[4] )
			}

	return db.lojavendadiaanterior






def getvendalojamesatual( id = None ):
	db.thread.execute( get.vendalojamesatual )

	for row in db.thread.fetchall():
		if id == None:
			db.lojavendamesatual[ row[0] ] = {
				'empresa_id'    : row[0],
				'empresa_nome'  : row[1],
				'venda'         : float( row[2] ) ,
				'ticket'        : int( row[3] ),
				'ticket_medio'	: float( row[4] )
			}

		elif row[0] == id:
			return {
				'empresa_id'   : row[0],
				'empresa_nome' : row[1],
				'venda'        : float(row[2]) ,
				'ticket'       : int( row[3] ),
				'ticket_medio' : float(row[4])
			}

	return db.lojavendamesatual





def getvendalojamesanterior( id = None ):
	db.thread.execute( get.vendalojamesanterior )

	for row in db.thread.fetchall():
		if id == None:
			db.lojavendamesanterior[ row[0] ] = {
				'empresa_id'   : row[0],
				'empresa_nome' : row[1],
				'venda'        : float( row[2] ) ,
				'ticket'       : int( row[3] ),
				'ticket_medio' : float( row[4] )
			}

		elif row[0] == id:
			return {
				'empresa_id'   : row[0],
				'empresa_nome' : row[1],
				'venda'        : float(row[2]) ,
				'ticket'       : int( row[3] ),
				'ticket_medio' : float(row[4])
			}

	return db.lojavendamesanterior





# eel.spawn( sales_update )
t = threading.Thread( target = sales_update )
t.start()
