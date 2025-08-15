// Função para gerar um número inteiro aleatório
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Função para mostrar ou esconder o modal
function toggleModal() {
    const modal = document.getElementById('modal-payment');
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

// Fechar o modal clicando fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modal-payment');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Lógica de contagem regressiva de estoque
function setupStockCountdown() {
    const total_items = 50;
    const min_items_left = 19;
    const max_items_left = 45;
    const decrease_after = 3.7; // Diminui a cada 3.7 minutos (222 segundos)
    const decrease_after_first_item = 0.17; // Diminui o primeiro item após 0.17 minutos (10 segundos)

    const countElement = document.querySelector('.items-count .count');
    const progressBarContainer = document.querySelector('.items-count .progressbar');
    const progressBar = progressBarContainer.querySelector('div');

    let remaining_items = randomIntFromInterval(min_items_left, max_items_left);

    function updateMeter() {
        const percentage = (remaining_items / total_items) * 100;
        countElement.textContent = remaining_items;
        progressBar.style.width = percentage + '%';

        if (remaining_items < 10) {
            progressBar.classList.add('less-than-ten');
        } else {
            progressBar.classList.remove('less-than-ten');
        }

        progressBarContainer.classList.add('active', 'progress-striped');
        setTimeout(() => {
            progressBarContainer.classList.remove('active', 'progress-striped');
        }, 1000); // Remove a animação após 1 segundo
    }

    // Atualização inicial
    updateMeter();

    // Diminui o primeiro item após um pequeno atraso
    setTimeout(() => {
        remaining_items--;
        if (remaining_items < min_items_left) {
            remaining_items = randomIntFromInterval(min_items_left, max_items_left);
        }
        updateMeter();
    }, decrease_after_first_item * 60 * 1000);

    // Define o intervalo para as diminuições regulares
    setInterval(() => {
        remaining_items--;
        if (remaining_items < min_items_left) {
            remaining_items = randomIntFromInterval(min_items_left, max_items_left);
        }
        updateMeter();
    }, decrease_after * 60 * 1000);
}

// Lógica de atualização de preço e redirecionamento
document.addEventListener('DOMContentLoaded', function() {
    // Chamada para a função de contagem regressiva de estoque
    setupStockCountdown();

    const buyNowButton = document.getElementById('buy-now-button');
    const variantRadios = document.querySelectorAll('input[name="roblox-variant"]');
    const productPriceElement = document.getElementById('product-price');
    const installmentsValueElement = document.getElementById('installments-value');
    const selectedVariantNameElement = document.getElementById('selected-variant-name');

    // Mapeamento dos valores das ofertas para os links de checkout
    const checkoutLinks = {
        '800': 'https://go.tribopay.com.br/49iz6',
        '1000': 'https://go.tribopay.com.br/vxs1k',
        '2000': 'https://go.tribopay.com.br/pciyp ',
        '5200': 'https://go.tribopay.com.br/dmfp4',
        '10000': 'https://go.tribopay.com.br/1y7qu'
    };

    function updateProductInfo() {
        const selectedVariant = document.querySelector('input[name="roblox-variant"]:checked');
        if (selectedVariant) {
            const price = selectedVariant.getAttribute('data-price');
            const installments = selectedVariant.getAttribute('data-installments');
            const variantText = selectedVariant.nextElementSibling.querySelector('.block-swatch__item-text').textContent;

            // Atualiza o preço principal
            productPriceElement.textContent = `R$ ${price.replace('.', ',')}`;

            // Atualiza o valor do parcelamento
            installmentsValueElement.textContent = `R$ ${installments.replace('.', ',')}`;

            // Atualiza o nome da oferta selecionada
            selectedVariantNameElement.textContent = variantText;
        }
    }

    // Adiciona o evento de 'change' para cada input de rádio
    variantRadios.forEach(radio => {
        radio.addEventListener('change', updateProductInfo);
    });

    // Adiciona a lógica de redirecionamento no clique do botão
    buyNowButton.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedVariant = document.querySelector('input[name="roblox-variant"]:checked');
        
        if (selectedVariant) {
            const variantValue = selectedVariant.value;
            const checkoutUrl = checkoutLinks[variantValue];

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                console.error('Link de checkout não encontrado para a variante selecionada.');
                alert('Ocorreu um erro. Por favor, tente novamente.');
            }
        } else {
            alert('Por favor, selecione uma oferta.');
        }
    });

    // Inicializa a página com as informações da primeira variante selecionada
    updateProductInfo();
});
