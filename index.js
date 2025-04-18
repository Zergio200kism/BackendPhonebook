require('dotenv').config()


const express=require('express')

const Person=require('./models/person')

const app= express();
app.use(express.static('dist'))
const cors=require('cors')
app.use(cors())
const requestLogger = (request,response,next) =>{
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()   
}
app.use(requestLogger)

const unknownEndpoint= (request,response)=>{
    response.status(404).send({error:'unknown Endpoint'})
}
app.use(express.json())

const morgan=require('morgan')
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let phonebook =[
                    // { 
                    // "id": "1",
                    // "name": "Arto Hellas", 
                    // "number": "040-123456"
                    // },
                    // { 
                    // "id": "2",
                    // "name": "Ada Lovelace", 
                    // "number": "39-44-5323523"
                    // },
                    // { 
                    // "id": "3",
                    // "name": "Dan Abramov", 
                    // "number": "12-43-234345"
                    // },
                    // { 
                    // "id": "4",
                    // "name": "Mary Poppendieck", 
                    // "number": "39-23-6423122"
                    // }
                ]

app.get('/api/phonebook',(request,response)=>{

        Person.find({}).then(persons =>{response.json(persons)} )

})

app.get('/info',(request,response)=>{
    const date=new Date()
    const phonebokLength=Person.countDocuments({}).then(result => response.send(`<p>Phonebook has ${result} people</p><p>${date}</p>`));
    //response.send(`<p>Phonebook has ${phonebokLength} people</p><p>${date}</p>`)
})


app.get('/api/phonebook/:id',(request,response)=>{
    const id=request.params.id

    const person=Person.findById(id).then(person => response.json(person)).catch(error => {
        response.status(400).send({ error: 'malformatted id' })
      })
    // const person=phonebook.find(person => person.id==id);

    // if(person){
    //     response.json(person);
    // }else{
    //     response.status(404).end()
    // }
})

app.delete('/api/phonebook/:id',async (request,response)=>{
    const id=request.params.id

    try {
      const result = await Person.findByIdAndDelete(id);
      console.log(id,result)  
      if (result) {
        response.json({exito:"Elemento eliminado con exito"}); // ✅ Eliminado con éxito, sin contenido
      } else {
        response.status(404).send({ error: 'Note not found' }); // ❌ No se encontró el documento
      }
    } catch (error) {
      response.status(400).send({ error: 'Malformatted id' }); // ⚠️ ID inválido
    }
})

app.post('/api/phonebook',(request,response)=>{
    const body=request.body
    console.log(body)
    if (!body.name) {
        return response.status(400).json({ error: 'content missing' })
      }
    
      const person = new Person({
        name: body.name,
        number: body.number,
      })
    
      person.save().then((savedPerson) => {
        response.json(savedPerson)
      })
})
app.put(`/api/phonebook/:id`,async(request,response)=>{
    const id = request.params.id;
    const body = request.body;
    console.log(body)
    try {
      const updatedPerson = await Person.findByIdAndUpdate(
        id,
        {
          name: body.name,
          number: body.number,
        },
        {
          new: true,            // <- Retorna el documento ya actualizado
          runValidators: true,  // <- Ejecuta validaciones definidas en el esquema
          context: 'query'      // <- Necesario para algunas validaciones
        }
      );
  
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).send({ error: 'Person not found' });
      }
    } catch (error) {
      console.error(error);
      response.status(400).send({ error: 'Malformatted ID or validation error' });
    }
})
app.use(unknownEndpoint)
const PORT= process.env.PORT || 3001
app.listen(PORT,()=>{console.log("Escuchando peticiones...")})