// 1. Exportamos a URL base (sem a barra extra no final do pokemon!)
//export const BASE_URL = "http://localhost:8000/api/";
export const BASE_URL = "https://pokedex-gestaoeq3-auhccpbccxb0h2bp.brazilsouth-01.azurewebsites.net/api/";

// 2. Exportamos o objeto 'api' que o seu App.jsx está procurando
export const api = {
  get: async (endpoint) => {
    // Faz o fetch juntando a BASE_URL com a rota (ex: pokemon)
    const resposta = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!resposta.ok) {
      throw new Error(`Erro na requisição: ${resposta.statusText}`);
    }

    const json = await resposta.json();
    
    // Retornamos { data: json } para o App.jsx conseguir ler certinho
    return { data: json };
  }
};
