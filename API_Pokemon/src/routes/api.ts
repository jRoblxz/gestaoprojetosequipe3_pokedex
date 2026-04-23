import { Router } from 'express';
import { getPokemons } from '../controllers/pokemonController';

const rotas = Router();

// Quando o navegador acessar GET /pokemon, o pokemonController assume
rotas.get('/pokemon', getPokemons);

export default rotas;