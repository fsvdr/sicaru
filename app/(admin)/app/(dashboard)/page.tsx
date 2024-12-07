import { DashboardPage, PageHeader, PageTitle } from '@components/dashboard/Page';
import StoreDetailsForm from '@components/dashboard/store/Form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/generic/Card';

const onboardingSteps = [
  {
    title: 'Configura los detalles de tu negocio',
    description: 'Agrega nombre, logo, horarios e información general. ¡Hazlo único!',
  },
  {
    title: 'Añade tu menú',
    description: 'Crea colecciones y sube tus platillos. ¡Es súper fácil!',
  },
  {
    title: 'Diseña tu sitio web',
    description: 'Dale un toque personalizado a tu sitio web y compártelo con el mundo.',
  },
];

const DashboardHomePage = async () => {
  return (
    <DashboardPage>
      <PageHeader>
        <PageTitle>Detalles generales</PageTitle>
      </PageHeader>

      <Card className="flex flex-row items-stretch overflow-hidden shadow-none border-melrose-500 bg-melrose-50">
        {/* <div className="hidden w-4/12 bg-melrose-500 lg:block"></div> */}

        <div>
          <CardHeader>
            <CardTitle>🎉&nbsp;&nbsp;Comienza a configurar tu negocio</CardTitle>

            <CardDescription>
              <p>
                ¡No te preocupes! No llevará mucho tiempo y una vez que termines tendrás tu sitio web listo para recibir
                clientes.
              </p>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div>
              {onboardingSteps.map((step, index) => (
                <div key={index} className="mb-2 grid grid-cols-[auto_1fr] gap-3 items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex items-center justify-center text-xs font-semibold text-white translate-y-1 rounded-full size-6 bg-melrose-500">
                    {index + 1}
                  </span>

                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>

      <StoreDetailsForm />
    </DashboardPage>
  );
};

export default DashboardHomePage;
