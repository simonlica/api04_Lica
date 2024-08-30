// eliminar tasks existentes
//incerir uma nova taks

const express = require('express');
const mysql = require('mysql2');
const cors = ('cors');

const mysql_config = require('/inc/mysql_config');
const functions = require('/inc/functions');

const API_AVAILABILITY = true;
const API_VERSION = '4.0.0';

const app = express();
app.listen(3000,()=>{
    console.log("API está ativo")
})

app.use((req,res,next)=>{
    if (API_AVAILABILITY){
        next();
    }else{
        res.json(functions.response('atenção', 'API está em manuntenção, sinto muito', 0, null))
    }
})

const connection = mysql.createConnection(mysql_config);

app.use(cors());

//tratamento dos posts params
app.use(json());
//instrução que pede que o express trate os dados como um json

app.use(express.urlencoded({extended: true}));
//quando é enviado um pedido através do método post, os dados enviados
//através de um formulário podem ser interpretados
//SEM ESSES DOIS MIDLEWERE NÃO SERIA POSSÍVEL BUSCAR OS PARÂMETROS

//rotas
//rota de entrada
app.get('/', (req,res)=>{
    res.json(functions.response('sucesso', 'API está rodando',0, null))
})

//rota pra pegar todas as tasks
app.get('/tasks',(req,res)=>{
    connection.query('SELECT * FROM tasks', (err,rows))
})

//rota pra pegar as taks pelo id
app.get('/tasks/:id', (req,res)=>{
    const id = req.params.id;
    connection.query('SELECT * FROM tasks WHERE id=?', [id], (err, rows)=>{
        if(!err){
            //devolver os dados da task
            if(rows.lengt>0){
                res.json(functions.response('Sucesso', 'Sucesso na pesquisa', rows.lengt,rows))
            }else{
                 res.json(functions.response('Atenção', 'Não foi possivel encontrar a task solicitada', 0, null))
            }
        }
        else{
            res.json(functions.response('error', err.message, 0, null))
        }
    })
})

//rota atualizar o status de uma task - método put
app.put('/tasks/:id/status/:status', (req,res)=>{
    const id = req.params.id;
    const status = req.params.status;
    connection.query('UPDATE tasks SET status =? WHERE id =?', [status,id], (err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucesso','Sucesso na lateração do status', rows.affectedRows,nuul))
            }
            else{
                res.json(functions.response('Atenção', 'Task não encontrada', 0, null))
            }
        }
    })
})

//rota para deletar uma tarefa 
app.delete('/tasks/:id/delete', (req,res)=>{
    const id = req.params.id;
    connection.query('DELETE FROM tasks WHERE id =?', [id], (err,rows)=>{
        if(!err){
            if(rows.affectedRows>0){
                res.json(functions.response('Sucesso', 'Task deletada', rows.affectedRows, null))
            }
            else{
                res.json(functions.response('Atenção', 'Task não encontrada', 0, null))
            }   
        }
        else{
            res.json(functions.response('Erro', err.message, 0, null))
        }

    })
})

//rota para inserir uma nova task
app.put('/tasks/create', (req,res)=>{
    //midleware para a recepção dos dados da tarefa(task)

    //pegando os dados da request
    const post_data = req.body;
    //checar para ver se não estamos recebendo uma json vazia
    if(post_data ==undefined){
        res.json(functions.response('Atenção', 'Sem dados de uma nova task', 0, null))
        return;
    } 
    const taks = post_data.taks;
    const status = post_data.status;


    //inserindo a nova task
    connection.query('INSERT INTO tasks(task,status,created_at) VALUES(?, ?, NOW(), NOW()', [task,status], (err,rows)=>{
        if(!err){
            res.json('Sucesso', 'Task cadastrada no banco', rows.affectedRows, null)
        }
        else{
            res.json(functions.response('Erro', err.message, 0, null))
        }
    })
})

//rota para atualizar o texto de uma task
//o texto da task será enviado através do body
app.put('/tasks/:id/update', (req,res)=>{
    const id = req.params.id;
    const post_data = req.body;

    //checar se os dados estão vazios
    if(post_data == undefined){
        res.json(functions.response('Atenção', 'Dados inválidos', 0, null))
        return
    }

    //declarar as variaveis para recepcionar as informações da task
    const taks = post_data.taks;
    const status = post_data.status;

    //atualização dos dados 
    connection.query('UPDATE tasks SET task=?, updated_at = NOW() WHERE id=?',[taks, status, id],
        (err,rows)=>{
            if(!err){
                if(!err){
                    res.json(functions.response('Sucesso', 'Task atualizada', rows.affectedRows, null));
                }
                else{
                    res.json(functions.response('Atenção', 'Task não encontrada', rows.affectedRows, null));
                }
            }
            else{
                res.json(functions.response('Erro', err.message, 0, null));
            }
        }
    )
    
})

//midleware para caso alguma frota não seja encontrada
app.use((req,res)=>{
    res.json(functions.response('atenção', 'rota não encontrada',0, null))
})