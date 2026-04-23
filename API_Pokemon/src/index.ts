import express from 'express';
import cors from 'cors';
import rotasApi from './routes/api';

const app = express();
const PORTA = 8000;

// 1. Ativa o CORS para permitir que o Frontend acesse do localhost e a produção
app.use(cors({
  origin: [
    'https://pokedex-fatecpp.vercel.app/',
    'gestaoprojetosequipe3-testes-ircs3c5ze-joaos-projects-e09f90c2.vercel.app', // URL do frontend hospedado no Vercel
    'http://localhost:5173' // Para continuar conseguindo testar local
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
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
    console.log(` Teste a rota em http://localhost:${PORTA}/api/pokemon`);
});
