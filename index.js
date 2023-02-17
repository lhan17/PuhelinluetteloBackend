const express = require('express')
var morgan = require("morgan")
const app = express()

const cors = require('cors')

app.use(cors())

app.use(express.json())
morgan.token("json", (req, res) => {
    return JSON.stringify({
        name: req.body.name,
        number: req.body.number
    })
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    var d = new Date()
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write("Phonebook has info for " + persons.length + " people <br>" + d.toString())
    res.send(Date.now())
    res.end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    // console.log("the number", body.number)
    // console.log("the name", body.name)

    if (!body.number || !body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    const array = persons.find(person => person.name === body.name)
    if (array) {
        return res.status(400).json({
            error: 'name already added'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 10000)
    }

    persons.concat(person)
    res.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

