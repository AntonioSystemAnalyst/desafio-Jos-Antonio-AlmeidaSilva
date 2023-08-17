const cardapio = [
    { codigo: "cafe", preco: 3.00 },
    { codigo: "chantily", preco: 1.50 },
    { codigo: "suco", preco: 6.20 },
    { codigo: "sanduiche", preco: 6.50 },
    { codigo: "queijo", preco: 2.00 },
    { codigo: "salgado", preco: 7.25 },
    { codigo: "combo1", preco: 9.50 },
    { codigo: "combo2", preco: 7.50 }
];

function verificarTodosCodigosNaLista(listaDeCodigos) {
    const codigos = listaDeCodigos.map(item => item.split(',')[0]);
    return codigos.every(codigo => cardapio.some(item => item.codigo === codigo));
}

function verificarItemExiste(nomeItem, lista) {
    return lista.some(item => {
        const [nome, quantidade] = item.split(',');
        return nome.trim() === nomeItem && parseFloat(quantidade) > 0;
    });
}

function verificarQuantidadeZero(lista) {
    for (const item of lista) {
        const [, quantidade] = item.split(',');
        if (parseInt(quantidade) === 0) {
            return true;
        }
    }
    return false;
}


function validarCompra(metodoDePagamento, itens) {
    console.log("Metodo de pagamento:", metodoDePagamento);
    console.log("Itens:", itens);
    if (metodoDePagamento !== "dinheiro" && metodoDePagamento !== "debito" && metodoDePagamento !== "credito") {
        return "Forma de pagamento inválida!";
    } else if (itens.length === 0) {
        return "Não há itens no carrinho de compra!";
    } else {
        if (!verificarTodosCodigosNaLista(itens, cardapio)) {
            return "Item inválido!";
        }
        else {
            if (verificarQuantidadeZero(itens)) {
                return "Quantidade inválida!";
            }
            else {
                if (verificarItemExiste("chantily", itens)) {
                    if (!verificarItemExiste("cafe", itens)) {
                        return "Item extra não pode ser pedido sem o principal";
                    }
                }
                if (verificarItemExiste("queijo", itens)) {
                    if (!verificarItemExiste("sanduiche", itens)) {
                        return "Item extra não pode ser pedido sem o principal";
                    }
                }
                return "compraValida";
            }
        }
    }
}

function formatarValorComVirgula(valor) {
    if (typeof valor === 'number') {
        valor = valor.toString();
    }
    return valor.replace('.', ',');
}


function calcularPorcentagem(valor, porcentagem) {
    const porcentagemCalculada = (valor * porcentagem) / 100;
    return porcentagemCalculada;
}

function calcularValorTotalDaCompra(itens) {
    let valorTotal = 0;
    for (const item of itens) {
        const [codigo, quantidade] = item.split(',');
        const itemNoCardapio = cardapio.find(item => item.codigo === codigo.trim());

        if (itemNoCardapio) {
            valorTotal += itemNoCardapio.preco * parseFloat(quantidade);
        }
    }
    return valorTotal;
}

function calcularValorDaCompra(metodoDePagamento, itens) {
    let valuePorcentagem;
    let valueBruto;
    let valueLiquido;

    if (metodoDePagamento === "dinheiro") {
        valueBruto = calcularValorTotalDaCompra(itens);
        valuePorcentagem = calcularPorcentagem(valueBruto, 5)
        valueLiquido = valueBruto - valuePorcentagem;
        return formatarValorComVirgula(valueLiquido.toFixed(2));
    }
    else {
        if (metodoDePagamento === "debito") {
            valueLiquido = calcularValorTotalDaCompra(itens);
            return formatarValorComVirgula(valueLiquido.toFixed(2));
        }
        else {
            if (metodoDePagamento === "credito") {
                valueBruto = calcularValorTotalDaCompra(itens);
                valuePorcentagem = calcularPorcentagem(valueBruto, 3)
                valueLiquido = valueBruto + valuePorcentagem;
                return formatarValorComVirgula(valueLiquido.toFixed(2));
            }
        }
    }
}

class CaixaDaLanchonete {

    calcularValorDaCompra(metodoDePagamento, itens) {
        const resultadoValidacao = validarCompra(metodoDePagamento, itens);
        if (resultadoValidacao !== "compraValida") {
            return resultadoValidacao;
        }
        else {
            return "R$ " + calcularValorDaCompra(metodoDePagamento, itens);
        }
    }

}
export { CaixaDaLanchonete };



