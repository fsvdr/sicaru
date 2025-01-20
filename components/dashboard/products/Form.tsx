'use client';

import Button from '@components/generic/Button';
import { Card, CardContent } from '@components/generic/Card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  MoneyField,
  SaveBar,
  TextArea,
  TextField,
} from '@components/generic/Form';
import ImageDropZone from '@components/generic/ImageDropZone';
import MultipleImageDropZone from '@components/generic/MultipleImageDropZone';
import { Switch } from '@components/generic/Switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductDAO } from '@lib/dao/ProductDAO';
import { slugify } from '@utils/slugify';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { PageAnnotatedSection } from '../Page';
import { upsertProduct } from './actions';
import { optionChoiceSchema, optionGroupSchema, productSchema } from './types';

const ProductForm = ({ product }: { product?: Awaited<ReturnType<typeof ProductDAO.getProduct>> }) => {
  const router = useRouter();
  const [response, handleSubmit] = useFormState(upsertProduct, { state: 'PENDING' });

  const form = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: getFormValuesFromProduct(product),
  });

  const optionGroups = form.watch('optionGroups');

  useEffect(() => {
    if (response.state !== 'SUCCESS' || !response.data.product?.id) return;

    // If updating a product, reset the form with the updated values
    if (product?.id && response.state === 'SUCCESS') {
      form.reset(getFormValuesFromProduct(response.data.product));
      return;
    }

    // If creating a product, redirect to the product page
    router.push(`/products/${response.data.product?.id}`);
  }, [response]);

  // Add effect to auto-generate slug when name changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name') {
        form.setValue('slug', slugify(value.name || ''), { shouldDirty: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form className="flex flex-col gap-8" action={handleSubmit}>
        <SaveBar />

        <input type="hidden" name="id" value={product?.id ?? ''} />

        <PageAnnotatedSection title="Información general" description="Configura la información que tus clientes verán">
          <Card className="bg-gray-50/50">
            <CardContent className="flex flex-col gap-2 p-4">
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Está disponible?</FormLabel>

                    <Switch
                      name={field.name}
                      checked={field.value}
                      sendUnchecked
                      onCheckedChange={field.onChange}
                      label={field.value ? 'Disponible' : 'No disponible'}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>

                    <FormControl>
                      <TextField placeholder="Latte" type="text" {...field} required />
                    </FormControl>

                    <input type="hidden" name="slug" value={form.getValues('slug')} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio base</FormLabel>
                    <FormDescription>Precio base del producto sin contar opciones adicionales</FormDescription>

                    <FormControl>
                      <MoneyField
                        name="basePrice"
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value || 0, { shouldDirty: true })}
                      />
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
                      <TextArea placeholder="Shot de expresso con leche espumada" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>

                    <FormControl>
                      <TextField placeholder="Bebidas Calientes" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </PageAnnotatedSection>

        <PageAnnotatedSection title="Imágenes" description="Agrega imágenes de tu producto">
          <Card className="bg-gray-50/50">
            <CardContent className="flex flex-col gap-2 p-4">
              <FormField
                control={form.control}
                name="featuredImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagen principal</FormLabel>
                    <FormDescription>
                      Se mostrará en la lista de productos y en la página de detalle del producto
                    </FormDescription>

                    <FormControl>
                      <ImageDropZone
                        name={field.name}
                        defaultImageUrl={field.value}
                        className="w-full aspect-video"
                        onChange={(image) => field.onChange(image)}
                      />
                    </FormControl>

                    <FormMessage>Tamaño recomendado: 1920x1080px (16:9)</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imágenes adicionales</FormLabel>
                    <FormDescription>Se mostrarán en el detalle del producto</FormDescription>

                    <FormControl>
                      <MultipleImageDropZone
                        name={field.name}
                        defaultImageUrls={field.value}
                        className="w-full aspect-video"
                        onChange={(images) => field.onChange(images)}
                      />
                    </FormControl>

                    <FormMessage>Tamaño recomendado: 1920x1080px (16:9)</FormMessage>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </PageAnnotatedSection>

        <PageAnnotatedSection
          title="Variantes"
          description="Agrega variantes para que tus clientes personalicen tu producto"
        >
          <div className="flex flex-col gap-4">
            {(!optionGroups || optionGroups.length === 0) && <input type="hidden" name="optionGroups" value="[]" />}

            {optionGroups.map((optionGroup, optionGroupIndex) => (
              <Card className="bg-gray-50/50" key={optionGroupIndex}>
                <CardContent className="flex flex-col gap-2 p-4">
                  <FormField
                    control={form.control}
                    name={`optionGroups.${optionGroupIndex}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>

                        <FormControl>
                          <TextField placeholder="Tamaño" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`optionGroups.${optionGroupIndex}.required`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Es requerida?</FormLabel>
                        <FormDescription>
                          Si es requerida, el cliente no podrá agregar el producto sin seleccionar una opción
                        </FormDescription>

                        <FormControl>
                          <Switch
                            name={field.name}
                            checked={field.value}
                            sendUnchecked
                            onCheckedChange={field.onChange}
                            label={field.value ? 'Requerida' : 'Opcional'}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`optionGroups.${optionGroupIndex}.multiple`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>¿Puede seleccionar múltiples opciones?</FormLabel>

                        <FormControl>
                          <Switch
                            name={field.name}
                            checked={field.value}
                            sendUnchecked
                            onCheckedChange={field.onChange}
                            label={field.value ? 'Múltiple' : 'Única'}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.getValues(`optionGroups.${optionGroupIndex}.multiple`) && (
                    <>
                      <FormField
                        control={form.control}
                        name={`optionGroups.${optionGroupIndex}.minChoices`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mínimo de opciones</FormLabel>
                            <FormDescription>
                              En selección multiple, el cliente debe seleccionar al menos esta cantidad de opciones
                            </FormDescription>

                            <FormControl>
                              <TextField type="number" min={0} placeholder="1" {...field} value={field.value ?? ''} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`optionGroups.${optionGroupIndex}.maxChoices`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Máximo de opciones</FormLabel>
                            <FormDescription>
                              En selección multiple, el cliente puede seleccionar hasta esta cantidad de opciones
                            </FormDescription>

                            <FormControl>
                              <TextField type="number" min={0} placeholder="1" {...field} value={field.value ?? ''} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name={`optionGroups.${optionGroupIndex}.choices`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opciones</FormLabel>
                        <FormDescription>
                          Agrega el nombre y precio de cada variante. Si la selección no modifica el precio, déjalo en
                          0. Utiliza el switch para marcar si es la opción predeterminada.
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
                                    name={`optionGroups.${optionGroupIndex}.choices.${index}.name`}
                                    render={({ field }) => <TextField placeholder="Mediano" {...field} />}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`optionGroups.${optionGroupIndex}.choices.${index}.price`}
                                    render={({ field }) => (
                                      <MoneyField
                                        name={`optionGroups.${optionGroupIndex}.choices.${index}.price`}
                                        value={field.value}
                                        onValueChange={(values) =>
                                          field.onChange(values.value || 0, { shouldDirty: true })
                                        }
                                      />
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`optionGroups.${optionGroupIndex}.choices.${index}.isDefault`}
                                    render={({ field }) => (
                                      <Switch
                                        name={field.name}
                                        checked={field.value}
                                        sendUnchecked
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            const choices =
                                              form.getValues(`optionGroups.${optionGroupIndex}.choices`) || [];
                                            choices.forEach((_, choiceIndex) => {
                                              if (choiceIndex !== index) {
                                                form.setValue(
                                                  `optionGroups.${optionGroupIndex}.choices.${choiceIndex}.isDefault`,
                                                  false,
                                                  { shouldDirty: true }
                                                );
                                              }
                                            });
                                          }
                                          field.onChange(checked);
                                        }}
                                      />
                                    )}
                                  />
                                </div>

                                <Button
                                  type="button"
                                  tooltip="Eliminar variante"
                                  aria-label="Eliminar variante"
                                  variant="clear"
                                  disabled={form.getValues(
                                    `optionGroups.${optionGroupIndex}.choices.${index}.isDefault`
                                  )}
                                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => {
                                    const currentChoices =
                                      form.getValues(`optionGroups.${optionGroupIndex}.choices`) || [];
                                    form.setValue(
                                      `optionGroups.${optionGroupIndex}.choices`,
                                      currentChoices.filter((_, i) => i !== index),
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
                                const currentChoices = form.getValues(`optionGroups.${optionGroupIndex}.choices`) || [];
                                form.setValue(
                                  `optionGroups.${optionGroupIndex}.choices`,
                                  [...currentChoices, { name: '', price: 0, isDefault: false }],
                                  { shouldDirty: true }
                                );
                              }}
                            >
                              Agregar opción
                            </Button>
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
                const currentOptionGroups = form.getValues('optionGroups') || [];
                form.setValue(
                  'optionGroups',
                  [
                    ...currentOptionGroups,
                    {
                      name: '',
                      required: false,
                      multiple: false,
                      choices: [],
                      minChoices: 0,
                      maxChoices: 0,
                    },
                  ],
                  { shouldDirty: true }
                );
              }}
            >
              Agregar variante
            </Button>
          </div>
        </PageAnnotatedSection>
      </form>
    </Form>
  );
};

export default ProductForm;

export type ProductInput = z.infer<typeof productSchema>;
export type ProductOptionGroupInput = z.infer<typeof optionGroupSchema>;
export type ProductOptionChoiceInput = z.infer<typeof optionChoiceSchema>;

const getFormValuesFromProduct = (product: Awaited<ReturnType<typeof ProductDAO.getProduct>>) => {
  const values = {
    id: product?.id ?? '',
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    basePrice: product?.basePrice ? Number((product.basePrice / 100).toFixed(2)) : undefined,
    featuredImage: product?.featuredImage ?? '',
    images: product?.images ?? [],
    category: product?.category ?? '',
    tags: product?.tags ?? [],
    available: product?.available ?? true,
    optionGroups: product?.optionGroups.map((og) => ({
      ...og,
      choices: og.choices.map((c) => ({
        ...c,
        price: Number.isNaN(c.price) ? undefined : Number((c.price / 100).toFixed(2)),
        optionGroupId: c.optionGroupId ?? '',
      })),
    })) ?? [
      {
        name: '',
        required: false,
        multiple: false,
        choices: [{ name: '', price: undefined, isDefault: true }],
        minChoices: null,
        maxChoices: null,
      },
    ],
  };

  return values;
};
