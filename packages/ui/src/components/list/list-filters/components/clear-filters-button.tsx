import { Button } from '@acme/ui/components/button';
import { X } from 'lucide-react';
import type React from 'react';

interface ClearFiltersButtonProps {
  onClick: () => void;
  visible: boolean;
}

export const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={onClick}>
      <X className="mr-1 h-4 w-4" />
      Rimuovi tutti i filtri
    </Button>
  );
};
