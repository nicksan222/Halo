import { Alert, AlertDescription, AlertTitle } from './alert';

export default {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  </div>
);

export const Destructive = () => (
  <div className="w-[350px] space-y-4">
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  </div>
);

export const WithIcon = () => (
  <div className="w-[350px] space-y-4">
    <Alert>
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
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
    </Alert>
  </div>
);

export const TitleOnly = () => (
  <div className="w-[350px] space-y-4">
    <Alert>
      <AlertTitle>Important Notice</AlertTitle>
    </Alert>
  </div>
);
