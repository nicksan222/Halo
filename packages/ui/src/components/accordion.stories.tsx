import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered'
  }
};

export const Default = () => (
  <div className="w-[400px]">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const Multiple = () => (
  <div className="w-[400px]">
    <Accordion type="multiple" className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I open multiple items?</AccordionTrigger>
        <AccordionContent>
          Yes, you can open multiple accordion items at the same time.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it customizable?</AccordionTrigger>
        <AccordionContent>
          Absolutely! You can customize the styling and behavior to match your needs.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What about keyboard navigation?</AccordionTrigger>
        <AccordionContent>
          Full keyboard navigation support is included out of the box.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const WithLongContent = () => (
  <div className="w-[400px]">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is this component?</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <p>
              This is an accordion component built with Radix UI primitives. It provides a way to
              organize content into collapsible sections.
            </p>
            <p>
              The accordion is fully accessible and supports keyboard navigation. It can be
              configured to allow single or multiple items to be open at once.
            </p>
            <p>
              You can customize the styling, animations, and behavior to match your design system.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);
