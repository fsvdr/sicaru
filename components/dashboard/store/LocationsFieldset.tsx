import Button from '@components/generic/Button';
import { Card, CardContent } from '@components/generic/Card';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TextField,
} from '@components/generic/Form';
import { Switch } from '@components/generic/Switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/generic/Tooltip';
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PageAnnotatedSection } from '../Page';
import { StoreDetailsInput } from './Form';

const LocationsFieldset = ({ form }: { form: UseFormReturn<StoreDetailsInput> }) => {
  return (
    <PageAnnotatedSection title="Sucursales" description="Agrega los datos de contacto de tu negocio">
      <div className="flex flex-col gap-4">
        {form.watch('locations').map((location, locationIndex) => (
          <Card className="bg-gray-50/50" key={locationIndex}>
            <CardContent className="flex flex-col gap-2 p-4">
              {form.watch('locations').length > 1 && (
                <FormField
                  control={form.control}
                  name={`locations.${locationIndex}.isPrimary`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>¿Es la sucursal principal?</FormLabel>

                      <div className="flex items-center gap-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span className="text-xs text-gray-500">{field.value ? 'Sucursal principal' : 'Sucursal'}</span>
                      </div>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name={`locations.${locationIndex}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>

                    <FormControl>
                      <TextField placeholder="Sicaru" type="text" {...field} />
                    </FormControl>

                    <FormMessage>Si tienes múltiples sucursales, puedes asignarle un nombre aquí</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${locationIndex}.address`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>

                    <FormControl>
                      <TextField
                        type="address"
                        placeholder="Av. Revolución 123, Col. Centro, Ciudad de México, México"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${locationIndex}.phones`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfonos</FormLabel>
                    <FormDescription>
                      Agrega los teléfonos de contacto de tu negocio. Utiliza el switch para marcar si es un número de
                      Whatsapp
                    </FormDescription>

                    <FormControl>
                      <div className="flex flex-col gap-2">
                        {form.watch('locations.0.phones')?.map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex-1 flex items-center gap-2">
                              <FormField
                                control={form.control}
                                name={`locations.${locationIndex}.phones.${index}.number`}
                                render={({ field }) => (
                                  <TextField placeholder="+52 123 456 7890" type="tel" className="w-48" {...field} />
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`locations.${locationIndex}.phones.${index}.isWhatsapp`}
                                render={({ field }) => (
                                  <div className="flex items-center gap-2">
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    <span className="text-xs text-gray-500">
                                      {field.value ? 'Whatsapp' : 'Teléfono'}
                                    </span>
                                  </div>
                                )}
                              />
                            </div>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  aria-label="Eliminar número"
                                  variant="clear"
                                  onClick={() => {
                                    const currentPhones = form.getValues('locations.0.phones');
                                    form.setValue(
                                      `locations.${locationIndex}.phones`,
                                      currentPhones.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  <Trash2 className="text-alizarin-crimson-500 size-4" />
                                </Button>
                              </TooltipTrigger>

                              <TooltipContent>Eliminar número</TooltipContent>
                            </Tooltip>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="border-dashed shadow-none enabled:hover:shadow-none"
                          onClick={() => {
                            const currentPhones = form.getValues(`locations.${locationIndex}.phones`) || [];
                            form.setValue(`locations.${locationIndex}.phones`, [
                              ...currentPhones,
                              { number: '', isWhatsapp: false },
                            ]);
                          }}
                        >
                          Agregar número
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${locationIndex}.schedule`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horario</FormLabel>
                    <FormDescription>Define el horario de atención de tu negocio</FormDescription>

                    <FormControl>
                      <div className="space-y-1 divide-y">
                        {DAYS_OF_WEEK.map((day, dayIndex) => {
                          const daySchedule = form.watch(`locations.${locationIndex}.schedule.${dayIndex}`);

                          return (
                            <div className="py-2 space-y-2 md:px-4" key={day.id}>
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-xs">{day.label}</h4>

                                <FormField
                                  control={form.control}
                                  name={`locations.${locationIndex}.schedule.${dayIndex}.isOpen`}
                                  render={({ field: openField }) => (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500">
                                        {openField.value ? 'Abierto' : 'Cerrado'}
                                      </span>
                                      <Switch checked={openField.value} onCheckedChange={openField.onChange} />
                                    </div>
                                  )}
                                />
                              </div>

                              {daySchedule.isOpen && (
                                <div className="space-y-2">
                                  {daySchedule.ranges.map((_, rangeIndex) => (
                                    <div className="group flex items-center gap-1" key={rangeIndex}>
                                      <TextField
                                        type="time"
                                        className="w-22 text-xs h-6"
                                        {...form.register(
                                          `locations.${locationIndex}.schedule.${dayIndex}.ranges.${rangeIndex}.open`
                                        )}
                                      />

                                      <span>-</span>

                                      <TextField
                                        type="time"
                                        className="w-22 text-xs h-6"
                                        {...form.register(
                                          `locations.${locationIndex}.schedule.${dayIndex}.ranges.${rangeIndex}.close`
                                        )}
                                      />

                                      {daySchedule.ranges.length > 1 && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              type="button"
                                              aria-label="Eliminar horario"
                                              variant="clear"
                                              className="h-6"
                                              onClick={() => {
                                                const ranges = [...daySchedule.ranges];
                                                ranges.splice(rangeIndex, 1);
                                                form.setValue(
                                                  `locations.${locationIndex}.schedule.${dayIndex}.ranges`,
                                                  ranges
                                                );
                                              }}
                                            >
                                              <Trash2 className="size-4 text-alizarin-crimson-500" />
                                            </Button>
                                          </TooltipTrigger>

                                          <TooltipContent>Eliminar horario</TooltipContent>
                                        </Tooltip>
                                      )}

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            className="group-last:flex hidden h-6"
                                            onClick={() => {
                                              const ranges = [...daySchedule.ranges];
                                              ranges.push({ open: '09:00', close: '18:00' });
                                              form.setValue(
                                                `locations.${locationIndex}.schedule.${dayIndex}.ranges`,
                                                ranges
                                              );
                                            }}
                                          >
                                            <Plus className="size-4" />
                                          </Button>
                                        </TooltipTrigger>

                                        <TooltipContent>Agregar horario</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="border-dashed shadow-none enabled:hover:shadow-none"
          onClick={() => {
            const currentLocations = form.getValues('locations') || [];
            form.setValue('locations', [
              ...currentLocations,
              {
                name: '',
                address: '',
                phones: [{ number: '', isWhatsapp: false }],
                isPrimary: false,
                schedule: createDefaultSchedule(),
              },
            ]);
          }}
        >
          Agregar sucursal
        </Button>
      </div>
    </PageAnnotatedSection>
  );
};

export default LocationsFieldset;

export const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Lunes' },
  { id: 'tuesday', label: 'Martes' },
  { id: 'wednesday', label: 'Miércoles' },
  { id: 'thursday', label: 'Jueves' },
  { id: 'friday', label: 'Viernes' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
] as const;

export const createDefaultSchedule = () =>
  DAYS_OF_WEEK.map((day) => ({
    day: day.id,
    isOpen: true,
    ranges: [{ open: '09:00', close: '18:00' }],
  }));
