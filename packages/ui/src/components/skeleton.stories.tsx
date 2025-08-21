import { Skeleton } from './skeleton';

export default {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Skeleton className="h-4 w-[250px]" />
  </div>
);

export const Card = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
    <Skeleton className="h-[125px] w-[350px] rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

export const Avatar = () => (
  <div className="w-[350px] space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  </div>
);

export const DifferentSizes = () => (
  <div className="w-[350px] space-y-4">
    <Skeleton className="h-2 w-[100px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-6 w-[300px]" />
    <Skeleton className="h-8 w-[350px]" />
  </div>
);

export const Form = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-20 w-full" />
    </div>
    <Skeleton className="h-10 w-[100px]" />
  </div>
);
