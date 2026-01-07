// pages/products/[id].js
import { readOnlyClient } from '../../lib/sanity';
import ProductForm from '../../components/Product/ProductForm';

export default function ProductEditPage({ product }) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          {product?.name ? `Edit ${product.name}` : 'Edit Product'}
        </h1>
      </header>

      {product ? (
        <ProductForm 
          initialData={product}
          className="bg-white p-6 rounded-lg shadow-sm"
        />
      ) : (
        <div className="text-center py-12 text-red-500">
          Product not found or invalid ID
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const { id } = context.params;
    const product = await readOnlyClient.getDocument(id);

    if (!product || product._type !== 'product') {
      return { notFound: true };
    }

    return {
      props: { product }
    };
  } catch (error) {
    console.error('Product fetch error:', error);
    return {
      notFound: true,
    };
  }
}