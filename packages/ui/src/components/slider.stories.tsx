import { Slider } from './slider';

export default {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] space-y-4">
    <Slider defaultValue={[50]} max={100} step={1} />
  </div>
);

export const WithValue = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="volume-slider" className="text-sm font-medium">
        Volume
      </label>
      <Slider id="volume-slider" defaultValue={[70]} max={100} step={1} />
    </div>
  </div>
);

export const Range = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="price-range-slider" className="text-sm font-medium">
        Price Range
      </label>
      <Slider id="price-range-slider" defaultValue={[20, 80]} max={100} step={1} />
    </div>
  </div>
);

export const CustomRange = () => (
  <div className="w-[350px] space-y-4">
    <div className="space-y-2">
      <label htmlFor="temperature-slider" className="text-sm font-medium">
        Temperature (°C)
      </label>
      <Slider id="temperature-slider" defaultValue={[25]} min={-20} max={40} step={1} />
    </div>
  </div>
);

export const Disabled = () => (
  <div className="w-[350px] space-y-4">
    <Slider defaultValue={[50]} max={100} step={1} disabled />
  </div>
);

export const MultipleSliders = () => (
  <div className="w-[350px] space-y-6">
    <div className="space-y-2">
      <label htmlFor="brightness-slider" className="text-sm font-medium">
        Brightness
      </label>
      <Slider id="brightness-slider" defaultValue={[80]} max={100} step={1} />
    </div>
    <div className="space-y-2">
      <label htmlFor="contrast-slider" className="text-sm font-medium">
        Contrast
      </label>
      <Slider id="contrast-slider" defaultValue={[60]} max={100} step={1} />
    </div>
    <div className="space-y-2">
      <label htmlFor="saturation-slider" className="text-sm font-medium">
        Saturation
      </label>
      <Slider id="saturation-slider" defaultValue={[40]} max={100} step={1} />
    </div>
  </div>
);
