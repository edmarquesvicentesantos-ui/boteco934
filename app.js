// Seletores de Input
const custoCaixaInput = document.getElementById('custoCaixa');
const qtdUnidadesInput = document.getElementById('qtdUnidades');
const markupInput = document.getElementById('markupDesejado');
const corpoTabela = document.getElementById('corpoTabela');

// Escutador de eventos para cálculo em tempo real
[custoCaixaInput, qtdUnidadesInput, markupInput].forEach(item => {
    item.addEventListener('input', calcularPrecificacao);
});

function calcularPrecificacao() {
    const custoCaixa = parseFloat(custoCaixaInput.value) || 0;
    const qtd = parseInt(qtdUnidadesInput.value) || 1;
    const markupAlvo = parseFloat(markupInput.value) / 100;

    if (custoCaixa === 0) return;

    // 1. CÁLCULO PARA BEBIDAS UNITÁRIAS (Cervejas/Refris)
    const custoUnidade = custoCaixa / qtd;
    
    // Preço = Custo / (1 - Margem Desejada) -> Isso garante a margem sobre a VENDA
    const precoNatural = custoUnidade / (1 - markupAlvo);
    const precoGelada = precoNatural * 1.15; // Adicional de 15% para refrigeração
    const precoCaixa = (precoNatural * 0.90) * qtd; // 10% de desconto na caixa fechada

    // 2. CÁLCULO PARA DESTILADOS (Doses)
    // Considerando garrafa de 1 litro (1000ml) e dose de 50ml = 20 doses
    // Adicionamos 5% de perda operacional (derramamento)
    const custoDose = (custoUnidade / 20) * 1.05;
    const precoDose = custoDose / (1 - (markupAlvo + 0.10)); // Doses costumam ter 10% a mais de margem

    renderizarTabela(custoUnidade, precoNatural, precoGelada, precoCaixa, custoDose, precoDose);
}

function renderizarTabela(custoUn, pNat, pGel, pCx, cDose, pDose) {
    corpoTabela.innerHTML = `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 font-medium">Unidade Natural</td>
            <td class="px-4 py-2 text-gray-600">R$ ${custoUn.toFixed(2)}</td>
            <td class="px-4 py-2 text-blue-700 font-bold">R$ ${pNat.toFixed(2)}</td>
            <td class="px-4 py-2 text-green-600">R$ ${(pNat - custoUn).toFixed(2)}</td>
        </tr>
        <tr class="hover:bg-gray-50 bg-blue-50">
            <td class="px-4 py-2 font-medium">Unidade Gelada</td>
            <td class="px-4 py-2 text-gray-600">R$ ${custoUn.toFixed(2)}</td>
            <td class="px-4 py-2 text-blue-700 font-bold">R$ ${pGel.toFixed(2)}</td>
            <td class="px-4 py-2 text-green-600">R$ ${(pGel - custoUn).toFixed(2)}</td>
        </tr>
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 font-medium">Caixa Fechada (Atacado)</td>
            <td class="px-4 py-2 text-gray-600">R$ ${(custoUn * parseInt(qtdUnidadesInput.value)).toFixed(2)}</td>
            <td class="px-4 py-2 text-blue-700 font-bold">R$ ${pCx.toFixed(2)}</td>
            <td class="px-4 py-2 text-green-600">R$ ${(pCx - (custoUn * qtdUnidadesInput.value)).toFixed(2)}</td>
        </tr>
        <tr class="hover:bg-gray-50 bg-yellow-50">
            <td class="px-4 py-2 font-medium">Dose (50ml)</td>
            <td class="px-4 py-2 text-gray-600">R$ ${cDose.toFixed(2)}</td>
            <td class="px-4 py-2 text-blue-700 font-bold">R$ ${pDose.toFixed(2)}</td>
            <td class="px-4 py-2 text-green-600">R$ ${(pDose - cDose).toFixed(2)}</td>
        </tr>
    `;
}
