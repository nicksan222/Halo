import { ToggleGroup, ToggleGroupItem } from './toggle-group';

export default {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <ToggleGroup type="single">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
        </svg>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
        </svg>
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
        </svg>
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
);

export const Multiple = () => (
  <div className="w-[350px] space-y-4">
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        Bold
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        Italic
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        Underline
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
);

export const Outline = () => (
  <div className="w-[350px] space-y-4">
    <ToggleGroup type="single" variant="outline">
      <ToggleGroupItem value="left" aria-label="Align left">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
        </svg>
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
        </svg>
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 4H14V6H6V4ZM6 10H14V12H6V10ZM6 7H10V9H6V7Z" fill="currentColor" />
        </svg>
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
);

export const Sizes = () => (
  <div className="w-[350px] space-y-4">
    <ToggleGroup type="single" size="sm">
      <ToggleGroupItem value="small" aria-label="Small size">
        S
      </ToggleGroupItem>
      <ToggleGroupItem value="medium" aria-label="Medium size">
        M
      </ToggleGroupItem>
      <ToggleGroupItem value="large" aria-label="Large size">
        L
      </ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup type="single" size="default">
      <ToggleGroupItem value="small" aria-label="Small size">
        S
      </ToggleGroupItem>
      <ToggleGroupItem value="medium" aria-label="Medium size">
        M
      </ToggleGroupItem>
      <ToggleGroupItem value="large" aria-label="Large size">
        L
      </ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup type="single" size="lg">
      <ToggleGroupItem value="small" aria-label="Small size">
        S
      </ToggleGroupItem>
      <ToggleGroupItem value="medium" aria-label="Medium size">
        M
      </ToggleGroupItem>
      <ToggleGroupItem value="large" aria-label="Large size">
        L
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
);
