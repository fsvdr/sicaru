'use client';

import { PageAnnotatedSection } from '@components/dashboard/Page';
import { useWebsiteForm } from '@components/dashboard/website/WebsiteFormProvider';
import { verifySubdomainAvailability } from '@components/dashboard/website/actions';
import { Card, CardContent } from '@components/generic/Card';
import { FormDescription, FormItem, FormLabel, FormMessage, TextArea, TextField } from '@components/generic/Form';
import ImageDropZone from '@components/generic/ImageDropZone';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

const WebsiteConfigurationPage = () => {
  const { form } = useWebsiteForm();

  const originalSubdomain = form.options.defaultValues?.subdomain;

  return (
    <>
      <input type="hidden" name="slice" value="general" />

      <PageAnnotatedSection
        compact
        title="Dominio"
        description={`Puedes utilizar un subdominio de ${process.env.NEXT_PUBLIC_ROOT_DOMAIN} o un dominio propio`}
      >
        <Card className="bg-gray-50/50">
          <CardContent className="flex flex-col gap-2 p-4">
            <form.Field
              name="subdomain"
              asyncDebounceMs={500}
              validators={{
                onChangeAsync: async ({ value }) => {
                  if (!value || value === originalSubdomain) return undefined;

                  const response = await verifySubdomainAvailability(value);

                  if (response.state === 'ERROR') return 'No pudimos validar el subdominio, intenta de nuevo más tarde';

                  if (!response.data?.isAvailable) return 'Este subdominio ya está en uso';

                  return undefined;
                },
              }}
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Subdominio Sicaru</FormLabel>
                  <FormDescription>
                    Si no cuentas con un dominio propio, puedes utilizar un subdominio de{' '}
                    {process.env.NEXT_PUBLIC_ROOT_DOMAIN}.
                  </FormDescription>

                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">https://</span>
                    <div className="relative flex-1 max-w-40">
                      <TextField
                        placeholder="subdominio"
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                        meta={field.state.meta}
                        id={field.name}
                        required
                      />

                      {field.state.meta.isValidating && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                        </div>
                      )}

                      {!field.state.meta.isValidating && !field.state.meta.errors.length && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      )}

                      {!field.state.meta.isValidating && !!field.state.meta.errors.length && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                    </div>

                    <span className="text-gray-500">.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}</span>
                  </div>

                  {!field.state.meta.isValidating && <FormMessage meta={field.state.meta} />}
                </FormItem>
              )}
            />

            <form.Field
              name="customDomain"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Dominio propio</FormLabel>
                  <FormDescription>Si ya cuentas con un dominio propio, puedes utilizarlo.</FormDescription>

                  <div className="flex items-center gap-1">
                    <TextField
                      placeholder={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                      type="url"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                      meta={field.state.meta}
                      id={field.name}
                    />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </PageAnnotatedSection>

      <PageAnnotatedSection compact title="Metadata" description="Información general de tu sitio">
        <Card className="bg-gray-50/50">
          <CardContent className="flex flex-col gap-2 p-4">
            <form.Field
              name="favicon"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Ícono</FormLabel>
                  <FormDescription>Se mostrará como ícono de tu sitio web</FormDescription>

                  <ImageDropZone
                    name={field.name}
                    defaultImageUrl={field.state.value}
                    width="120"
                    height="120"
                    onChange={(image) => field.handleChange(image)}
                  />

                  <FormMessage>Tamaño recomendado: 320x320px (1:1)</FormMessage>
                </FormItem>
              )}
            />

            <form.Field
              name="title"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Título</FormLabel>
                  <FormDescription>El título de tu sitio web.</FormDescription>

                  <TextField
                    placeholder="Título"
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                    meta={field.state.meta}
                    id={field.name}
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="description"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Descripción</FormLabel>

                  <TextArea
                    placeholder=""
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                    meta={field.state.meta}
                    id={field.name}
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="coverImage"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Imagen de portada</FormLabel>
                  <FormDescription>Al compartir tu sitio web, se mostrará esta imagen.</FormDescription>

                  <ImageDropZone
                    name={field.name}
                    defaultImageUrl={field.state.value}
                    className="w-full aspect-video"
                    onChange={(image) => field.handleChange(image)}
                  />

                  <FormMessage>Tamaño recomendado: 1080x1080px (1:1) o 1920x1080px (16:9)</FormMessage>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </PageAnnotatedSection>
    </>
  );
};

export default WebsiteConfigurationPage;
