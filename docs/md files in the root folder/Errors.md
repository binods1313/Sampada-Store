# Errors Log

## Upstream Errors
Uncaught error: Unexpected token '<'
http://localhost:3333/schemaTypes/banner.js?t=1780543329533:39:13
SyntaxError: Unexpected token '<'

## Stashed Local Errors
Runtime TypeError
Failed to fetch
context\CurrencyContext.js (23:32) @ fetchRates

  21 |     async function fetchRates() {
  22 |       try {
> 23 |         const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
     |                                ^
  24 |         if (!response.ok) throw new Error('Network response was not ok');
  25 |         const data = await response.json();
  26 |         setExchangeRates(data.rates);

Runtime Error
Request error while attempting to reach Sanity API
https://7lh35oho.api.sanity.io/v2024-05-18/data/query/production?query=%0A++*%5B_type+%3D%3D+%22navigation%22%5D+%7C+order%28order+asc%29+%7B%0A++++_id%2C%0A++++label%2C%0A++++href%2C%0A++++order%2C%0A++++sections%5B%5D+%7B%0A++++++sectionTitle%2C%0A++++++items%5B%5D+%7B%0A++++++++label%2C%0A++++++++href%0A++++++%7D%0A++++%7D%0A++%7D%0A&returnQuery=false
