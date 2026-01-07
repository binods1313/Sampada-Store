const getPrintifyShopId = async () => {
  const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjJkMTRkNDMyYjM3ODE1OTIwMzhmYWU0MzIwMDcwODMzMjA5ZDJkYjQxMDU0M2ZiMDc5N2I0ZTQyYjQ0MzIyM2Y3YThjMmQ3Y2NiNGIxZTJjIiwiaWF0IjoxNzYzNTc5NjU4LjY3NTgxNiwibmJmIjoxNzYzNTc5NjU4LjY3NTgxOCwiZXhwIjoxNzk1MTE1NjU4LjY2ODU0OCwic3ViIjoiMjU0MzI3MDMiLCJzY29wZXMiOlsic2hvcHMubWFuYWdlIiwic2hvcHMucmVhZCIsImNhdGFsb2cucmVhZCIsIm9yZGVycy5yZWFkIiwib3JkZXJzLndyaXRlIiwicHJvZHVjdHMucmVhZCIsInByb2R1Y3RzLndyaXRlIiwid2ViaG9va3MucmVhZCIsIndlYmhvb2tzLndyaXRlIiwidXBsb2Fkcy5yZWFkIiwidXBsb2Fkcy53cml0ZSIsInByaW50X3Byb3ZpZGVycy5yZWFkIiwidXNlci5pbmZvIl19.e1G0VCjlgFW8YYQvXThn14iUsRgvv6xJTTZpCVTt1Ha00NI0mtjBpWP1uv3ndNRkjhrFPHBOIc99eWZBIk_wNCySkZoOYrnDLqSaFPlvzpff40U9va4FCHpT3h488RYEukc2GZt2HO0kJk1Bn4dCpm5WqkWaIw2fmMLteFj10mDQQ9Y0ciBS_SjNGol0293Us5XNy6ThYO3D5WsE1lGXwjY1GIGa4eZ300iGa-vgmbvAenz-5m-1eia6pyU9U6kNhfD3kyw_T6c22ueIOMorr3qP1TqK4mV-68EvIDFcJD5rR8lCAPoWd4jXVwJyp7PU4ZnSFbPG9G5_END3x39F0E7dBZAJXA-SzdxVCxlj9eh5TWhR2rrsBwblWMasLXuP7KkEMxcP1dQsmo28RIZ_jgX42upDSwUDeTXcmjds9xR9-pWt5afuC871kjgiNl3633DTSyFFqXjXF3mgTwpqq-uSdJVG2krppaLb2UnL-l4BmJNDJDxrNF8C5EevECRxCkYs-bLC0UB10WUSaAiDFy4Nia3JeX2bBiFtNnidiV3ZAlwlBchAAN2xwCaStantlqyLDNlTvojYGYnA1rvZqaVj-Lx_z9AcU1ZThONztLWGKcqvA21l5iO0kxFMw9Pzg3lShH_xTQe4HGOrJ7VzFwmxm_ezgtsnL624SkiKyQU';
  
  try {
    const response = await fetch('https://api.printify.com/v1/shops.json', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Printify Shops Response:', JSON.stringify(data, null, 2));
    
    if (data && Array.isArray(data.data)) {
      console.log('\nFound the following shops:');
      data.data.forEach(shop => {
        console.log(`Shop ID: ${shop.id}, Shop Name: ${shop.name}`);
      });
      
      // Return the first shop ID found
      if (data.data.length > 0) {
        return data.data[0].id;
      }
    } else {
      console.log('No shops found in the response');
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Printify shops:', error);
    return null;
  }
};

// Execute the function
getPrintifyShopId().then(shopId => {
  if (shopId) {
    console.log(`\nYour Printify Shop ID is: ${shopId}`);
    console.log(`\nPlease update your .env file with: PRINTIFY_SHOP_ID=${shopId}`);
  } else {
    console.log('Could not retrieve Printify Shop ID');
  }
});