import { useState, useEffect } from 'react';
import './CurrencyConverter.css';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = `https://open.er-api.com/v6/latest/USD`;

  const getFlagUrl = (currencyCode) => {
    const countryCode = currencyCode.slice(0, 2); // Assumes the first two letters match ISO country codes
    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data && data.rates) {
          setRates(data.rates);
          setCurrencies(Object.keys(data.rates));
          setFromCurrency('USD');
          setToCurrency('INR');
          setLoading(false);
        } else {
          throw new Error('Invalid data received from the API.');
        }
      } catch (error) {
        setError('Failed to fetch currencies. Please try again later.');
        console.error(error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleConvert = () => {
    if (!fromCurrency || !toCurrency || !amount || amount <= 0) {
      setError('Please enter a valid amount and select currencies.');
      return;
    }
    const rate = rates[toCurrency] / rates[fromCurrency];
    setConvertedAmount((amount * rate).toFixed(2));
    setError('');
  };

  const handleFlip = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  return (
    <div className="currency-converter-container">
      <div className="currency-converter-box">
        <h2 className="currency-converter-title">Currency Converter</h2>

        {loading ? (
          <p>Loading currencies...</p>
        ) : error ? (
          <p className="currency-converter-error">{error}</p>
        ) : (
          <>
            <div className="currency-row">
              <div className="currency-column">
                <label>From:</label>
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <img src={getFlagUrl(fromCurrency)} alt="Flag" className="currency-flag" />
            </div>

            <button className="currency-flip-button" onClick={handleFlip}>
              ⬆⬇
            </button>

            <div className="currency-row">
              <div className="currency-column">
                <label>To:</label>
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
              <img src={getFlagUrl(toCurrency)} alt="Flag" className="currency-flag" />
            </div>

            <div className="currency-amount">
              <label>Amount:</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button className="currency-convert-button" onClick={handleConvert}>
              Convert
            </button>

            {convertedAmount && (
              <div className="currency-result">
                <p>
                  {amount} {fromCurrency} = {convertedAmount} {toCurrency}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
