import { AspectRatio } from './aspect-ratio';

export default {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Mountain landscape by Drew Beamer"
        className="object-cover w-full h-full rounded-md"
      />
    </AspectRatio>
  </div>
);

export const Square = () => (
  <div className="w-[350px] space-y-4">
    <AspectRatio ratio={1} className="bg-muted">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Mountain landscape by Drew Beamer"
        className="object-cover w-full h-full rounded-md"
      />
    </AspectRatio>
  </div>
);

export const Portrait = () => (
  <div className="w-[350px] space-y-4">
    <AspectRatio ratio={3 / 4} className="bg-muted">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Mountain landscape by Drew Beamer"
        className="object-cover w-full h-full rounded-md"
      />
    </AspectRatio>
  </div>
);

export const Video = () => (
  <div className="w-[350px] space-y-4">
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <iframe
        src="https://www.youtube.com/embed/dQw4w9WgXcQ"
        title="YouTube video player"
        className="w-full h-full rounded-md"
        allowFullScreen
      />
    </AspectRatio>
  </div>
);

export const WithContent = () => (
  <div className="w-[350px] space-y-4">
    <AspectRatio ratio={16 / 9} className="bg-muted">
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
        <div className="text-center text-white">
          <h3 className="text-lg font-semibold">Custom Content</h3>
          <p className="text-sm opacity-90">This can be any content</p>
        </div>
      </div>
    </AspectRatio>
  </div>
);
