import Badge from '@components/generic/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/generic/Table';
import db from '@db/index';
import { ProductDAO } from '@lib/dao/ProductDAO';
import { formatCurrency } from '@utils/formatters';
import { ChevronRight } from 'lucide-react';
import Link from 'next/dist/client/link';
import Image from 'next/image';

const ProductsListing = async ({ storeId }: { storeId: string }) => {
  const products = await ProductDAO.getStoreProducts({ db: db, storeId: storeId });

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-xs">
          <TableHead></TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Estatus</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.map((product) => {
          const url = `/products/${product.id}`;

          return (
            <TableRow key={product.id}>
              <TableCell>
                <div className="h-10 w-10 relative">
                  <Link href={url}>
                    {product.images?.length ? (
                      <Image
                        src={product.images?.[0] ?? '/images/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-200"></div>
                    )}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <Link href={url}>{product.name}</Link>
              </TableCell>
              <TableCell>
                <Badge variant={product.available ? 'default' : 'muted'}>
                  {product.available ? 'Disponible' : 'No disponible'}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(product.basePrice)}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link aria-label="Ver producto" href={url}>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductsListing;
