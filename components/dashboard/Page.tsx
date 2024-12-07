import cn from '@utils/cn';
import { HTMLAttributes, ReactNode } from 'react';

export const DashboardPage = ({ children }: { children: ReactNode }) => {
  return <div className="flex flex-col gap-8">{children}</div>;
};

export const PageHeader = ({ children }: { children: ReactNode }) => {
  return <div className="flex items-center justify-between gap-4">{children}</div>;
};

export const PageTitle = ({
  as: Component = 'h1',
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) => {
  return <Component className={cn('text-2xl font-medium tracking-tight', className)} {...props} />;
};

export const PageAnnotatedSection = ({
  title,
  description,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr] md:gap-6 lg:gap-12">
      <div>
        <h2 className="text-sm font-medium md:text-lg">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {props.children}
    </div>
  );
};
