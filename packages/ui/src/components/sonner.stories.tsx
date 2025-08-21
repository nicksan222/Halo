import { Toaster } from './sonner';

export default {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <p className="text-sm text-muted-foreground">
      This is a toast notification component. It's typically used at the app level to show
      notifications.
    </p>
    <div className="p-4 border rounded-lg bg-muted">
      <p className="text-sm">
        The Toaster component is usually placed at the root of your app and used with the toast()
        function from sonner.
      </p>
    </div>
  </div>
);

export const WithCustomProps = () => (
  <div className="w-[350px] space-y-4">
    <p className="text-sm text-muted-foreground">
      The Toaster can be customized with various props from the sonner library.
    </p>
    <div className="p-4 border rounded-lg bg-muted">
      <p className="text-sm">
        Common props include: position, duration, richColors, closeButton, etc.
      </p>
    </div>
  </div>
);
