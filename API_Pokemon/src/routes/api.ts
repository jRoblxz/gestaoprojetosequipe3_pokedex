import { Router } from 'express';
import { getPokemonById, getPokemons } from '../controllers/pokemonController';

const rotas = Router();

// Quando o navegador acessar GET /pokemon, o pokemonController assume
rotas.get('/pokemon', getPokemons);

rotas.get("/pokemon/:id", getPokemonById);

export default rotas;