import { DashboardPage, PageHeader, PageTitle } from '@components/dashboard/Page';
import ProductForm from '@components/dashboard/products/Form';
import { ProductDAO } from '@lib/dao/ProductDAO';
import { getDatabaseClient } from '@utils/db';

const ProductFormPage = async ({ params }: { params: { id: string } }) => {
  const db = await getDatabaseClient();
  const product = await ProductDAO.getProduct({ db, productId: params.id });

  return (
    <DashboardPage>
      <PageHeader>
        <div>
          <PageTitle>{product?.name}</PageTitle>
          <p>Edita el producto</p>
        </div>
      </PageHeader>

      <ProductForm product={product} />
    </DashboardPage>
  );
};

export default ProductFormPage;
