# List Filters

A flexible and powerful filtering system for lists in ownfit based on react-hook-form.

## Installation

The list filters functionality is part of the ownfit UI components. No additional installation is required if you're working within the ownfit project.

## Basic Usage

```tsx
import { FilterDef } from "@acme/ui-web/components/base/list/list-filters/types";
import { useListFilters } from "@acme/ui-web/components/base/list/list-filters/use-list-filters";

// Define your filter schema
type ClientFilters = {
  name: string | null;
  age: { min: number | null; max: number | null } | null;
  status: string | null;
  isActive: boolean | null;
};

// Define your filter configurations
const clientFilters: FilterDef<ClientFilters>[] = [
  {
    key: "name",
    label: "Name",
    type: "string",
  },
  {
    key: "age",
    label: "Age",
    type: "number",
    numberOptions: {
      hasMin: true,
      hasMax: true,
    },
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    key: "isActive",
    label: "Active",
    type: "boolean",
  },
];

function ClientsList() {
  const { FiltersComponent, form, resetFilters, clearFilters } =
    useListFilters<ClientFilters>(clientFilters, {
      defaultValues: {
        name: null,
        age: null,
        status: null,
        isActive: null,
      },
    });

  // Get the current filter values
  const filterValues = form.watch();

  // Use filterValues to filter your data...

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1>Clients</h1>
        <div className="flex gap-2">
          <Button onClick={resetFilters} size="sm" variant="outline">
            Reset
          </Button>
          <Button onClick={clearFilters} size="sm" variant="outline">
            Clear
          </Button>
        </div>
      </div>

      <FiltersComponent className="mb-4" />

      {/* Your list component */}
    </div>
  );
}
```

## API Reference

### `useListFilters<TFormValues>(filters, options)`

#### Parameters

1. `filters: FilterDef<TFormValues>[]` - Array of filter definitions
2. `options: UseListFiltersOptions<TFormValues>` - Configuration options
   - `defaultValues?: DefaultValues<TFormValues>` - Initial values for filters
   - `showCapsulesByDefault?: boolean | (Path<TFormValues>)[]` - Control which filters show capsules initially
   - `formOptions?: Omit<UseFormProps<TFormValues>, 'defaultValues'>` - Additional options for react-hook-form

#### Return Value

```typescript
{
  form: UseFormReturn<TFormValues>;
  resetFilters: () => void;
  clearFilters: () => void;
  setFilterValue: <K extends Path<TFormValues>>(key: K, value: any) => void;
  FiltersComponent: React.FC<{ className?: string }>;
  visibleCapsules: Record<string, boolean>;
  toggleCapsuleVisibility: (key: Path<TFormValues>) => void;
  setCapsuleVisibility: (key: Path<TFormValues>, visible: boolean) => void;
}
```

- `form` - The react-hook-form form instance
- `resetFilters` - Resets filters to their default values
- `clearFilters` - Clears all filters (sets to null/empty)
- `setFilterValue` - Updates a specific filter value programmatically
- `FiltersComponent` - Ready-to-use React component for rendering filters
- `visibleCapsules` - Current state of which filter capsules are visible
- `toggleCapsuleVisibility` - Toggle visibility of a filter capsule
- `setCapsuleVisibility` - Set visibility of a filter capsule

### FilterDef

Filter definition object type:

```typescript
interface FilterDef<TFormValues = any> {
  key: Path<TFormValues>; // Form field key
  label: string; // Display label
  type: "string" | "number" | "boolean" | "select" | "multiselect"; // Filter type

  // For 'select' and 'multiselect' types
  options?: { value: string; label: string }[];

  // For 'number' type
  numberOptions?: {
    hasMin?: boolean; // Show minimum value input
    hasMax?: boolean; // Show maximum value input
    minLabel?: string; // Label for minimum value input
    maxLabel?: string; // Label for maximum value input
  };
}
```

## Advanced Usage

### Show Capsules Based on Default Values

```tsx
const { FiltersComponent } = useListFilters<ClientFilters>(clientFilters, {
  defaultValues: {
    name: "John",
    status: "active",
    age: null,
    isActive: null,
  },
  showCapsulesByDefault: true, // Show capsules for fields with default values
});
```

### Show Only Specific Capsules Initially

```tsx
const { FiltersComponent } = useListFilters<ClientFilters>(clientFilters, {
  defaultValues: {
    name: "John",
    status: "active",
    age: null,
    isActive: null,
  },
  showCapsulesByDefault: ["name"], // Only show capsule for name filter initially
});
```

### Programmatically Updating Filters

```tsx
const { setFilterValue, setCapsuleVisibility } =
  useListFilters<ClientFilters>(clientFilters);

// Update a filter value and show its capsule
const selectActiveClients = () => {
  setFilterValue("isActive", true);
  setCapsuleVisibility("isActive", true);
};
```

### Handling Filter Changes

```tsx
const { form } = useListFilters<ClientFilters>(clientFilters);

// Watch for filter changes
React.useEffect(() => {
  const subscription = form.watch((value) => {
    console.log("Current filters:", value);
    // Fetch filtered data or update UI
  });

  return () => subscription.unsubscribe();
}, [form]);
```

### Using with React Query

```tsx
const { form } = useListFilters<ClientFilters>(clientFilters);
const filters = form.watch();

const { data, isLoading } = useQuery(
  ["clients", filters],
  () => fetchClients(filters),
  {
    keepPreviousData: true,
  }
);
```
