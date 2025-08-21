import { Card, CardContent } from './card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './carousel';

export default {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[400px] space-y-4">
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`carousel-item-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

export const WithImages = () => (
  <div className="w-[400px] space-y-4">
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={`image-item-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <span className="text-2xl font-semibold">Image {index + 1}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

export const MultipleSlides = () => (
  <div className="w-[400px] space-y-4">
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 10 }).map((_, index) => (
          <CarouselItem key={`multiple-item-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <div className="text-center">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                    <p className="text-sm text-muted-foreground">Slide {index + 1}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

export const CustomNavigation = () => (
  <div className="w-[400px] space-y-4">
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={`custom-item-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  </div>
);

export const WithContent = () => (
  <div className="w-[400px] space-y-4">
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {[
          { title: 'Welcome', content: 'This is the first slide' },
          { title: 'Features', content: 'Discover amazing features' },
          { title: 'Get Started', content: 'Ready to begin?' }
        ].map((slide, index) => (
          <CarouselItem key={`content-item-${index + 1}`}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">{slide.title}</h3>
                    <p className="text-sm text-muted-foreground">{slide.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);
