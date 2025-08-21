import { Separator } from './separator';

export default {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <div>Content above</div>
    <Separator />
    <div>Content below</div>
  </div>
);

export const Vertical = () => (
  <div className="w-[350px] h-20 flex items-center space-x-4">
    <div>Left content</div>
    <Separator orientation="vertical" />
    <div>Right content</div>
  </div>
);

export const MultipleSeparators = () => (
  <div className="w-[350px] space-y-4">
    <div>First section</div>
    <Separator />
    <div>Second section</div>
    <Separator />
    <div>Third section</div>
    <Separator />
    <div>Fourth section</div>
  </div>
);

export const WithLabels = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Section 1</h4>
      <p className="text-sm text-muted-foreground">This is the content for the first section.</p>
    </div>
    <Separator />
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Section 2</h4>
      <p className="text-sm text-muted-foreground">This is the content for the second section.</p>
    </div>
  </div>
);

export const CustomStyling = () => (
  <div className="w-[350px] space-y-4">
    <div>Content above</div>
    <Separator className="my-4" />
    <div>Content below</div>
    <Separator className="my-4 bg-primary" />
    <div>More content</div>
  </div>
);
