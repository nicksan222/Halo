import { Label } from './label';

export default {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Label htmlFor="email">Email</Label>
  </div>
);

export const WithInput = () => (
  <div className="w-[350px] space-y-2">
    <Label htmlFor="email">Email</Label>
    <input
      id="email"
      type="email"
      placeholder="Enter your email"
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

export const WithCheckbox = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <input
        id="terms"
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <Label htmlFor="disabled-input" className="opacity-50">
      Disabled Label
    </Label>
    <input
      id="disabled-input"
      type="text"
      disabled
      placeholder="Disabled input"
      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);

export const MultipleLabels = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <input
        id="name"
        type="text"
        placeholder="Enter your full name"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <input
        id="phone"
        type="tel"
        placeholder="Enter your phone number"
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  </div>
);
