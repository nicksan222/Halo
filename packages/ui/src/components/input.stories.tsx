import { Input } from './input';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Input placeholder="Enter your email" />
    <Input type="password" placeholder="Enter your password" />
    <Input type="number" placeholder="Enter a number" />
    <Input disabled placeholder="Disabled input" />
  </div>
);

export const WithLabel = () => (
  <div className="w-[350px] space-y-2">
    <label htmlFor="email" className="text-sm font-medium">
      Email
    </label>
    <Input id="email" type="email" placeholder="Enter your email" />
  </div>
);
