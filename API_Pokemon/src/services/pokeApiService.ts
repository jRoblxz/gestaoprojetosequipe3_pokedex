export interface PokemonContract {
    id: number;
    name: string;
    types: string[];
    image_url: string;
}

export const buscarPokemonsIniciais = async (page: number = 1, search: string = '', type1: string = 'all', type2: string = 'all', limit: number = 18) => {
    const limitPorPagina = limit;
    let lista = [];

    // 1. LÓGICA DOS DOIS TIPOS (Primário e Secundário)
    if (type1 !== 'all' && type2 !== 'all') {
        // Busca a lista do Tipo 1 e pega apenas os que são slot 1 (Primário)
        const res1 = await fetch(`https://pokeapi.co/api/v2/type/${type1.toLowerCase()}`);
        const data1 = await res1.json();
        const nomesType1 = data1.pokemon.filter((p: any) => p.slot === 1).map((p: any) => p.pokemon.name);

        // Busca a lista do Tipo 2, pega os slot 2 (Secundário) E que também existem na primeira lista
        const res2 = await fetch(`https://pokeapi.co/api/v2/type/${type2.toLowerCase()}`);
        const data2 = await res2.json();
        lista = data2.pokemon
            .filter((p: any) => p.slot === 2 && nomesType1.includes(p.pokemon.name))
            .map((p: any) => p.pokemon);

    } else if (type1 !== 'all') {
        // Só Tipo 1 selecionado
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type1.toLowerCase()}`);
        const data = await res.json();
        lista = data.pokemon.filter((p: any) => p.slot === 1).map((p: any) => p.pokemon);

    } else if (type2 !== 'all') {
        // Só Tipo 2 selecionado
        const res = await fetch(`https://pokeapi.co/api/v2/type/${type2.toLowerCase()}`);
        const data = await res.json();
        lista = data.pokemon.filter((p: any) => p.slot === 2).map((p: any) => p.pokemon);

    } else {
        // Nenhum tipo selecionado (Traz todos)
        const respostaLista = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
        const dadosLista = await respostaLista.json();
        lista = dadosLista.results;
    }

    // 2. LIMITA ATÉ O ID 1000 (Limpando as mega evoluções estranhas da API)
    lista = lista.filter((p: any) => {
        const urlParts = p.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 2]);
        return id <= 1000;
    });

    // 3. LÓGICA DE BUSCA EXATA (startsWith no lugar de includes)
    if (search) {
        lista = lista.filter((pokemon: any) => 
            pokemon.name.toLowerCase().startsWith(search.toLowerCase())
        );
    }

    // 4. PAGINAÇÃO (Mantém igual)
    const totalItems = lista.length;
    const lastPage = Math.ceil(totalItems / limitPorPagina) || 1;
    const offset = (page - 1) * limitPorPagina;
    const listaPaginada = lista.slice(offset, offset + limitPorPagina);

    // 5. BUSCA DETALHES FINAIS (Mantém igual)
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