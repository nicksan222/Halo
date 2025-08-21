import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable';

export default {
  title: 'Components/Resizable',
  component: ResizablePanelGroup,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[600px] h-[400px] border rounded-lg">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel 1</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Panel 2</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export const WithHandle = () => (
  <div className="w-[600px] h-[400px] border rounded-lg">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 bg-muted">
          <span className="font-semibold">Left Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 bg-muted">
          <span className="font-semibold">Right Panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export const Vertical = () => (
  <div className="w-[600px] h-[400px] border rounded-lg">
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 bg-muted">
          <span className="font-semibold">Top Panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 bg-muted">
          <span className="font-semibold">Bottom Panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);

export const ThreePanels = () => (
  <div className="w-[600px] h-[400px] border rounded-lg">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6 bg-muted">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Main Content</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6 bg-muted">
          <span className="font-semibold">Details</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
);
