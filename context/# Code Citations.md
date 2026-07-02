# Code Citations

## License: unknown
https://github.com/Podlipny/Courses/tree/c24a963b757d1c54c552754146cd30cb254f3ddb/Youtube/Build%20and%20Deploy%20a%20Modern%20Full%20Stack%20ECommerce%20React%20Application%20with%20Stripe/pages/product/%5Bslug%5D.js

```
{ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]
```


## License: unknown
https://github.com/muratcan-yuksel/articles/tree/b985937dde25fd458c470fd9bef977fdfbae89f6/sanity/sanity-ecommerce.md

```
) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client
```


## License: unknown
https://github.com/Warfail/tokosewa/tree/3916200be6fa4688b250c145c94a80e767b9fd77/.history/tokosewa/pages/product/%5Bslug%5D_20221020170156.js

```
'${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products
```


## License: unknown
https://github.com/Albertinou/augalu_galia/tree/7966c3be6ac37536a0b63bd5155a81916e773cbb/pages/product/%5Bslug%5D.js

```
'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { products, product },
    revalidate
```


## License: unknown
https://github.com/suyashdube/Ecommercestore/tree/238b9fb92563b9c6eed78032c4a59b6133276300/pages/product/%5Bslug%5D.js

```
async ({ params: { slug } }) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product
```

