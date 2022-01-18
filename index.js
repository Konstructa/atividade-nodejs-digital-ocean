const express = require('express');
const {MongoClient, ObjectId} = require('mongodb')
const dotenv = require('dotenv');
dotenv.config();

const url = "mongodb+srv://admin:XjPt4tsjBSvJ2eK@cluster0.gv1ny.mongodb.net" || process.env.URL;
const dbName = "aula_ocean";
const port = 3000;



async function main () {

    //conexao com o banco de dados

    const client = await MongoClient.connect(url);

    const db = client.db(dbName);

    const collection = db.collection('herois')


    //Aplicação
    //body das req serão em json
    const app = express();


    app.use(express.json());


    app.get('/', (req, res) => {
        res.send("Hello World");
    })


    app.get('/heroi', async (req, res) => {

        const herois = await collection.find().toArray();

        //Boolean so retorna true, valores que existem
        res.status(200).json(
            {
                valor: herois
            }
            );
    })


    app.get('/heroi/:id', async (req, res) => {
        //para que não exista heroi 0
        const id = req.params.id;

        const item = await collection.findOne({ _id: new ObjectId(id)})

        if (!item){
            res.status(404).send(
            "Heroi não encontrado"
            );
            
            return
        } 

        res.status(302).json(
            {
                valor: item
            }
            );
    })


    app.post('/heroi', async (req, res) => {

        const registro = req.body;

        if (!registro || 
            registro === ""
            ){
            res.status(406).send(
                "Você não enviou um dado"
                ); 

            return       
        }

        await collection.insertOne(registro)

        res.status(201).send(
                registro
            );

    });


    app.put('/heroi/:id', async (req, res) => {
        const id = req.params.id;

        const item = req.body;

        const isFound = await collection.countDocuments({ _id: new ObjectId(id) });

        if (!isFound ||
            !req.body.nome ||
            req.body.nome === ""
            ){
            res.status(406).send(
                "Você digitou o ID errado e/ou não inseriu o valor de mudança"
            )
        } 

        collection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: item, 
            }
        );

        res.status(320).send(item)
    });


    app.delete('/heroi/:id', async(req, res) => {
        //ou req.body e dps so o id.id
        const id = req.params.id;

         const isFound = await collection.findOne({ _id: new ObjectId(id) });

         if (!isFound) {
            res.status(404).send(
                "Heroi não encontrado"
                );
            
            return
        }  

        await collection.deleteOne({_id : new ObjectId(id)})

        res.status(202).send(
            "Heroi deletado"
            );

    });


    app.listen(process.env.PORT || port);

    }

main()

