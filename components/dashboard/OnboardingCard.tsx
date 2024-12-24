'use client';

import Button from '@components/generic/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/generic/Card';
import { StoreDAO } from '@lib/dao/StoreDAO';
import { CookieKeys } from '@utils/CookieKeys';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

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

const OnboardingCard = ({ stores }: { stores: Awaited<ReturnType<typeof StoreDAO.getAllStores>> }) => {
  const [didOnboard, setDidOnboard] = useState<boolean>(true);

  useEffect(() => {
    if (stores.length > 0) return;

    document.cookie = `${CookieKeys.OnboardingProgress}=1; path=/`;
    setDidOnboard(false);
  }, [stores]);

  const closeOnboarding = () => {
    document.cookie = `${CookieKeys.OnboardingProgress}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    setDidOnboard(false);
  };

  if (didOnboard) return null;

  return (
    <Card className="flex flex-row items-stretch overflow-hidden shadow-none border-melrose-500 bg-melrose-50">
      {/* <div className="hidden w-4/12 bg-melrose-500 lg:block"></div> */}

      <div>
        <CardHeader className="relative">
          <CardTitle>🎉&nbsp;&nbsp;Comienza a configurar tu negocio</CardTitle>

          <CardDescription>
            <p>
              ¡No te preocupes! No llevará mucho tiempo y una vez que termines tendrás tu sitio web listo para recibir
              clientes.
            </p>
          </CardDescription>

          <Button
            variant="clear"
            aria-label="Cerrar"
            onClick={closeOnboarding}
            className="absolute top-2 right-2 text-melrose-500"
          >
            <X className="size-4" />
          </Button>
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
  );
};

export default OnboardingCard;
