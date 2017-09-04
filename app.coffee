is_uuid = require 'isuuid'
express = require 'express'
app = express()
path = require 'path'
bookshelf = require './connection2.coffee'
body_parser = require 'body-parser'
json_parser = body_parser.json()

Simulator = bookshelf.Model.extend tableName: 'simulators'

app.use express.static __dirname + '/public'

app.get '/', (req,res) -> 
	res.sendFile path.join __dirname + '/public/index.html'

handleError = (status_code, message, res) ->
	res.status(status_code).send error: message
	null

app.get '/api/simulators', (req,res) ->
	search = req.query.search;
	if search
		search = search.replace /_%/, ''
		simulator = Simulator.query (qb) ->
			qb.where 'name', 'LIKE', bookshelf.knex.raw '?',[search+'%']
	else
		simulator = Simulator.forge()
	simulator
		.orderBy 'name','ASC'
		.fetchAll()
		.then (content) -> res.json content
		.catch -> handleError 500,'Internal Server Error!' 
	null

app.post '/api/simulators', json_parser, (req,res) -> 
	if typeof req.body.name == 'string' && 
		 typeof req.body.type_number == 'string' &&
		 Number.isInteger parseInt req.body.price
		if req.body.name.length > 0 && req.body.type_number.length > 0
			Simulator
				.where 'type_number', req.body.type_number
				.fetch()
				.then (content) -> 
					console.log content
					if !content?
						new Simulator
							name: req.body.name
							type_number: req.body.type_number
							price: req.body.price
						.save()
						.then (content) ->
							res.json {content}
					else
						handleError 400, 'This Type number already exists!',res
				.catch -> handleError 500, 'Internal Server Error!', res
		else 
			handleError 400, 'None of the fields can be empty'
	else 
		handleError 400, 'Bad Type!', res

app.delete '/api/simulators/:id', (req,res) -> 
	if is_uuid req.params.id
		Simulator
			.where 'id', req.params.id
			.destroy()
			.then (content) -> 
				res.send {content}
			.catch ->
				handleError 500, 'Internal Server Errror'
	else
		handleError 400, 'This is an invalid UUID'

console.log 'Listen to the 3000 port!'

app.listen(3000)


