import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export default {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[400px]">
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Account</h4>
          <p className="text-sm text-muted-foreground">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Password</h4>
          <p className="text-sm text-muted-foreground">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export const ThreeTabs = () => (
  <div className="w-[400px]">
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Overview</h4>
          <p className="text-sm text-muted-foreground">This is the overview tab content.</p>
        </div>
      </TabsContent>
      <TabsContent value="analytics">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Analytics</h4>
          <p className="text-sm text-muted-foreground">View your analytics data here.</p>
        </div>
      </TabsContent>
      <TabsContent value="reports">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Reports</h4>
          <p className="text-sm text-muted-foreground">Generate and view reports.</p>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export const WithIcons = () => (
  <div className="w-[400px]">
    <Tabs defaultValue="settings" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="settings">
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
          Settings
        </TabsTrigger>
        <TabsTrigger value="profile">
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
          Profile
        </TabsTrigger>
      </TabsList>
      <TabsContent value="settings">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Settings</h4>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="profile">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Profile</h4>
          <p className="text-sm text-muted-foreground">Update your profile information.</p>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);
