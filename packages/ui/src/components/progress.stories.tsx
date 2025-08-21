import { Progress } from './progress';

export default {
  title: 'Components/Progress',
  component: Progress,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Progress value={33} />
  </div>
);

export const DifferentValues = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <div className="text-sm font-medium">25% Complete</div>
      <Progress value={25} />
    </div>
    <div className="space-y-2">
      <div className="text-sm font-medium">50% Complete</div>
      <Progress value={50} />
    </div>
    <div className="space-y-2">
      <div className="text-sm font-medium">75% Complete</div>
      <Progress value={75} />
    </div>
    <div className="space-y-2">
      <div className="text-sm font-medium">100% Complete</div>
      <Progress value={100} />
    </div>
  </div>
);

export const Indeterminate = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <div className="text-sm font-medium">Loading...</div>
      <Progress />
    </div>
  </div>
);

export const DifferentSizes = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <div className="text-sm font-medium">Small</div>
      <Progress value={60} className="h-1" />
    </div>
    <div className="space-y-2">
      <div className="text-sm font-medium">Default</div>
      <Progress value={60} />
    </div>
    <div className="space-y-2">
      <div className="text-sm font-medium">Large</div>
      <Progress value={60} className="h-4" />
    </div>
  </div>
);
