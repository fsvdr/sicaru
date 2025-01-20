import { DashboardPage, PageHeader, PageTitle } from '@components/dashboard/Page';
import ProductForm from '@components/dashboard/products/Form';

const NewProductPage = () => {
  return (
    <DashboardPage>
      <PageHeader>
        <div>
          <PageTitle>Producto nuevo</PageTitle>
          <p>Crea un nuevo producto para tu tienda.</p>
        </div>
      </PageHeader>

      <ProductForm />
    </DashboardPage>
  );
};

export default NewProductPage;
