// Define o formato exato que vamos entregar para a Thamires (Front-end)
export interface PokemonMapeado {
    id: number;
    nome: string;
    foto: string;
    tipos: string[];
}

export const buscarPokemonsIniciais = async (): Promise<PokemonMapeado[]> => {
    // 1. Busca os 20 primeiros na PokeAPI
    const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    
    if (!resposta.ok) {
        throw new Error('Falha ao buscar a lista inicial da PokeAPI');
    }

    const dados = await resposta.json();

    // 2. Faz um loop assíncrono para buscar os detalhes de cada um
    const promessasDetalhes = dados.results.map(async (pokemon: { url: string }) => {
        const resDetalhe = await fetch(pokemon.url);
        const detalhe = await resDetalhe.json();
        
        // 3. Formata e limpa o lixo, retornando apenas o que importa
        return {
            id: detalhe.id,
            nome: detalhe.name,
            foto: detalhe.sprites.other['official-artwork'].front_default,
            tipos: detalhe.types.map((t: any) => t.type.name)
        };
    });

    // Espera todas as 20 requisições de detalhes terminarem
    const dadosTratados = await Promise.all(promessasDetalhes);

    return dadosTratados;
};