import { Request, Response } from 'express';
// Ajuste o caminho de importação do seu service conforme a sua pasta
import { buscarPokemonsIniciais } from '../services/pokeApiService'; 

export const getPokemons = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const search = req.query.search as string || '';
        const type1 = req.query.type1 as string || 'all'; // Recebe type1
        const type2 = req.query.type2 as string || 'all'; // Recebe type2
        const limit = parseInt(req.query.limit as string) || 18;

        // 2. Enviamos todos os 4 parâmetros para o Service
        const resultado = await buscarPokemonsIniciais(page, search, type1, type2, limit);
        
        // 3. Retornamos o JSON formatado para o Front-end
        res.json({
            success: true,
            data: resultado.dados,
            current_page: page,
            last_page: resultado.lastPage 
        });

    } catch (error) {
        console.error("Erro no Controller:", error);
        res.status(500).json({ success: false, error: 'Erro ao buscar pokemons' });
    }
};