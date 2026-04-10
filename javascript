function calcularTudo() {
    const custoCaixa = parseFloat(document.getElementById('custoCaixa').value) || 0;
    const qtd = parseInt(document.getElementById('qtdUnidades').value) || 1;
    const markup = parseFloat(document.getElementById('markup').value) / 100;

    // Cálculo Unidade
    const custoUnidade = custoCaixa / qtd;
    const precoSugeridoNat = custoUnidade / (1 - markup);
    const precoSugeridoGel = precoSugeridoNat * 1.15; // Adicional de refrigeração

    // Cálculo Dose (Baseado em 1 litro = 20 doses de 50ml)
    // Se for destilado, o custo unidade é o custo da garrafa
    const custoDose = (custoUnidade / 20) * 1.05; // 5% de margem de perda/derramamento
    const precoSugeridoDose = custoDose / (1 - (markup + 0.20)); // Dose costuma ter markup maior

    // Preencher a Tela
    document.getElementById('c-un-nat').innerText = `R$ ${custoUnidade.toFixed(2)}`;
    document.getElementById('p-un-nat').value = precoSugeridoNat.toFixed(2);
    document.getElementById('l-un-nat').innerText = `R$ ${(precoSugeridoNat - custoUnidade).toFixed(2)}`;

    document.getElementById('c-un-gel').innerText = `R$ ${custoUnidade.toFixed(2)}`;
    document.getElementById('p-un-gel').value = precoSugeridoGel.toFixed(2);
    
    document.getElementById('c-dose').innerText = `R$ ${custoDose.toFixed(2)}`;
    document.getElementById('p-dose').value = precoSugeridoDose.toFixed(2);
}
