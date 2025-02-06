'use client';

import { PageAnnotatedSection } from '@components/dashboard/Page';
import { useWebsiteForm } from '@components/dashboard/website/WebsiteFormProvider';
import { Card, CardContent } from '@components/generic/Card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextArea,
  TextField,
} from '@components/generic/Form';
import ImageDropZone from '@components/generic/ImageDropZone';

const WebsiteConfigurationPage = () => {
  const { form } = useWebsiteForm();

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
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subdominio Sicaru</FormLabel>
                  <FormDescription>
                    Si no cuentas con un dominio propio, puedes utilizar un subdominio de{' '}
                    {process.env.NEXT_PUBLIC_ROOT_DOMAIN}.
                  </FormDescription>

                  <FormControl>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">https://</span>
                      <TextField placeholder="subdominio" className="max-w-40" type="text" {...field} />
                      <span className="text-gray-500">.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}</span>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dominio propio</FormLabel>
                  <FormDescription>Si ya cuentas con un dominio propio, puedes utilizarlo.</FormDescription>

                  <FormControl>
                    <div className="flex items-center gap-1">
                      <TextField placeholder={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`} type="url" {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </PageAnnotatedSection>

      <PageAnnotatedSection compact title="Metadata" description="Información general de tu sitio">
        <Card className="bg-gray-50/50">
          <CardContent className="flex flex-col gap-2 p-4">
            <FormField
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ícono</FormLabel>
                  <FormDescription>Se mostrará como ícono de tu sitio web</FormDescription>

                  <FormControl>
                    <ImageDropZone
                      name={field.name}
                      defaultImageUrl={field.value}
                      width="120"
                      height="120"
                      onChange={(image) => field.onChange(image)}
                    />
                  </FormControl>

                  <FormMessage>Tamaño recomendado: 320x320px (1:1)</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormDescription>El título de tu sitio web.</FormDescription>

                  <FormControl>
                    <TextField placeholder="Título" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>

                  <FormControl>
                    <TextArea placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen de portada</FormLabel>
                  <FormDescription>Al compartir tu sitio web, se mostrará esta imagen.</FormDescription>
                  <FormControl>
                    <ImageDropZone
                      name={field.name}
                      defaultImageUrl={field.value}
                      className="w-full aspect-video"
                      onChange={(image) => field.onChange(image)}
                    />
                  </FormControl>

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
