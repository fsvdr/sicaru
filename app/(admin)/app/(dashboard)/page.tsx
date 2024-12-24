import OnboardingCard from '@components/dashboard/OnboardingCard';
import { DashboardPage, PageHeader, PageTitle } from '@components/dashboard/Page';
import StoreDetailsForm from '@components/dashboard/store/Form';
import { resolveActiveStore } from '@utils/resolveActiveStore';

const DashboardHomePage = async () => {
  const { activeStore, stores } = await resolveActiveStore();

  return (
    <DashboardPage>
      <PageHeader>
        <PageTitle>Detalles generales</PageTitle>
      </PageHeader>

      <OnboardingCard stores={stores} />

      <StoreDetailsForm store={activeStore} />
    </DashboardPage>
  );
};

export default DashboardHomePage;
