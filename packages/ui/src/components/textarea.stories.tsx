import { Textarea } from './textarea';

export default {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Textarea placeholder="Type your message here." />
  </div>
);

export const WithLabel = () => (
  <div className="w-[350px] space-y-2">
    <label htmlFor="message" className="text-sm font-medium">
      Message
    </label>
    <Textarea id="message" placeholder="Type your message here." />
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <Textarea placeholder="Disabled textarea" disabled />
  </div>
);

export const WithValue = () => (
  <div className="w-[350px] space-y-4">
    <Textarea defaultValue="This is a textarea with some default content. You can edit this text to see how the component behaves with longer content." />
  </div>
);

export const DifferentSizes = () => (
  <div className="w-[350px] space-y-4">
    <Textarea placeholder="Small textarea" className="min-h-12" />
    <Textarea placeholder="Default textarea" />
    <Textarea placeholder="Large textarea" className="min-h-32" />
  </div>
);
