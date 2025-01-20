import OnboardingCard from '@components/dashboard/OnboardingCard';
import { DashboardPage, PageHeader, PageTitle } from '@components/dashboard/Page';
import ProductsListing from '@components/dashboard/products/Listing';
import { ButtonLink } from '@components/generic/Button';
import { resolveActiveStore } from '@utils/resolveActiveStore';
import { PlusIcon } from 'lucide-react';

const ProductsListingPage = async () => {
  const { activeStore, stores } = await resolveActiveStore();

  return (
    <DashboardPage>
      <PageHeader>
        <PageTitle>Productos</PageTitle>

        <ButtonLink href="/products/new">
          <PlusIcon className="w-4 h-4" />
          Nuevo producto
        </ButtonLink>
      </PageHeader>

      <OnboardingCard stores={stores} />

      {activeStore && <ProductsListing storeId={activeStore.id} />}
    </DashboardPage>
  );
};

export default ProductsListingPage;
