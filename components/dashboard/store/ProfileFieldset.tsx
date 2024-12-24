import Button from '@components/generic/Button';
import { Card, CardContent } from '@components/generic/Card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  TextArea,
  TextField,
} from '@components/generic/Form';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/generic/Tooltip';
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
                  <TextField placeholder="Sicaru" type="text" {...field} required />
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
                  <TextField placeholder="Restaurante" type="text" {...field} />
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
                  <TextArea placeholder="Sicaru es un restaurante de comida mexicana" {...field} />
                </FormControl>
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

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              aria-label="Eliminar link"
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
                          </TooltipTrigger>

                          <TooltipContent>Eliminar link</TooltipContent>
                        </Tooltip>
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
        </CardContent>
      </Card>
    </PageAnnotatedSection>
  );
};

export default ProfileFieldset;
