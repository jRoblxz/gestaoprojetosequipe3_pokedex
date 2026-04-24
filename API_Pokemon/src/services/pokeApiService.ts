export interface PokemonContract {
    id: number;
    name: string;
    types: string[];
    image_url: string;
}

export const buscarPokemonsIniciais = async (page: number = 1, search: string = '', type: string = '', limit: number = 18) => {
    const limitPorPagina = limit;
    let lista = [];

    // SE TIVER FILTRO DE TIPO: Busca na rota de Tipos da PokeAPI
    if (type && type !== 'all') {
        const resType = await fetch(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
        if (!resType.ok) throw new Error('Tipo não encontrado na PokeAPI');
        
        const data = await resType.json();
        // Extrai os pokemons e filtra-os )
        lista = data.pokemon
            .map((p: any) => p.pokemon)
            .filter((p: any) => {
                const urlParts = p.url.split('/');
                const id = parseInt(urlParts[urlParts.length - 2]);
                return id <= 1000;
            });
    } 
    // SE NÃO TIVER FILTRO: Busca tds
    else {
        const respostaLista = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
        if (!respostaLista.ok) throw new Error('Falha ao buscar a PokeAPI');
        const dadosLista = await respostaLista.json();
        lista = dadosLista.results;
    }

    // Aplica o filtro de texto (Busca)
    if (search) {
        lista = lista.filter((pokemon: any) => pokemon.name.includes(search.toLowerCase()));
    }

    // Paginação
    const totalItems = lista.length;
    const lastPage = Math.ceil(totalItems / limitPorPagina) || 1;
    const offset = (page - 1) * limitPorPagina;
    const listaPaginada = lista.slice(offset, offset + limitPorPagina);

    // Busca os detalhes finais (Fotos e Tipos)
    const promessasDetalhes = listaPaginada.map(async (pokemon: { name: string, url: string }) => {
        const urlParts = pokemon.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 2]);
        const resDetalhe = await fetch(pokemon.url);
        const detalhe = await resDetalhe.json();
        
        return {
            id: id,
            name: pokemon.name,
            types: detalhe.types.map((t: any) => t.type.name),
            image_url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        };
    });

    const dadosTratados = await Promise.all(promessasDetalhes);

    return { dados: dadosTratados, lastPage: lastPage };
};