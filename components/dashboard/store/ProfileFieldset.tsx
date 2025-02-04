import Button from '@components/generic/Button';
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
import { Switch } from '@components/generic/Switch';
import { Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PageAnnotatedSection } from '../Page';
import { StoreDetailsInput } from './Form';

const ProfileFieldset = ({ form }: { form: UseFormReturn<StoreDetailsInput> }) => {
  return (
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
                  <TextField placeholder="" type="text" {...field} required />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de negocio</FormLabel>

                <FormControl>
                  <TextField placeholder="" type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slogan</FormLabel>
                <FormDescription>Un breve resumen de lo que ofrecen tus productos o servicios.</FormDescription>

                <FormControl>
                  <TextField placeholder="" type="text" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>

                <FormControl>
                  <TextArea placeholder="" {...field} />
                </FormControl>
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

          <FormField
            control={form.control}
            name="socialLinks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Links</FormLabel>
                <FormDescription>
                  Agrega los links de tus redes sociales. Intentaremos utilizar el logo de la red social. Si no, se
                  mostrará el título o la URL completa.
                </FormDescription>

                <FormControl>
                  <div className="flex flex-col gap-2">
                    {(!field.value || field.value.length === 0) && (
                      <input type="hidden" name="socialLinks" value="[]" />
                    )}

                    {field.value?.map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <FormField
                          control={form.control}
                          name={`socialLinks.${index}.url`}
                          render={({ field }) => (
                            <TextField placeholder="https://..." type="url" className="flex-1" {...field} required />
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`socialLinks.${index}.title`}
                          render={({ field }) => (
                            <TextField placeholder="Instagram" type="text" className="w-32" {...field} />
                          )}
                        />

                        <Button
                          type="button"
                          aria-label="Eliminar link"
                          tooltip="Eliminar link"
                          variant="clear"
                          onClick={() => {
                            const currentLinks = form.getValues('socialLinks');
                            form.setValue(
                              'socialLinks',
                              currentLinks.filter((_, i) => i !== index),
                              { shouldDirty: true }
                            );
                          }}
                        >
                          <Trash2 className="text-alizarin-crimson-500 size-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="border-dashed shadow-none enabled:hover:shadow-none"
                      onClick={() => {
                        const currentLinks = form.getValues('socialLinks') || [];
                        form.setValue('socialLinks', [...currentLinks, { url: '', title: '' }], { shouldDirty: true });
                      }}
                    >
                      Agregar link
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Características</FormLabel>

                <FormControl>
                  <div className="flex flex-col gap-2">
                    <Switch
                      name="features.delivery"
                      checked={field.value.delivery}
                      sendUnchecked
                      onCheckedChange={(checked) => {
                        form.setValue('features', { ...field.value, delivery: checked }, { shouldDirty: true });
                      }}
                      label="Cuenta con delivery"
                    />
                    <Switch
                      name="features.reservationsAvailable"
                      checked={field.value.reservationsAvailable}
                      sendUnchecked
                      onCheckedChange={(checked) => {
                        form.setValue(
                          'features',
                          { ...field.value, reservationsAvailable: checked },
                          { shouldDirty: true }
                        );
                      }}
                      label="Acepta reservaciones"
                    />
                    <Switch
                      name="features.petFriendly"
                      checked={field.value.petFriendly}
                      sendUnchecked
                      onCheckedChange={(checked) => {
                        form.setValue('features', { ...field.value, petFriendly: checked }, { shouldDirty: true });
                      }}
                      label="Es pet friendly"
                    />
                    <Switch
                      name="features.wifi"
                      checked={field.value.wifi}
                      sendUnchecked
                      onCheckedChange={(checked) => {
                        form.setValue('features', { ...field.value, wifi: checked }, { shouldDirty: true });
                      }}
                      label="Cuenta con wifi"
                    />
                    <Switch
                      name="features.veganOptions"
                      checked={field.value.veganOptions}
                      sendUnchecked
                      onCheckedChange={(checked) => {
                        form.setValue('features', { ...field.value, veganOptions: checked }, { shouldDirty: true });
                      }}
                      label="Tiene opciones veganas"
                    />
                    <Switch
                      name="features.vegetarianOptions"
                      checked={field.value.vegetarianOptions}
                      sendUnchecked
                      onCheckedChange={(checked) => {
                        form.setValue(
                          'features',
                          { ...field.value, vegetarianOptions: checked },
                          { shouldDirty: true }
                        );
                      }}
                      label="Tiene opciones vegetarianas"
                    />
                    {/* <Switch
                      name="features.acceptedPaymentMethods"
                      checked={field.value.acceptedPaymentMethods}
                      label="Métodos de pago"
                    /> */}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </PageAnnotatedSection>
  );
};

export default ProfileFieldset;
