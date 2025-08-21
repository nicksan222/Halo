import { Button } from './button';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Button>Default Button</Button>
    <Button variant="destructive">Destructive Button</Button>
    <Button variant="outline">Outline Button</Button>
    <Button variant="secondary">Secondary Button</Button>
    <Button variant="ghost">Ghost Button</Button>
    <Button variant="link">Link Button</Button>
  </div>
);

export const Sizes = () => (
  <div className="w-[350px] space-y-4">
    <Button size="sm">Small Button</Button>
    <Button size="default">Default Button</Button>
    <Button size="lg">Large Button</Button>
    <Button size="icon">🔍</Button>
  </div>
);

export const WithIcons = () => (
  <div className="w-[350px] space-y-4">
    <Button>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 1V15M1 8H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Add Item
    </Button>
    <Button variant="outline">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 4L4 12M4 4L12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Close
    </Button>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <Button disabled>Disabled Button</Button>
    <Button variant="outline" disabled>
      Disabled Outline
    </Button>
  </div>
);
