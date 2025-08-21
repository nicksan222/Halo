import { Toggle } from './toggle';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Toggle aria-label="Toggle bold">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
      </svg>
    </Toggle>
  </div>
);

export const WithText = () => (
  <div className="w-[350px] space-y-4">
    <Toggle aria-label="Toggle italic">Italic</Toggle>
  </div>
);

export const Variants = () => (
  <div className="w-[350px] space-y-4">
    <Toggle aria-label="Toggle bold" variant="default">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
      </svg>
    </Toggle>
    <Toggle aria-label="Toggle italic" variant="outline">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
      </svg>
    </Toggle>
  </div>
);

export const Sizes = () => (
  <div className="w-[350px] space-y-4">
    <Toggle aria-label="Toggle bold" size="sm">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
      </svg>
    </Toggle>
    <Toggle aria-label="Toggle bold" size="default">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
      </svg>
    </Toggle>
    <Toggle aria-label="Toggle bold" size="lg">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
      </svg>
    </Toggle>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <Toggle aria-label="Toggle bold" disabled>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
      </svg>
    </Toggle>
  </div>
);
