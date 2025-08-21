import { Switch } from './switch';

export default {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label
        htmlFor="airplane-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Airplane mode
      </label>
    </div>
  </div>
);

export const Checked = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Switch id="checked" defaultChecked />
      <label
        htmlFor="checked"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Already enabled
      </label>
    </div>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Switch id="disabled" disabled />
      <label
        htmlFor="disabled"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Disabled switch
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Switch id="disabled-checked" disabled defaultChecked />
      <label
        htmlFor="disabled-checked"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Disabled enabled
      </label>
    </div>
  </div>
);

export const Multiple = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-2">
      <Switch id="notifications" />
      <label
        htmlFor="notifications"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Notifications
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Switch id="dark-mode" defaultChecked />
      <label
        htmlFor="dark-mode"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Dark mode
      </label>
    </div>
    <div className="flex items-center space-x-2">
      <Switch id="auto-save" />
      <label
        htmlFor="auto-save"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Auto save
      </label>
    </div>
  </div>
);
