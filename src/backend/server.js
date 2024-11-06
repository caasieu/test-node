// server.js
import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';
import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Aqui estou criando o servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Area de configuraçao do redis para cache
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});


redisClient.on('connect', () => { 
    console.log('Conectado ao Redis');
});


// Area de configuração do Sequelize com sqlite
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // Local do banco de dados SQLite
});


// sincronizacao do banco de dados e inicializar o servidor
const initDb = async () => {
    try {
      // Sincronizando o banco de dados
      await sequelize.sync({ force: true });  // Use { force: true } apenas no desenvolvimento
      console.log('Banco de dados sincronizado com sucesso!');
    } catch (error) {
      console.error('Erro ao sincronizar o banco de dados:', error);
    }
  };
  
// Inicializando o banco de dados
initDb();


// Rota simples para adicionar um usuário
app.post('/users', express.json(), async (req, res) => {
    const { name, email } = req.body;
    try {
      const user = await User.create({ name, email });
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});


// Rota para obter os usuários com cache do Redis
app.get('/users', async (req, res) => {
    const cacheKey = 'users';
  
    // Verifica se o dado existe no Redis
    redisClient.get(cacheKey, async (err, data) => {
      if (err) throw err;
  
      if (data) {
        // Retorna os dados do Redis se disponíveis
        console.log('Dados do cache (Redis)');
        return res.json(JSON.parse(data));
      }
  
      // Se não houver cache, faz a consulta ao banco de dados
      try {
        const users = await User.findAll();
        // Armazenar os dados no Redis com um tempo de expiração de 1 minuto
        redisClient.setex(cacheKey, 60, JSON.stringify(users));
        console.log('Dados do banco de dados');
        res.json(users);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
});


// Iniciando o servidor Express
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});