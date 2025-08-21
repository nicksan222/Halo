import { ScrollArea } from './scroll-area';

export default {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[350px] h-[200px] border rounded-lg">
    <ScrollArea className="h-full w-full">
      <div className="p-4 space-y-4">
        <h4 className="text-sm font-medium">Scrollable Content</h4>
        <p className="text-sm text-muted-foreground">
          This is a scrollable area that shows a custom scrollbar when content overflows.
        </p>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={`scroll-item-${i + 1}`} className="p-2 border rounded">
            <p className="text-sm">Item {i + 1}</p>
            <p className="text-xs text-muted-foreground">
              This is item number {i + 1} in the scrollable list.
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export const WithLongText = () => (
  <div className="w-[350px] h-[200px] border rounded-lg">
    <ScrollArea className="h-full w-full">
      <div className="p-4">
        <h4 className="text-sm font-medium mb-4">Long Text Content</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam
          quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
        </p>
      </div>
    </ScrollArea>
  </div>
);

export const WithList = () => (
  <div className="w-[350px] h-[200px] border rounded-lg">
    <ScrollArea className="h-full w-full">
      <div className="p-4">
        <h4 className="text-sm font-medium mb-4">List Items</h4>
        <ul className="space-y-2">
          {Array.from({ length: 15 }, (_, i) => (
            <li key={`list-item-${i + 1}`} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">List item {i + 1}</span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  </div>
);

export const Horizontal = () => (
  <div className="w-[350px] h-[100px] border rounded-lg">
    <ScrollArea className="h-full w-full">
      <div className="flex space-x-4 p-4">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={`card-${i + 1}`}
            className="flex-shrink-0 w-32 h-16 bg-muted rounded flex items-center justify-center"
          >
            <span className="text-sm font-medium">Card {i + 1}</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);
