export interface PokemonContract {
    id: number;
    name: string;
    types: string[];
    image_url: string;
}

export const buscarPokemonsIniciais = async (): Promise<PokemonContract[]> => {
    // 1. Busca os 20 primeiros
    const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    
    if (!resposta.ok) {
        throw new Error('Falha ao buscar a lista inicial da PokeAPI');
    }

    const dados = await resposta.json();

    // 2. Loop para buscar os detalhes (necessário por causa dos Tipos)
    const promessasDetalhes = dados.results.map(async (pokemon: { name: string, url: string }) => {
        
        
        const urlParts = pokemon.url.split('/');

        const id = parseInt(urlParts[urlParts.length - 2]);

        // Monta a imagem dinamicamente
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

        // Busca o detalhe na PokeAPI apenas para descobrir os 'types'
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