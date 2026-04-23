import { Request, Response } from 'express';
import { buscarPokemonsIniciais } from '../services/pokeApiService';

export const getPokemons = async (req: Request, res: Response): Promise<void> => {
    try {
        // Pega a página da URL. Se não tiver nada, assume que é a página 1
        const page = parseInt(req.query.page as string) || 1;
        
        // Busca usando a nossa nova função paginada
        const pokemons = await buscarPokemonsIniciais(page);
        
        // Calcula o total de páginas (151 dividido por 18, arredondado pra cima dá 9)
        const lastPage = Math.ceil(151 / 18);

        // Devolve o JSON exatamente na estrutura que o React da Thamires precisa!
        res.status(200).json({
            success: true,
            data: pokemons,
            current_page: page,
            last_page: lastPage
        });
        
    } catch (erro) {
        console.error("Erro no PokemonController:", erro);
        
        res.status(500).json({ 
            success: false,
            data: [],
            erro: 'Não foi possível carregar os dados dos Pokémon no momento.' 
        });
    }
};