const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

function validator (val) {
    const splitted = val.split('-')
    console.log(splitted[0].length)

    if (val.length < 8) {
        return false
    }
    if (splitted.length !== 2) {
        return false
    }
    if (splitted[0].length > 3 || splitted[0].length < 2) {
        return false
    }

    return true
}

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        validate: validator
    }
    // id: Number,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
