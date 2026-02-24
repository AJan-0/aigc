import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const items = [
  {
    id: "1",
    title: "Who we are",
    content:
      "AIGC Visual Studio — 专注高端视觉叙事与数字内容的创意工作室，擅长将概念转化为具备商业价值的影像与空间表达。",
  },
  {
    id: "2",
    title: "What we craft",
    content:
      "建筑可视化、品牌影像与AIGC叙事内容。以极简构图、精准光影与质感控制建立高级视觉统一性。",
  },
  {
    id: "3",
    title: "Design method",
    content:
      "从场景意图出发，建立清晰叙事节奏；在材质、尺度与光影上做到可验证的高保真。",
  },
  {
    id: "4",
    title: "Delivery model",
    content:
      "短周期高质量交付，强调流程标准化与资产复用，确保稳定输出与可持续迭代。",
  },
  {
    id: "5",
    title: "Visual thesis",
    content:
      "建筑语汇、材料质感与空间秩序。我们关注“克制、准确、耐看”的长期价值。",
  },
  {
    id: "6",
    title: "Who we serve",
    content:
      "与品牌方、开发方、设计团队协作，支持投融资沟通、传播发布与市场验证。",
  },
  {
    id: "7",
    title: "Toolkit",
    content:
      "DCC与AIGC工具链协作，工具服务于叙事与表达，而非相互炫技。",
  },
  {
    id: "8",
    title: "Contact",
    content:
      "欢迎合作与交流。可通过邮箱或社媒联系，我们专注高端视觉项目与长期合作。",
  },
];

export function Accordion05() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Accordion type="single" defaultValue="5" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="last:border-b">
            <AccordionTrigger className="text-left pl-6 md:pl-14 overflow-hidden text-foreground/20 duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 data-[state=open]:text-primary [&>svg]:hidden">
              <div className="flex flex-1 items-start gap-4">
                <p className="text-xs">{item.id}</p>
                <h1 className={cn("uppercase relative text-center text-3xl md:text-5xl")}>
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground pb-6 pl-6 md:px-20">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
