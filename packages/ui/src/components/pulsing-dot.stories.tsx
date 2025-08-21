import PulsingDot from './pulsing-dot';

export default {
  title: 'Components/PulsingDot',
  component: PulsingDot,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <PulsingDot />
  </div>
);

export const Sizes = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-4">
      <span className="text-sm">Small:</span>
      <PulsingDot size="sm" />
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm">Medium:</span>
      <PulsingDot size="md" />
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm">Large:</span>
      <PulsingDot size="lg" />
    </div>
  </div>
);

export const Colors = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-4">
      <span className="text-sm">Primary:</span>
      <PulsingDot color="primary" />
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm">Success:</span>
      <PulsingDot color="success" />
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm">Warning:</span>
      <PulsingDot color="warning" />
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm">Danger:</span>
      <PulsingDot color="danger" />
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-sm">Info:</span>
      <PulsingDot color="info" />
    </div>
  </div>
);

export const WithText = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <PulsingDot color="success" />
      <span className="text-sm">Online</span>
    </div>
    <div className="flex items-center space-x-2">
      <PulsingDot color="warning" />
      <span className="text-sm">Away</span>
    </div>
    <div className="flex items-center space-x-2">
      <PulsingDot color="danger" />
      <span className="text-sm">Offline</span>
    </div>
  </div>
);

export const AllVariants = () => (
  <div className="w-[350px] space-y-4">
    <div className="grid grid-cols-3 gap-4">
      <div className="flex flex-col items-center space-y-2">
        <PulsingDot size="sm" color="primary" />
        <span className="text-xs">Small Primary</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <PulsingDot size="md" color="success" />
        <span className="text-xs">Medium Success</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <PulsingDot size="lg" color="warning" />
        <span className="text-xs">Large Warning</span>
      </div>
    </div>
  </div>
);
