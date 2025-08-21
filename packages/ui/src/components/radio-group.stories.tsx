import { RadioGroup, RadioGroupItem } from './radio-group';

export default {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <label
          htmlFor="option-one"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Option One
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <label
          htmlFor="option-two"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Option Two
        </label>
      </div>
    </RadioGroup>
  </div>
);

export const WithDescriptions = () => (
  <div className="w-[350px] space-y-4">
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <label
          htmlFor="r1"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Default
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <label
          htmlFor="r2"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Comfortable
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <label
          htmlFor="r3"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Compact
        </label>
      </div>
    </RadioGroup>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="disabled-one" disabled />
        <label
          htmlFor="disabled-one"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Disabled Option One
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="disabled-two" disabled />
        <label
          htmlFor="disabled-two"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Disabled Option Two
        </label>
      </div>
    </RadioGroup>
  </div>
);

export const Vertical = () => (
  <div className="w-[350px] space-y-4">
    <RadioGroup defaultValue="option-one" className="grid grid-cols-1 gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="vertical-one" />
        <label
          htmlFor="vertical-one"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Option One
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="vertical-two" />
        <label
          htmlFor="vertical-two"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Option Two
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-three" id="vertical-three" />
        <label
          htmlFor="vertical-three"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Option Three
        </label>
      </div>
    </RadioGroup>
  </div>
);
