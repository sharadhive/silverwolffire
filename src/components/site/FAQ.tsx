import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HOMEPAGE_FAQS } from "@/data/faqs";

export const FAQ = () => (
  <section className="py-24 md:py-32">
    <div className="container max-w-3xl">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">FAQs</span>
        <h2 className="text-4xl md:text-5xl font-bold mt-4">
          Questions, <span className="text-gradient">answered.</span>
        </h2>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {HOMEPAGE_FAQS.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="glass rounded-xl px-6 border-0"
          >
            <AccordionTrigger className="text-left font-semibold hover:no-underline">
              <h3 className="inline text-left font-semibold">{f.question}</h3>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <p>{f.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
