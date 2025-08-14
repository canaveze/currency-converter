import requests
import json

API_RESPONSE = {"success":True,"terms":"https://fxratesapi.com/legal/terms-conditions","privacy":"https://fxratesapi.com/legal/privacy-policy","timestamp":1755179940,"date":"2025-08-14T13:59:00.000Z","base":"USD","rates":{"ADA":1.0685121204,"AED":3.6718506684,"AFN":68.3422382891,"ALL":83.1239856681,"AMD":383.258449179,"ANG":1.7077002027,"AOA":912.8727596132,"ARB":1.9067735024,"ARS":1312.8107686901,"AUD":1.5394302987,"AWG":1.79,"AZN":1.7,"BAM":1.6770501936,"BBD":2,"BDT":121.5477520044,"BGN":1.6718603145,"BHD":0.376,"BIF":2938.1592228066,"BMD":1,"BNB":0.0011789081,"BND":1.2825802111,"BOB":6.9334012439,"BRL":5.4209510197,"BSD":1,"BTC":0.0000084236,"BTN":78.66644318,"BWP":13.3181214423,"BYN":3.3300844834,"BYR":33300.844273678,"BZD":2,"CAD":1.3801102414,"CDF":2877.0413856187,"CHF":0.8072201313,"CLF":0.0240800029,"CLP":958.5707063063,"CNY":7.1715611741,"COP":4058.8583535225,"CRC":505.9768947741,"CUC":1,"CUP":24,"CVE":94.3631006277,"CZK":21.0047231803,"DAI":0.9987201046,"DJF":177.721,"DKK":6.4018512734,"DOP":61.4949399717,"DOT":0.246528824,"DZD":130.2656650292,"EGP":48.3208985515,"ERN":15,"ETB":140.5772307248,"ETH":0.0002167568,"EUR":0.8578701125,"FJD":2.2804604397,"FKP":0.7385723944,"GBP":0.7384901376,"GEL":2.7229604386,"GGP":0.7385723694,"GHS":10.701941595,"GIP":0.7385724187,"GMD":72.63355018,"GNF":8688.1430485222,"GTQ":7.6538813656,"GYD":208.8656360202,"HKD":7.8354813264,"HNL":26.0159127241,"HRK":6.2517009137,"HTG":132.751419014,"HUF":339.1763284844,"IDR":16087.691628474,"ILS":3.3851905644,"IMP":0.7385723901,"INR":87.5741442008,"IQD":1308.1213347504,"IRR":41994.452411774,"ISK":123.071998972,"JEP":0.7385724258,"JMD":159.4988818974,"JOD":0.71,"JPY":147.3307347959,"KES":129.2317096959,"KGS":87.6310013462,"KHR":3999.7124194724,"KMF":422.0780191084,"KPW":900.0038826165,"KRW":1387.8933672689,"KWD":0.3056900333,"KYD":0.83333,"KZT":537.711942416,"LAK":21541.384171837,"LBP":89551.823197535,"LKR":301.4349483911,"LRD":201.0361325412,"LSL":17.5451025981,"LTC":0.0080909694,"LTL":2.9623250012,"LVL":0.602966319,"LYD":5.4065307344,"MAD":8.9864917715,"MDL":16.4977730484,"MGA":4447.2167690739,"MKD":52.6912965326,"MMK":2098.2051355005,"MNT":3597.3284204379,"MOP":8.0978708869,"MRO":356.999828,"MUR":45.1615547288,"MVR":15.4477124471,"MWK":1733.5964764427,"MXN":18.7796435426,"MYR":4.2111006255,"MZN":63.5119084836,"NAD":17.5947319373,"NGN":1530.3928818009,"NIO":36.8031558639,"NOK":10.2211813019,"NPR":140.380797548,"NZD":1.6885002818,"OMR":0.3841600693,"OP":1.2782563292,"PAB":0.9989501048,"PEN":3.5417704861,"PGK":4.0822804098,"PHP":56.9620660554,"PKR":282.0709253949,"PLN":3.6544406598,"PYG":7513.2018748949,"QAR":3.6387806132,"RON":4.3431406076,"RSD":100.0635249021,"RUB":79.6058016156,"RWF":1447.8072776415,"SAR":3.7481806164,"SBD":8.4989777291,"SCR":14.9654021994,"SDG":601.5,"SEK":9.5919811914,"SGD":1.2835201987,"SHP":0.7384900995,"SLL":22652.446954821,"SOL":0.0051118355,"SOS":572.5769265469,"SRD":37.4125471063,"STD":21217.679199973,"SVC":8.75,"SYP":13002.05164166,"SZL":17.6281117935,"THB":32.4532761702,"TJS":9.3738318114,"TMT":3.5,"TND":2.866170468,"TOP":2.3296602816,"TRY":40.8639646046,"TTD":6.7742809105,"TWD":30.0536159166,"TZS":2577.0511147721,"UAH":41.6310352511,"UGX":3554.608301205,"USD":1,"UYU":40.0280661385,"UZS":12613.822431559,"VEF":13385868.706576,"VND":26220.474088374,"VUV":119.2779901518,"WST":2.6500366407,"XAF":562.6663165864,"XAG":0.0262537698,"XAU":0.0002988185,"XCD":2.7,"XDR":0.7289800858,"XOF":562.666348866,"XPD":0.0008793367,"XPF":102.2708738713,"XPT":0.0007404368,"XRP":0.3205246047,"YER":239.8394786985,"ZAR":17.6280424786,"ZMK":9001.2,"ZMW":23.2658428427,"ZWL":67115.633208335}}


def get_exchange_rates(api_key):
    url = f"https://api.fxratesapi.com/latest?access_key={api_key}"
    try:
        response = requests.get(url)
        data = response.json()
        if data.get('success', False):
            return data['rates']
        else:
            print("Erro ao obter cotações:", data.get('error', {}).get('info', 'Erro desconhecido'))
            return None
    except Exception as e:
        print("Erro na conexão:", str(e))
        return None

def convert_currency(amount, from_currency, to_currency, rates):
    # Primeiro converter para EUR (base da API)
    if from_currency != 'EUR':
        if from_currency in rates:
            amount_in_eur = amount / rates[from_currency]
        else:
            return None
    else:
        amount_in_eur = amount
    
    # Depois converter de EUR para moeda de destino
    if to_currency != 'EUR':
        if to_currency in rates:
            return amount_in_eur * rates[to_currency]
        else:
            return None
    else:
        return amount_in_eur

def main():
    API_KEY = "fxr_live_d8d843edeb4ca21f5efdaca1d77d6ad4f923"
    
    # Obter as taxas de câmbio
    rates = get_exchange_rates(API_KEY)
    if not rates:
        print("Não foi possível obter as cotações. Verifique sua conexão ou a API key.")
        return
    
    # Adicionar EUR às taxas (que é a base 1:1)
    rates['EUR'] = 1.0
    
    # Mapeamento de códigos para nomes completos
    currency_names = {
        'BRL': 'Real Brasileiro',
        'USD': 'Dólar Americano',
        'EUR': 'Euro',
        'GBP': 'Libra Esterlina',
        'JPY': 'Iene Japonês',
        'ARS': 'Peso Argentino',
        'CNY': 'Yuan Chinês',
        # Adicione outras moedas conforme necessário
    }
    
    # Interface de usuário no terminal
    print("\n=== CONVERSOR DE MOEDAS ===")
    
    # Moeda de origem
    print("\nMoedas disponíveis:")
    for code, name in currency_names.items():
        print(f"{code} - {name}")
    
    from_currency = input("\nDigite o código da moeda de origem (ex: BRL): ").upper()
    while from_currency not in currency_names:
        print("Moeda inválida. Tente novamente.")
        from_currency = input("Digite o código da moeda de origem (ex: BRL): ").upper()
    
    # Valor a converter
    try:
        amount = float(input(f"\nDigite o valor em {currency_names[from_currency]} a ser convertido: "))
    except ValueError:
        print("Valor inválido. Use números (ex: 100.50)")
        return
    
    # Moedas de destino
    print("\nPara quais moedas deseja converter?")
    print("1 - Todas as disponíveis")
    print("2 - Selecionar específicas")
    option = input("Escolha uma opção: ")
    
    to_currencies = []
    if option == '1':
        to_currencies = list(currency_names.keys())
        to_currencies.remove(from_currency)  # Remover a moeda de origem
    elif option == '2':
        print("\nSelecione as moedas de destino (digite os códigos separados por vírgula):")
        available_currencies = list(currency_names.keys())
        available_currencies.remove(from_currency)
        print("Disponíveis:", ", ".join(available_currencies))
        selected = input("Moedas: ").upper().split(',')
        to_currencies = [c.strip() for c in selected if c.strip() in available_currencies]
    else:
        print("Opção inválida.")
        return
    
    if not to_currencies:
        print("Nenhuma moeda de destino selecionada.")
        return
    
    # Realizar as conversões
    print("\nRESULTADOS DA CONVERSÃO:")
    print(f"{amount:.2f} {currency_names[from_currency]} equivale a:")
    
    for to_currency in to_currencies:
        converted = convert_currency(amount, from_currency, to_currency, rates)
        if converted is not None:
            print(f"- {converted:.2f} {currency_names[to_currency]}")
        else:
            print(f"- Não foi possível converter para {to_currency}")

if __name__ == "__main__":
    main()