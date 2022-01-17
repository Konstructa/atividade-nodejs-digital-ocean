const express = require('express');
const app = express();
const port = 3000;

const listaHerois = ["Capitã América", "Viuva Negra", "Batwoman"]

//body das req serão em json
app.use(express.json());


app.get('/', (res) => {
    res.send("Hello World");
})


app.get('/heroi', (req, res) => {

    //Boolean so retorna true, valores que existem
    res.status(200).json(
        {
            valor: listaHerois.filter(Boolean)
        }
        );
})


app.get('/heroi/:id', (req, res) => {
    //para que não exista heroi 0
    const id = req.params.id - 1;
    if (!listaHerois[id]){
        res.status(404).send(
           "Heroi não encontrado"
           );
        
        return
    }
    res.status(302).json(
        {
            valor: listaHerois[id]
        }
        );
})


app.post('/heroi', (req, res) => {

    const registro = req.body.nome;

    if (!registro || registro === ""){
        res.status(406).send(
            "Você não enviou um dado"
            ); 

        return       
    }

    listaHerois.unshift(registro);

    res.status(201).send(
        "Criado com sucesso!"
        );

});


app.put('/heroi/:id', (req, res) => {
    const id = req.params.id - 1;

    if (!listaHerois[id] ||
        !req.body.nome ||
        req.body.nome === ""
        ){
        res.status(406).send(
            "Você digitou o ID errado e/ou não inseriu o valor de mudança"
        )
    }

    listaHerois[id] = req.body.nome;

    res.status(320).send("Ok")
});


app.delete('/heroi/:id', (req, res) => {
    //ou req.body e dps so o id.id
    const id = req.params.id - 1;

    if (!listaHerois[id]) {
        res.status(404).send(
            "Heroi não encontrado"
            );
        
        return
    }

    delete listaHerois[id]

    res.status(202).send(
        "Heroi deletado"
        );

});


app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`)
});