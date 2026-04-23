import express from 'express';
import cors from 'cors';
import rotasApi from './routes/api';

const app = express();
const PORTA = 8000;

// 1. Ativa o CORS para permitir que o Frontend acesse do localhost 
app.use(cors({
  origin: [
    'https://gestaoprojetosequipe3-testes.vercel.app', // Sua URL do print
    'http://localhost:5173' // Para você continuar conseguindo testar local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 2. Permite que o servidor entenda JSON (útil para a Sprint 2)
app.use(express.json());

// 3. Avisa ao servidor para usar o nosso "Mapa" colocando o prefixo /api
app.use('/api', rotasApi);

// 4. Liga o motor!
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORTA}`);
    console.log(`👉 Teste a rota em http://localhost:${PORTA}/api/pokemon`);
});
