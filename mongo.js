const mongoose=require('mongoose')

const password= process.argv[2]
const name=process.argv[3]
const number=process.argv[4]

const url = `mongodb+srv://zergio200kism:${password}@cluster0.nrrwemm.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)
mongoose.connect(url)


const phonebookSchema= new mongoose.Schema({
    name: String,
    number: String
})

const Phonebook=mongoose.model("Phonebook",phonebookSchema,"phonebooks")

                       

console.log(process.argv)

if(process.argv.length==3){
        Phonebook.find({}).then(result => {
            result.forEach(phonebook =>{console.log(phonebook)})
            mongoose.connection.close()
        })    
        
}else if (process.argv.length==5){
       const phonebook= new Phonebook({name:name,number:number})

        phonebook.save().then(result=> {console.log(result,"phonebook saved")
            mongoose.connection.close()   
         }) 
          
}else{
    console.log("faltan argumentos")
    mongoose.connection.close()   
}