import { Input } from '@acme/ui/components/input';

// Typesafe FilterDef for number filter
export type NumberFilterDef<_TFormValues> = {
  key: string;
  placeholder?: string;
  label?: string;
  value: number | null;
  onChange: (value: number | null) => void;
};

interface NumberFilterProps<TFormValues> {
  filter: NumberFilterDef<TFormValues>;
}

export const NumberFilter = <TFormValues,>({ filter }: NumberFilterProps<TFormValues>) => {
  const { placeholder, value, onChange } = filter;

  return (
    <div className="relative">
      <Input
        type="number"
        placeholder={placeholder}
        value={value === null || value === undefined ? '' : value}
        onChange={(e) => {
          const v = e.target.value === '' ? null : Number(e.target.value);
          onChange(v);
        }}
      />
    </div>
  );
};
