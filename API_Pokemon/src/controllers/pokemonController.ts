import { Request, Response } from 'express';
import { buscarPokemonsIniciais } from '../services/pokeApiService';

export const getPokemons = async (req: Request, res: Response): Promise<void> => {
    try {
        // Chama o trabalhador braçal (Service)
        const pokemons = await buscarPokemonsIniciais();
        
        // Empacota e devolve o JSON com status 200 (OK)
        res.status(200).json(pokemons);
        
    } catch (erro) {
        console.error("Erro no PokemonController:", erro);
        // Se a PokeAPI cair, nosso servidor não quebra, apenas avisa o Front
        res.status(500).json({ 
            erro: 'Não foi possível carregar os dados dos Pokémon no momento.' 
        });
    }
};