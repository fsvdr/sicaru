'use client';

import { Card, CardContent } from '@components/generic/Card';
import ColorPicker from '@components/generic/ColorPicker';
import {
  Form,
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageAnnotatedSection } from '../Page';
import { updateStoreDetails } from './actions';

const StoreDetailsForm = () => {
  const [response, handleSubmit] = useFormState(updateStoreDetails, { state: 'PENDING' });

  const form = useForm<StoreDetailsInput>({
    resolver: zodResolver(storeDetailsSchema),
    defaultValues: {
      id: '',
      name: '',
      favicon: '',
      logo: '',
      headline: '',
      bio: '',
    },
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-8" action={handleSubmit}>
        <PageAnnotatedSection title="Perfil" description="Configura el perfil de tu negocio">
          <Card className="bg-gray-50/50">
            <CardContent className="flex flex-col gap-2 p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>

                    <FormControl>
                      <TextField type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de negocio</FormLabel>

                    <FormControl>
                      <TextField type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía</FormLabel>

                    <FormControl>
                      <TextArea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </PageAnnotatedSection>

        <PageAnnotatedSection title="Marca" description="Agrega tus logos y colores">
          <Card className="bg-gray-50/50">
            <CardContent className="flex flex-col gap-2 p-4">
              <FormField
                control={form.control}
                name="favicon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícono</FormLabel>
                    <FormDescription>
                      Se mostrará en la navegación del administrador y como ícono de tu sitio web
                    </FormDescription>

                    <FormControl>
                      <ImageDropZone
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
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormDescription>
                      Se mostrará en la navegación de tu sitio web y en las previsualizaciones cuando compartas el link
                      a tu sitio
                    </FormDescription>
                    <FormControl>
                      <ImageDropZone
                        defaultImageUrl={field.value}
                        className="w-full aspect-video"
                        onChange={(image) => field.onChange(image)}
                      />
                    </FormControl>

                    <FormMessage>Tamaño recomendado: 1080x1080px (1:1) o 1920x1080px (16:9)</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color principal</FormLabel>

                    <FormControl>
                      <ColorPicker defaultValue={field.value} onChange={(color) => field.onChange(color)} />
                    </FormControl>

                    <FormMessage>Tip: Da click en el color para abrir el selector</FormMessage>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </PageAnnotatedSection>
      </form>
    </Form>
  );
};

export default StoreDetailsForm;

export const storeDetailsSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  favicon: z.string().optional(),
  logo: z.string().optional(),
  headline: z.string().max(42).optional(),
  bio: z.string().optional(),
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/)
    .optional()
    .describe('Must be a valid hex color (e.g., #FF0000 or #FF0000FF)'),
});

export type StoreDetailsInput = z.infer<typeof storeDetailsSchema>;
