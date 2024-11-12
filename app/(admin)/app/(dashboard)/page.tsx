import { auth } from '@utils/auth';

const DashboardHomePage = async () => {
  const session = await auth();

  console.log('[SC]', session);

  return <h1>Hello</h1>;
};

export default DashboardHomePage;
