export interface PokemonContract {
    id: number;
    name: string;
    types: string[];
    image_url: string;
}

export const buscarPokemonsIniciais = async (page: number = 1): Promise<PokemonContract[]> => {
    const limitPorPagina = 18;
    const totalGen1 = 151; // Queremos travar aqui!
    
    // Calcula quantos pokémons precisamos pular com base na página atual
    const offset = (page - 1) * limitPorPagina;

    // Se pedirem uma página bizarra que passa dos 151, retornamos vazio
    if (offset >= totalGen1) {
        return [];
    }

    // A mágica: Se for a última página, pega só o que falta pra dar 151 (senão pega 18)
    const limit = Math.min(limitPorPagina, totalGen1 - offset);

    // Chama a PokeAPI com a paginação exata
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    
    if (!resposta.ok) {
        throw new Error('Falha ao buscar a lista inicial da PokeAPI');
    }

    const dados = await resposta.json();

    const promessasDetalhes = dados.results.map(async (pokemon: { name: string, url: string }) => {
        const urlParts = pokemon.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 2]);

        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        const resDetalhe = await fetch(pokemon.url);
        const detalhe = await resDetalhe.json();
        
        return {
            id: id,
            name: pokemon.name,
            types: detalhe.types.map((t: any) => t.type.name),
            image_url: imageUrl
        };
    });

    const dadosTratados = await Promise.all(promessasDetalhes);

    return dadosTratados;
};