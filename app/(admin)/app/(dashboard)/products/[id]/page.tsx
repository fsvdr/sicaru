import { DashboardPage, PageHeader, PageTitle } from '@components/dashboard/Page';
import ProductForm from '@components/dashboard/products/Form';
import db from '@db/index';
import { ProductDAO } from '@lib/dao/ProductDAO';

const ProductFormPage = async ({ params }: { params: { id: string } }) => {
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
