import Button from '@components/generic/Button';
import { Card, CardContent } from '@components/generic/Card';
import ConfirmButton from '@components/generic/ConfirmButton';
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
import { Plus, Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { PageAnnotatedSection } from '../Page';
import { StoreDetailsInput } from './Form';

const LocationsFieldset = ({ form }: { form: UseFormReturn<StoreDetailsInput> }) => {
  const locations = form.watch('locations');

  return (
    <PageAnnotatedSection title="Sucursales" description="Agrega los datos de contacto de tu negocio">
      <div className="flex flex-col gap-4">
        {locations.map((location, locationIndex) => (
          <Card className="bg-gray-50/50" key={locationIndex}>
            <CardContent className="flex flex-col gap-2 p-4">
              <FormField
                control={form.control}
                name={`locations.${locationIndex}.isPrimary`}
                render={({ field }) => (
                  <FormItem className={locations.length === 1 ? 'hidden' : ''}>
                    <FormLabel>¿Es la sucursal principal?</FormLabel>

                    <Switch
                      name={field.name}
                      checked={field.value}
                      sendUnchecked
                      onCheckedChange={(checked) => {
                        // Prevent unchecking the primary location
                        if (!checked) return;

                        // If turning on primary, update all other locations
                        const locations = form.getValues('locations');
                        locations.forEach((_, index) => {
                          form.setValue(`locations.${index}.isPrimary`, index === locationIndex, {
                            shouldDirty: true,
                          });
                        });
                      }}
                      label={field.value ? 'Sucursal principal' : 'Sucursal'}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`locations.${locationIndex}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>

                    <FormControl>
                      <TextField placeholder="Sicaru" type="text" {...field} required={locations.length > 1} />
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
                        required
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
                        {(!field.value || field.value.length === 0) && (
                          <input type="hidden" name={field.name} value="[]" />
                        )}

                        {field.value?.map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center flex-1 gap-2">
                              <FormField
                                control={form.control}
                                name={`locations.${locationIndex}.phones.${index}.number`}
                                render={({ field }) => (
                                  <TextField
                                    placeholder="+52 123 456 7890"
                                    type="tel"
                                    className="w-48"
                                    {...field}
                                    required
                                  />
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`locations.${locationIndex}.phones.${index}.isWhatsapp`}
                                render={({ field }) => (
                                  <Switch
                                    name={field.name}
                                    checked={field.value}
                                    sendUnchecked
                                    onCheckedChange={field.onChange}
                                    label={field.value ? 'Whatsapp' : 'Teléfono'}
                                  />
                                )}
                              />
                            </div>

                            <Button
                              type="button"
                              tooltip="Eliminar número"
                              aria-label="Eliminar número"
                              variant="clear"
                              onClick={() => {
                                const currentPhones = form.getValues('locations.0.phones');
                                form.setValue(
                                  `locations.${locationIndex}.phones`,
                                  currentPhones.filter((_, i) => i !== index),
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
                            const currentPhones = form.getValues(`locations.${locationIndex}.phones`) || [];
                            form.setValue(
                              `locations.${locationIndex}.phones`,
                              [...currentPhones, { number: '', isWhatsapp: false }],
                              { shouldDirty: true }
                            );
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
                                <h4 className="text-xs font-medium">{day.label}</h4>

                                <input
                                  type="hidden"
                                  name={`locations.${locationIndex}.schedule.${dayIndex}.day`}
                                  value={day.id}
                                />

                                <FormField
                                  control={form.control}
                                  name={`locations.${locationIndex}.schedule.${dayIndex}.isOpen`}
                                  render={({ field: openField }) => (
                                    <Switch
                                      name={openField.name}
                                      checked={openField.value}
                                      sendUnchecked
                                      onCheckedChange={openField.onChange}
                                      label={openField.value ? 'Abierto' : 'Cerrado'}
                                      labelPosition="left"
                                    />
                                  )}
                                />
                              </div>

                              <div className="space-y-2" hidden={!daySchedule.isOpen}>
                                {daySchedule.ranges.map((_, rangeIndex) => (
                                  <div className="flex items-center gap-1 group" key={rangeIndex}>
                                    <TextField
                                      type="time"
                                      className="h-6 text-xs w-22"
                                      {...form.register(
                                        `locations.${locationIndex}.schedule.${dayIndex}.ranges.${rangeIndex}.open`
                                      )}
                                    />

                                    <span>-</span>

                                    <TextField
                                      type="time"
                                      className="h-6 text-xs w-22"
                                      {...form.register(
                                        `locations.${locationIndex}.schedule.${dayIndex}.ranges.${rangeIndex}.close`
                                      )}
                                    />

                                    {daySchedule.ranges.length > 1 && (
                                      <Button
                                        type="button"
                                        tooltip="Eliminar horario"
                                        aria-label="Eliminar horario"
                                        variant="clear"
                                        className="h-6"
                                        onClick={() => {
                                          const ranges = [...daySchedule.ranges];
                                          ranges.splice(rangeIndex, 1);
                                          form.setValue(
                                            `locations.${locationIndex}.schedule.${dayIndex}.ranges`,
                                            ranges,
                                            { shouldDirty: true }
                                          );
                                        }}
                                      >
                                        <Trash2 className="size-4 text-alizarin-crimson-500" />
                                      </Button>
                                    )}

                                    <Button
                                      type="button"
                                      tooltip="Agregar horario"
                                      aria-label="Agregar horario"
                                      variant="outline"
                                      className="hidden h-6 group-last:flex"
                                      onClick={() => {
                                        const ranges = [...daySchedule.ranges];
                                        ranges.push({ open: '09:00', close: '18:00' });
                                        form.setValue(
                                          `locations.${locationIndex}.schedule.${dayIndex}.ranges`,
                                          ranges,
                                          { shouldDirty: true }
                                        );
                                      }}
                                    >
                                      <Plus className="size-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {locations.length > 1 && !form.getValues(`locations.${locationIndex}.isPrimary`) && (
                <ConfirmButton
                  onConfirm={() => {
                    const currentLocations = form.getValues('locations');
                    currentLocations.splice(locationIndex, 1);
                    form.setValue('locations', currentLocations, { shouldDirty: true });
                  }}
                  onComplete={() => {}}
                >
                  {({ confirm, isLoading }) => (
                    <div className="flex items-center gap-2">
                      <Trash2 className="size-4" />
                      {confirm ? 'Confirmar' : 'Eliminar sucursal'}
                    </div>
                  )}
                </ConfirmButton>
              )}
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="border-dashed shadow-none enabled:hover:shadow-none"
          onClick={() => {
            const currentLocations = form.getValues('locations') || [];
            form.setValue(
              'locations',
              [
                ...currentLocations,
                {
                  name: '',
                  address: '',
                  phones: [{ number: '', isWhatsapp: false }],
                  isPrimary: false,
                  schedule: createDefaultSchedule(),
                },
              ],
              { shouldDirty: true }
            );
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
