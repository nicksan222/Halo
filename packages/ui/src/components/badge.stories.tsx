import { Badge } from './badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Badge>Default Badge</Badge>
    <Badge variant="secondary">Secondary Badge</Badge>
    <Badge variant="destructive">Destructive Badge</Badge>
    <Badge variant="outline">Outline Badge</Badge>
  </div>
);

export const WithIcon = () => (
  <div className="w-[350px] space-y-4">
    <Badge>
      <svg
        width="12"
        height="12"
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
      New
    </Badge>
    <Badge variant="secondary">
      <svg
        width="12"
        height="12"
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
      Closed
    </Badge>
  </div>
);

export const Status = () => (
  <div className="w-[350px] space-y-4">
    <Badge variant="default">Active</Badge>
    <Badge variant="secondary">Pending</Badge>
    <Badge variant="destructive">Failed</Badge>
    <Badge variant="outline">Draft</Badge>
  </div>
);
