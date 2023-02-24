const express = require('express')
var morgan = require("morgan")
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require("./model/person")
app.use(cors())
app.use(express.json())
morgan.token("json", (req, res) => {
    return JSON.stringify({
        name: req.body.name,
        number: req.body.number
    })
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(express.static('build'))
const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)
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

})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
        res.json(person)
    })
})

app.get('/info', (req, res) => {
    var d = new Date()
    Person.countDocuments({}, (err, count) => {
        if (err) {
            console.error(err)
            res.status(500).send('Internal server error')
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.write("Phonebook has info for " + count + " people <br>" + d.toString())
            res.end()
        }
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.find({ _id: id }).then(person => {
        console.log(person)
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    persons = Person.findByIdAndRemove(id).then(person => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    persons = Person.findByIdAndUpdate(id, {
        name: req.body.name,
        number: req.body.number
    }, {new:true, runValidators:true, context: 'query'}).then(person => {
        res.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    // console.log("the number", body.number)
    // console.log("the name", body.name)

    if (!body.number || !body.name) {
        return res.status(400).json({
            error: 'content missing'
        })
    }
    // const array = Person.find({ name: body.name })
    // if (array) {
    //     return res.status(400).json({
    //         error: 'name already added'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
        // id: Math.floor(Math.random() * 10000)
    })
    console.log("the name", body.name)
    person.save().then(savedPerson => {
        res.json(savedPerson)
    }).catch(error => next(error))
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

