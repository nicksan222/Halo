import { Button } from '@acme/ui/components/button';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    href: string;
    label: string;
  };
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, description, action, backHref, backLabel }: PageHeaderProps) {
  const defaultBackLabel = backLabel ?? 'Back';
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {backHref && (
          <Button asChild variant="secondary">
            <Link href={backHref}>{defaultBackLabel}</Link>
          </Button>
        )}
        {action && (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
