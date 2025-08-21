import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

export default {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">Joined December 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
);

export const WithUserProfile = () => (
  <div className="w-[350px] space-y-4">
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Hover for profile</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@shadcn</h4>
            <p className="text-sm">
              Full-stack developer. Building beautiful, accessible, and performant web applications.
            </p>
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">Joined January 2022</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
);

export const WithStats = () => (
  <div className="w-[350px] space-y-4">
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Project Stats</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Project Overview</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Commits</p>
              <p className="text-sm font-medium">1,234</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Issues</p>
              <p className="text-sm font-medium">56</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Stars</p>
              <p className="text-sm font-medium">2.3k</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Forks</p>
              <p className="text-sm font-medium">123</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
);

export const WithImage = () => (
  <div className="w-[350px] space-y-4">
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Hover for image</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Beautiful Landscape</h4>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
            alt="Mountain landscape"
            className="w-full h-32 object-cover rounded-md"
          />
          <p className="text-sm text-muted-foreground">
            A stunning mountain landscape captured in the wilderness.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
);

export const WithActions = () => (
  <div className="w-[350px] space-y-4">
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">Quick Actions</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Quick Actions</h4>
          <p className="text-sm text-muted-foreground">
            Common actions you can perform on this item.
          </p>
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <Button size="sm" variant="outline">
              Share
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  </div>
);
