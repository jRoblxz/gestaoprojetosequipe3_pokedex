import { Request, Response } from 'express';
import { buscarPokemonsIniciais } from '../services/pokeApiService';

export const getPokemons = async (req: Request, res: Response): Promise<void> => {
    try {
        const pokemons = await buscarPokemonsIniciais();
        
        // Devolve no formato do Contrato do DB
        res.status(200).json({
            success: true,
            data: pokemons
        });
        
    } catch (erro) {
        console.error("Erro no PokemonController:", erro);
        
        // Tratamento de erro 
        res.status(500).json({ 
            success: false,
            data: [],
            erro: 'Não foi possível carregar os dados dos Pokémon no momento.' 
        });
    }
};