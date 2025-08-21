import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

export default {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted rounded-lg">
        <span className="text-sm font-medium">Click to expand</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <p className="text-sm text-muted-foreground">
          This is the collapsible content. It can contain any type of content including text,
          images, or other components.
        </p>
      </CollapsibleContent>
    </Collapsible>
  </div>
);

export const WithButton = () => (
  <div className="w-[350px] space-y-4">
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted rounded-lg hover:bg-muted/80">
        <span className="text-sm font-medium">Settings</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 space-y-2">
        <div className="space-y-2">
          <label htmlFor="theme-select" className="text-sm font-medium">
            Theme
          </label>
          <select id="theme-select" className="w-full p-2 border rounded">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="language-select" className="text-sm font-medium">
            Language
          </label>
          <select id="language-select" className="w-full p-2 border rounded">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
);

export const MultipleCollapsibles = () => (
  <div className="w-[350px] space-y-4">
    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted rounded-lg">
        <span className="text-sm font-medium">Section 1</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <p className="text-sm text-muted-foreground">Content for section 1.</p>
      </CollapsibleContent>
    </Collapsible>

    <Collapsible>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left bg-muted rounded-lg">
        <span className="text-sm font-medium">Section 2</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4">
        <p className="text-sm text-muted-foreground">Content for section 2.</p>
      </CollapsibleContent>
    </Collapsible>
  </div>
);
