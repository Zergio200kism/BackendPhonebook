const express=require('express')
const morgan=require('morgan')
const cors=require('cors')
const app= express();

app.use(cors())


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(express.static('dist'))
const requestLogger = (request,response,next) =>{
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()   
}

const unknownEndpoint= (request,response)=>{
    response.status(404).send({error:'unknown Endpoint'})
}


app.use(requestLogger)



let phonebook =[
                    { 
                    "id": "1",
                    "name": "Arto Hellas", 
                    "number": "040-123456"
                    },
                    { 
                    "id": "2",
                    "name": "Ada Lovelace", 
                    "number": "39-44-5323523"
                    },
                    { 
                    "id": "3",
                    "name": "Dan Abramov", 
                    "number": "12-43-234345"
                    },
                    { 
                    "id": "4",
                    "name": "Mary Poppendieck", 
                    "number": "39-23-6423122"
                    }
                ]

app.get('/api/phonebook',(request,response)=>{

    //Podemos usar  una de estas lineas de codigo
        //response.send(phonebook);
        response.json(phonebook);  //Esto es mejor porque dejo claro que estás enviando una respuesta en formato JSON.
})


app.get('/info',(request,response)=>{
    const date=new Date()
    const phonebokLength=phonebook.length;
    response.send(`<p>Phonebook has ${phonebokLength} people</p><p>${date}</p>`)
})

app.get('/api/phonebook/:id',(request,response)=>{
    const id=request.params.id

    const person=phonebook.find(person => person.id==id);

    if(person){
        response.json(person);
    }else{
        response.status(404).end()
    }
})

app.delete('/api/phonebook/:id', (request,response)=>{
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})
const generateId = () => {
    const maxId = phonebook.length > 0
      ? Math.max(...phonebook.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
}

app.post('/api/phonebook',(request,response)=>{
    const body=request.body
    console.log(body.number)

    if(body.number == "" ){
        return response.status(400).json({error:'number is missing'})
    }else{
        
        const persona=phonebook.find(person => person.name==body.name)
        console.log(persona)
        if(persona){
            return response.status(400).json({error:'El nombre ya esxiste'})
        }else{
            const person = {
                name: body.name,
                number: body.number,
                id: generateId(),
              }
            
              phonebook = phonebook.concat(person)
            
              response.json(person)
        }

    }

})

app.use(unknownEndpoint)
const PORT= process.env.PORT || 3001
app.listen(PORT,()=>{console.log("Escuchando peticiones...")})