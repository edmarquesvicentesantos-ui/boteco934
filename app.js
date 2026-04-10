// Configuração do Firebase (Pegue isso no Console do Firebase)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Inicialização
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Lógica de Precificação Detalhada
function calcularPrecosSugeridos(custoCaixa, unidades, markup) {
    const custoUn = custoCaixa / unidades;
    const markupFator = 1 - (markup / 100);

    return {
        unidadeNatural: (custoUn / markupFator),
        unidadeGelada: (custoUn / markupFator) * 1.15, // +15% energia
        caixaNatural: custoCaixa / (1 - ((markup - 10) / 100)), // Markup menor para atacado
        dose: (custoUn / 20) * 1.05 / (1 - ((markup + 20) / 100)) // 20 doses por litro + 5% perda
    };
}

// Salvar no Banco
async function salvarProduto(dados) {
    try {
        await db.collection("produtos").add(dados);
        alert("Produto salvo com sucesso!");
    } catch (e) {
        console.error("Erro ao salvar: ", e);
    }
}
