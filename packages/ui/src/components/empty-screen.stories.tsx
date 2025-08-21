import { FileText, List, Settings, Users } from 'lucide-react';
import { EmptyScreen } from './empty-screen';

export default {
  title: 'Components/EmptyScreen',
  component: EmptyScreen,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[400px]">
    <EmptyScreen headline="No items found" description="Get started by creating your first item." />
  </div>
);

export const WithIcon = () => (
  <div className="w-[400px]">
    <EmptyScreen
      icon={FileText}
      headline="No documents"
      description="Create your first document to get started."
    />
  </div>
);

export const WithButton = () => (
  <div className="w-[400px]">
    <EmptyScreen
      icon={Users}
      headline="No team members"
      description="Invite your team members to collaborate."
      buttonText="Invite Members"
      buttonOnClick={() => console.log('Invite clicked')}
    />
  </div>
);

export const WithCustomIcon = () => (
  <div className="w-[400px]">
    <EmptyScreen
      customIcon={
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Settings className="h-6 w-6 text-blue-600" />
        </div>
      }
      headline="No settings configured"
      description="Configure your settings to get started."
    />
  </div>
);

export const WithoutBorder = () => (
  <div className="w-[400px]">
    <EmptyScreen
      icon={List}
      headline="No items"
      description="Your list is empty."
      className="border-none"
    />
  </div>
);

export const CustomContent = () => (
  <div className="w-[400px]">
    <EmptyScreen
      icon={FileText}
      headline="No projects yet"
      description="Create your first project to get started with your workflow."
      buttonRaw={
        <div className="flex space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          >
            Create Project
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-input bg-background rounded-md text-sm"
          >
            Import Project
          </button>
        </div>
      }
    />
  </div>
);
