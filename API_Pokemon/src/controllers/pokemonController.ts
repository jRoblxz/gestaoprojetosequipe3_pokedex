import { Request, Response } from 'express';
import { buscarPokemonsIniciais } from '../services/pokeApiService';

export const getPokemons = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const search = (req.query.search as string) || '';
        const type = (req.query.type as string) || ''; // <- Captura o tipo aqui
        
        // Passa o tipo para o Service
        const resultado = await buscarPokemonsIniciais(page, search, type);

        res.status(200).json({
            success: true,
            data: resultado.dados,
            current_page: page,
            last_page: resultado.lastPage
        });
        
    } catch (erro) {
        console.error("Erro no PokemonController:", erro);
        res.status(500).json({ success: false, data: [], erro: 'Erro interno' });
    }
};