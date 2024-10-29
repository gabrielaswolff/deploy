const express = require('express');
const cors = require('cors');
const connection = require('./db_config');

const app = express();
const porta = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());


app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));


app.post('/usuario/cadastrar', (request, response) => {
    const { name, email, password, cpf_number } = request.body;

    let checkQuery = 'SELECT * FROM users WHERE name = ? OR email = ?';
    connection.query(checkQuery, [name, email], (err, results) => {

        if (err) {
            console.error('Erro', err);
            return response.status(500).json({ success: false, message: 'erro', data: err });
        }
        if (results.length > 0) {
            return response.status(400).json({ success: false, message: 'nome ou email já está cadastrado.' });
        }

        let query = 'INSERT INTO users(name, email, password, cpf_number) VALUES(?,?,?,?)';
        let params = [name, email, password, cpf_number];
        connection.query(query, params, (err, results) => {
            if (err) {
                console.error('erro ao cadastrar usuario', err);
                return response.status(500).json({ success: false, message: 'erro', data: err });
            }

            const newUser = {
                id: results.insertId,
                name,
                email,
                password, 
                perfil: 'user' 
            };


            response.status(201).json({
                success: true,
                message: 'sucesso pessoal',
                data: newUser 
            });
        });
    });

});

      
app.get('/usuarios/listar', (request, response) => {
    const query = 'select * from users';

    connection.query(query, (err, results) => {

    
    if(results) {
        response
        .status(200)
        .json({
            success: true,
            message: 'sucesso',
            data: results

        })
    } else {
        response
        .status(400)
        .json({
            success: false,
            message: 'sem sucesso',
            data: err
        })
    }

    })


})


app.put('/usuario/editar/:id', (request, response) => {
    const { name, cpf_number, email, password } = request.body;
    const id = request.params.id;
    
    
    let params = [name, cpf_number, email, password, id];
    
    let query = `
        UPDATE users
        SET name = ?, cpf_number = ?, email = ?, password = ?
        WHERE id = ?
    `;
    
    connection.query(query, params, (err, results) => {
        if (results) {
            response.status(200).json({
                success: true,
                message: 'Edição realizada com sucesso',
                data: results
            });
        } else {
            response.status(400).json({
                success: false,
                message: 'Erro ao editar',
                data: err
            });
        }
    });
});


app.delete('/usuario/deletar/:id', (request, response) => {
    let params = Array(
        request.params.id
    );

    let query = 'delete from users where id = ?;'

    connection.query(query, params, (err, results) => {
        if(results) {
            response
            .status(200)
            .json({
                success: true,
                message: 'sucesso pessoal :p',
                data: results  
            })
        } else {
            response
            .status(400)
            .json({
                success: false,
                message: 'sem sucesso',
                data: err
            })
        }
    }
    )

})