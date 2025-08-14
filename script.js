    // Objeto de traduções
const translations = {
    'pt-BR': {
        'title': 'Conversor de Moeda',
        'amountLabel': 'Valor para Conversão',
        'fromLabel': 'De',
        'toLabel': 'Para',
        'multiLabel': 'Ou selecione múltiplas moedas:',
        'convertBtn': 'Converter',
        'loading': 'Obtendo cotações...',
        'resultsTitle': 'Resultados da Conversão',
        'errorInvalid': 'Por favor, insira um valor válido.',
        'errorSelection': 'Selecione pelo menos uma moeda de destino diferente da origem.',
        'currencies': {
            'BRL': 'Real',
            'USD': 'Dólar',
            'EUR': 'Euro',
            'GBP': 'Libra Esterlina',
            'JPY': 'Iene'
        }
    },
    'en': {
        'title': 'Currency Converter',
        'amountLabel': 'Amount to Convert',
        'fromLabel': 'From',
        'toLabel': 'To',
        'multiLabel': 'Or select multiple currencies:',
        'convertBtn': 'Convert',
        'loading': 'Getting rates...',
        'resultsTitle': 'Conversion Results',
        'errorInvalid': 'Please enter a valid amount.',
        'errorSelection': 'Select at least one target currency different from source.',
        'currencies': {
            'BRL': 'Real',
            'USD': 'Dollar',
            'EUR': 'Euro',
            'GBP': 'Pound',
            'JPY': 'Yen'
        }
    }
};

// Função para mudar o idioma
function changeLanguage(lang) {
    if (!translations[lang]) return;
    
    const t = translations[lang];
    
    // Atualiza a classe ativa nos botões
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });

    // Atualiza os textos estáticos
    document.querySelector('h1').textContent = t.title;
    document.querySelector('label[for="amount"]').textContent = t.amountLabel;
    document.querySelector('label[for="from-currency"]').textContent = t.fromLabel;
    document.querySelector('label[for="to-currency"]').textContent = t.toLabel;
    document.querySelector('.form-group label:not([for])').textContent = t.multiLabel;
    document.getElementById('convert-btn').textContent = t.convertBtn;
    document.querySelector('.loading p').textContent = t.loading;
    document.querySelector('#results h2').textContent = t.resultsTitle;

    // Atualiza as opções de moeda
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    const currencyOptions = document.querySelectorAll('.target-currencies .currency-option');
    
    [fromSelect, toSelect].forEach(select => {
        Array.from(select.options).forEach(option => {
            if (t.currencies[option.value]) {
                option.text = `${t.currencies[option.value]} (${option.value})`;
            }
        });
    });
    
    currencyOptions.forEach(option => {
        const currency = option.getAttribute('data-currency');
        if (t.currencies[currency]) {
            option.textContent = `${t.currencies[currency].split(' ')[0]} (${currency})`;
        }
    });
    
    // Atualiza o atributo lang do HTML
    document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', function() {

            const amountInput = document.getElementById('amount');
            const fromCurrency = document.getElementById('from-currency');
            const toCurrency = document.getElementById('to-currency');
            const convertBtn = document.getElementById('convert-btn');
            const currencyOptions = document.querySelectorAll('.currency-option');
            const resultsSection = document.getElementById('results');
            const resultsContainer = document.getElementById('results-container');
            const loadingSection = document.querySelector('.loading');
            const errorMessage = document.getElementById('error-message');
            
            // API Key - Em produção, isso deveria estar em um backend
            const API_KEY = "fxr_live_d8d843edeb4ca21f5efdaca1d77d6ad4f923";
            
            // Mapeamento de moedas para bandeiras (usando emojis como exemplo)
            const currencyFlags = {
                'BRL': '🇧🇷',
                'USD': '🇺🇸',
                'EUR': '🇪🇺',
                'GBP': '🇬🇧',
                'JPY': '🇯🇵',
                'ARS': '🇦🇷',
                'CNY': '🇨🇳'
            };
            
            const currencyNames = {
                'BRL': 'Real Brasileiro',
                'USD': 'Dólar Americano',
                'EUR': 'Euro'
            };
            
            // Seleção de múltiplas moedas
            let selectedCurrencies = [];
            
            currencyOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const currency = this.getAttribute('data-currency');
                    
                    if (this.classList.contains('selected')) {
                        this.classList.remove('selected');
                        selectedCurrencies = selectedCurrencies.filter(c => c !== currency);
                    } else {
                        this.classList.add('selected');
                        selectedCurrencies.push(currency);
                    }
                    
                    // Atualizar o select "Para" se apenas uma moeda estiver selecionada
                    if (selectedCurrencies.length === 1) {
                        toCurrency.value = selectedCurrencies[0];
                    }
                });
            });
            
            // Converter moeda
            convertBtn.addEventListener('click', async function() {
                const amount = parseFloat(amountInput.value);
                const from = fromCurrency.value;
                
                if (isNaN(amount)) {
                    showError("Por favor, insira um valor válido.");
                    return;
                }
                
                // Determinar moedas de destino
                let toCurrencies = [];
                
                if (selectedCurrencies.length > 0) {
                    toCurrencies = selectedCurrencies.filter(c => c !== from);
                } else {
                    const to = toCurrency.value;
                    if (to !== from) {
                        toCurrencies.push(to);
                    }
                }
                
                if (toCurrencies.length === 0) {
                    showError("Selecione pelo menos uma moeda de destino diferente da origem.");
                    return;
                }
                
                // Mostrar loading
                loadingSection.style.display = 'block';
                errorMessage.style.display = 'none';
                resultsSection.style.display = 'none';
                
                try {
                    // Obter taxas de câmbio da API
                    const apiData = await getExchangeRates();
                    
                    if (!apiData || !apiData.success) {
                        showError("Não foi possível obter as cotações. Tente novamente mais tarde.");
                        return;
                    }
                    
                    const rates = apiData.rates;
                    
                    // Calcular conversões
                    const results = [];
                    
                    for (const to of toCurrencies) {
                        const convertedAmount = convertCurrency(amount, from, to, rates);
                        if (convertedAmount !== null) {
                            results.push({
                                currency: to,
                                amount: convertedAmount
                            });
                        }
                    }
                    
                    // Exibir resultados
                    displayResults(amount, from, results);
                    
                } catch (error) {
                    console.error("Erro na conversão:", error);
                    showError("Ocorreu um erro ao converter. Tente novamente.");
                } finally {
                    loadingSection.style.display = 'none';
                }
            });
            
            // Obter taxas de câmbio da API
            async function getExchangeRates() {
                try {
                    const response = await fetch(`https://api.fxratesapi.com/latest?access_key=${API_KEY}`);
                    if (!response.ok) {
                        throw new Error('Erro na resposta da API');
                    }
                    return await response.json();
                } catch (error) {
                    console.error("Erro ao obter cotações:", error);
                    return null;
                }
            }
            
            function convertCurrency(amount, from, to, rates) {
                // Se as moedas forem iguais
                if (from === to) {
                    return amount;
                }
                
                // Converter de moeda origem para USD (base da API)
                let amountInUsd;
                if (from !== 'USD') {
                    if (rates[from]) {
                        amountInUsd = amount / rates[from];
                    } else {
                        return null;
                    }
                } else {
                    amountInUsd = amount;
                }
                
                // Converter de USD para moeda destino
                if (to !== 'USD') {
                    if (rates[to]) {
                        return amountInUsd * rates[to];
                    } else {
                        return null;
                    }
                } else {
                    return amountInUsd;
                }
            }
            
function displayResults(originalAmount, originalCurrency, conversions) {
    resultsContainer.innerHTML = '';
    
    // Adicionar o valor original como primeiro card
    const originalCard = document.createElement('div');
    originalCard.className = 'result-card';
    originalCard.innerHTML = `
        <div class="result-info">
            <span class="result-flag">${currencyFlags[originalCurrency]}</span>
            <div>
                <div class="result-value">${originalAmount.toFixed(2)}</div>
                <div class="result-currency">(${originalCurrency})</div>
            </div>
        </div>
        <div class="result-arrow"></div>
    `;
    resultsContainer.appendChild(originalCard);
    
    // Adicionar os resultados convertidos
    conversions.forEach(conversion => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <div class="result-info">
                <span class="result-flag">${currencyFlags[conversion.currency]}</span>
                <div>
                    <div class="result-value">${conversion.amount.toFixed(2)}</div>
                    <div class="result-currency">(${conversion.currency})</div>
                </div>
            </div>
            <div class="result-rate">
                1 ${originalCurrency} = ${(conversion.amount / originalAmount).toFixed(6)} ${conversion.currency}
            </div>
        `;
        resultsContainer.appendChild(card);
    });
    
    resultsSection.style.display = 'block';
}
            
            function showError(message) {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            }
            
            // Atualizar moedas de destino quando a de origem mudar
            fromCurrency.addEventListener('change', function() {
                // Limpar seleções de moedas múltiplas
                currencyOptions.forEach(option => {
                    option.classList.remove('selected');
                });
                selectedCurrencies = [];
            });

             // Inicialização do idioma (adicione isso no final do event listener)
    const savedLang = localStorage.getItem('appLanguage') || 'pt-BR';
    changeLanguage(savedLang);
    
    // Event listeners para os botões de idioma
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.dataset.lang;
            localStorage.setItem('appLanguage', lang);
            changeLanguage(lang);
                    });
    });
})