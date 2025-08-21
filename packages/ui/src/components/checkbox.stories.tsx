import { Checkbox } from './checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  </div>
);

export const Checked = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Checkbox id="checked" defaultChecked />
      <label
        htmlFor="checked"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Already checked
      </label>
    </div>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled" disabled />
      <label
        htmlFor="disabled"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Disabled checkbox
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-checked" disabled defaultChecked />
      <label
        htmlFor="disabled-checked"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Disabled checked
      </label>
    </div>
  </div>
);

export const Multiple = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Checkbox id="option1" />
      <label
        htmlFor="option1"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Option 1
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="option2" defaultChecked />
      <label
        htmlFor="option2"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Option 2
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="option3" />
      <label
        htmlFor="option3"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Option 3
      </label>
    </div>
  </div>
);
