import Button from '@components/generic/Button';
import { Card, CardContent } from '@components/generic/Card';
import { FormDescription, FormItem, FormLabel, FormMessage, TextArea, TextField } from '@components/generic/Form';
import ImageDropZone from '@components/generic/ImageDropZone';
import { Switch } from '@components/generic/Switch';
import { ReactFormExtendedApi } from '@tanstack/react-form';
import { Trash2 } from 'lucide-react';
import { PageAnnotatedSection } from '../Page';
import { StoreDetailsInput } from './Form';

const ProfileFieldset = ({ form }: { form: ReactFormExtendedApi<StoreDetailsInput> }) => {
  return (
    <PageAnnotatedSection title="Perfil" description="Configura el perfil de tu negocio">
      <Card className="bg-gray-50/50">
        <CardContent className="flex flex-col gap-2 p-4">
          <form.Field
            name="name"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Nombre</FormLabel>

                <TextField
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                  meta={field.state.meta}
                  id={field.name}
                  required
                />
              </FormItem>
            )}
          />

          <form.Field
            name="category"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Tipo de negocio</FormLabel>

                <TextField
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                  meta={field.state.meta}
                  id={field.name}
                  required
                />
              </FormItem>
            )}
          />

          <form.Field
            name="tagline"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Slogan</FormLabel>
                <FormDescription>Un breve resumen de lo que ofrecen tus productos o servicios.</FormDescription>

                <TextField
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                  meta={field.state.meta}
                  id={field.name}
                  required
                />
              </FormItem>
            )}
          />

          <form.Field
            name="bio"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Bio</FormLabel>

                <TextArea
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
            name="logo"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Logo</FormLabel>
                <FormDescription>
                  Se mostrará en la navegación de tu sitio web y en las previsualizaciones cuando compartas el link a tu
                  sitio
                </FormDescription>

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

          <form.Field
            name="socialLinks"
            mode="array"
            children={(field) => (
              <FormItem>
                <FormLabel htmlFor={field.name}>Links</FormLabel>
                <FormDescription>
                  Agrega los links de tus redes sociales. Intentaremos utilizar el logo de la red social. Si no, se
                  mostrará el título o la URL completa.
                </FormDescription>

                <div className="flex flex-col gap-2">
                  {(!field.state.value || field.state.value.length === 0) && (
                    <input type="hidden" name="socialLinks" value="[]" />
                  )}

                  {field.state.value?.map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <form.Field
                        name={`socialLinks[${index}].url`}
                        children={(field) => (
                          <TextField
                            placeholder="https://..."
                            type="url"
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                            className="flex-1"
                            required
                          />
                        )}
                        key={index}
                      />

                      <form.Field
                        name={`socialLinks[${index}].title`}
                        children={(field) => (
                          <TextField
                            placeholder="Instagram"
                            type="text"
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                            className="w-32"
                          />
                        )}
                      />

                      <Button
                        type="button"
                        aria-label="Eliminar link"
                        tooltip="Eliminar link"
                        variant="clear"
                        onClick={() => {
                          const currentLinks = form.getFieldValue('socialLinks');

                          form.setFieldValue(
                            'socialLinks',
                            currentLinks.filter((_, i) => i !== index)
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
                      const currentLinks = form.getFieldValue('socialLinks') || [];
                      form.setFieldValue('socialLinks', [...currentLinks, { url: '', title: '' }]);
                    }}
                  >
                    Agregar link
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <form.Field
            name="features"
            children={(field) => (
              <FormItem>
                <FormLabel>Características</FormLabel>

                <div className="flex flex-col gap-2">
                  <Switch
                    name="features.delivery"
                    checked={field.state.value.delivery}
                    sendUnchecked
                    onCheckedChange={(checked) => {
                      form.setFieldValue('features', { ...field.state.value, delivery: checked });
                    }}
                    label="Cuenta con delivery"
                    id="features-delivery"
                  />
                  <Switch
                    name="features.reservationsAvailable"
                    checked={field.state.value.reservationsAvailable}
                    sendUnchecked
                    onCheckedChange={(checked) => {
                      form.setFieldValue('features', { ...field.state.value, reservationsAvailable: checked });
                    }}
                    label="Acepta reservaciones"
                    id="features-reservations-available"
                  />
                  <Switch
                    name="features.petFriendly"
                    checked={field.state.value.petFriendly}
                    sendUnchecked
                    onCheckedChange={(checked) => {
                      form.setFieldValue('features', { ...field.state.value, petFriendly: checked });
                    }}
                    label="Es pet friendly"
                    id="features-pet-friendly"
                  />
                  <Switch
                    name="features.wifi"
                    checked={field.state.value.wifi}
                    sendUnchecked
                    onCheckedChange={(checked) => {
                      form.setFieldValue('features', { ...field.state.value, wifi: checked });
                    }}
                    label="Cuenta con wifi"
                    id="features-wifi"
                  />
                  <Switch
                    name="features.veganOptions"
                    checked={field.state.value.veganOptions}
                    sendUnchecked
                    onCheckedChange={(checked) => {
                      form.setFieldValue('features', { ...field.state.value, veganOptions: checked });
                    }}
                    label="Tiene opciones veganas"
                    id="features-vegan-options"
                  />
                  <Switch
                    name="features.vegetarianOptions"
                    checked={field.state.value.vegetarianOptions}
                    sendUnchecked
                    onCheckedChange={(checked) => {
                      form.setFieldValue('features', { ...field.state.value, vegetarianOptions: checked });
                    }}
                    label="Tiene opciones vegetarianas"
                    id="features-vegetarian-options"
                  />
                  {/* <Switch
                      name="features.acceptedPaymentMethods"
                      checked={field.state.value.acceptedPaymentMethods}
                      label="Métodos de pago"
                    /> */}
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </PageAnnotatedSection>
  );
};

export default ProfileFieldset;
