import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>This is the card content area.</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </Card>
);

export const WithAction = () => (
  <Card className="w-[350px]">
    <CardHeader>
      <CardTitle>Card with Action</CardTitle>
      <CardDescription>This card has an action button in the header.</CardDescription>
    </CardHeader>
    <CardContent>
      <p>This card demonstrates the CardAction component.</p>
    </CardContent>
  </Card>
);
