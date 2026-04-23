// 1. Atualizamos para a URL oficial do Render
// Removemos o link antigo do Azure que estava dando erro de permissão
export const BASE_URL = "https://gestaoprojetosequipe3-testes.onrender.com/api/";

// 2. Mantemos o objeto 'api' que o seu App.jsx já utiliza
export const api = {
  get: async (endpoint) => {
    // O fetch agora baterá no novo serviço configurado no Render
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
    
    // Retornamos o formato { data: json } compatível com seu App.jsx
    return { data: json };
  }
};