import { Card, CardContent } from '@components/generic/Card';
import ColorPicker from '@components/generic/ColorPicker';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@components/generic/Form';
import ImageDropZone from '@components/generic/ImageDropZone';
import { UseFormReturn } from 'react-hook-form';
import { PageAnnotatedSection } from '../Page';
import { StoreDetailsInput } from './Form';

const BrandFieldset = ({ form }: { form: UseFormReturn<StoreDetailsInput> }) => {
  return (
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
                  Se mostrará en la navegación de tu sitio web y en las previsualizaciones cuando compartas el link a tu
                  sitio
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
            name="primaryColor"
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
  );
};

export default BrandFieldset;
