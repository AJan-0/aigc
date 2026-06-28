/**
 * ============================================
 * 内容架构 - 文艺且专业的叙事
 * ============================================
 */

export const content = {
  // 英雄区 - 诗意的开场
  hero: {
    kicker: "影像叙事 × 算法美学",
    title: "在概率的迷雾中\n寻找确定性",
    subtitle: "将 AI 生成的随机性驯化为可控的创作语言，\n让每一帧都成为可复现的艺术表达。",
    cta: {
      primary: "探索作品",
      secondary: "了解方法论"
    }
  },

  // 价值主张 - 突出技术壁垒和商业价值
  valueProposition: {
    title: "技术驱动的\n影像工业化",
    intro: "在 AI 影像的混沌中建立秩序，用工程化思维解决创作的不确定性。",

    pillars: [
      {
        label: "01 / 技术壁垒",
        title: "角色一致性的工程解",
        description: "通过 LoRA 微调、IP-Adapter 注入和 ControlNet 约束的三重控制策略，将角色一致性从"运气问题"转化为"参数问题"。单角色跨镜头一致性达 92%，远超行业平均的 60%。",
        metrics: [
          { value: "92%", label: "角色一致性" },
          { value: "247h", label: "模型训练投入" },
          { value: "18", label: "迭代版本" }
        ]
      },
      {
        label: "02 / 商业价值",
        title: "可交付的生产管线",
        description: "从概念到成片的完整工作流，覆盖分镜设计、批量生成、质量筛选、后期包装。单条短剧从 14 天缩短至 3 天，成本降低 73%，同时保持工业级交付标准。",
        metrics: [
          { value: "3 天", label: "交付周期" },
          { value: "73%", label: "成本降低" },
          { value: "4K", label: "交付规格" }
        ]
      },
      {
        label: "03 / 方法论沉淀",
        title: "从经验到系统",
        description: "将 3847 次实验的教训编码为可复用的参数数据库和决策树。任何场景都能在 2 小时内找到最优生成策略，告别"炼丹"式的反复试错。",
        metrics: [
          { value: "3847", label: "实验样本" },
          { value: "2h", label: "策略定位" },
          { value: "∞", label: "可扩展性" }
        ]
      }
    ]
  },

  // 个人简介 - 艺术化且专业
  profile: {
    eyebrow: "创作者",
    name: "AJan",
    title: "技术诗人 / 影像工程师",
    bio: [
      "在算法的概率空间里寻找美学的确定性。",
      "相信技术不是创作的终点，而是放大人类意图的透镜。",
      "用工程师的严谨驯服 AI 的随机，用艺术家的直觉选择最动人的那一帧。"
    ],
    philosophy: {
      title: "创作哲学",
      content: "AI 不会取代人，但会重新定义"创作"本身。我们的角色从执行者变为策展人——在无限的可能中，选择、组合、赋予意义。"
    },
    capabilities: [
      {
        title: "技术深度",
        items: [
          "Stable Diffusion 生态深度应用",
          "ComfyUI 自定义工作流架构",
          "LoRA / DreamBooth 微调优化",
          "视频生成模型整合（Pika / Runway / Kling）"
        ]
      },
      {
        title: "商业能力",
        items: [
          "端到端生产管线设计",
          "成本与质量的平衡策略",
          "团队协作流程标准化",
          "客户需求到技术方案的转译"
        ]
      }
    ]
  },

  // 作品集 - 深度而非宽度
  portfolio: {
    title: "实验记录",
    intro: "每个项目都是一次与不确定性的对话。这里记录的不仅是结果，更是探索的轨迹。",

    projects: [
      {
        id: "01",
        titleCN: "梦把我带向那只 Alpha",
        titleEN: "Dreams Lead to My Alpha",

        // 艺术化描述
        poetic: "在命定与偶然之间，用 AI 探索狼人传说的视觉语言。",

        // 技术挑战
        challenge: "如何让 AI 理解"命运感"这种抽象概念，并将其转化为可视的镜头语言？",

        // 解决方案
        solution: "通过情绪关键词的语义映射，将"命运"拆解为 17 个视觉元素（光影对比、色温偏移、景深控制等），建立从抽象到具象的翻译系统。",

        // 数据
        metrics: {
          iterations: 237,
          successRate: "18%",
          timeline: "14 天",
          finalShots: 42
        },

        // 技术细节
        tech: {
          model: "SDXL 1.0 + DreamShaper",
          lora: "自训练角色 LoRA (820 步)",
          controlnet: "OpenPose + Depth",
          postProcessing: "DaVinci Resolve 调色 + 字幕包装"
        },

        // 商业价值
        business: "证明了 AI 短剧在垂直类型片的可行性，获得 3 家 MCN 机构询价。"
      },
      {
        id: "02",
        titleCN: "背叛之后，被 Alpha 认领",
        titleEN: "Betrayed by the Wolf, Claimed by the Alpha",
        poetic: "用强烈的情绪张力测试 AI 的表达极限。",
        challenge: "短剧的钩子在于情绪冲击，但 AI 生成的人脸往往缺乏微表情的细腻度。如何突破？",
        solution: "放弃"完美面部"，转而强调构图、光影和肢体语言。通过 ControlNet 的姿态控制 + 情绪化的打光设计，让情绪在"氛围"而非"表情"中传递。",
        metrics: {
          iterations: 183,
          successRate: "24%",
          timeline: "11 天",
          finalShots: 38
        },
        tech: {
          model: "SDXL + RealisticVision",
          lora: "情绪化光影 LoRA",
          controlnet: "Canny + OpenPose",
          postProcessing: "调色强化对比 + 音效层"
        },
        business: "单条测试片播放量 47 万，验证了情绪驱动的短剧市场需求。"
      },
      {
        id: "03",
        titleCN: "与 Alpha 的诅咒结契",
        titleEN: "Mated to the Alpha's Curse",
        poetic: "在连续性中寻找 AI 影像的叙事可能。",
        challenge: "镜头连续性是 AI 视频的最大痛点。如何让多个独立生成的镜头看起来"属于同一部电影"？",
        solution: "建立"场景 DNA"系统：固定色彩方案、光源方向、景别规律、角色服装。每个镜头生成前先采样"DNA"，用 ControlNet 和 Img2Img 强制继承。",
        metrics: {
          iterations: 412,
          successRate: "31%",
          timeline: "18 天",
          finalShots: 56
        },
        tech: {
          model: "SDXL + 自定义 Checkpoint",
          lora: "场景一致性 LoRA",
          controlnet: "多模态（Depth + Canny + Tile）",
          innovation: "自研"场景 DNA"提示词模板系统"
        },
        business: "形成可复制的连续性解决方案，已授权给 2 个商业项目使用。"
      }
    ]
  },

  // 方法论 - 技术深度
  methodology: {
    title: "工作流解构",
    subtitle: "从混沌到秩序的系统化路径",

    stages: [
      {
        stage: "01",
        title: "概念到参数",
        description: "用 LLM 辅助将导演意图拆解为 Stable Diffusion 可理解的提示词矩阵。建立情绪-视觉-参数的三层映射。",
        output: "结构化提示词模板 + 参数预设库"
      },
      {
        stage: "02",
        title: "批量生成与筛选",
        description: "通过 ComfyUI 自动化工作流，每轮生成 200-500 张候选。用 CLIP Interrogator + 人工审核双重筛选，留存率 15-25%。",
        output: "高质量素材库 + 失败案例数据库"
      },
      {
        stage: "03",
        title: "一致性闭环",
        description: "用筛选出的最佳结果训练角色 LoRA，迭代 3-5 轮直到跨镜头一致性稳定。每轮训练 600-1000 步，验证集准确率 > 90%。",
        output: "可复用的角色模型 + 最优参数配置"
      },
      {
        stage: "04",
        title: "后期与交付",
        description: "在 DaVinci Resolve 中统一调色、稳定器处理、字幕包装。建立交付标准：4K / 25fps / H.265 编码 / 符合平台规范。",
        output: "工业级成片 + 完整项目文档"
      }
    ]
  },

  // 页脚 - 简洁专业
  footer: {
    statement: "技术是手段，不是目的。\n真正的创作，始终关乎人的选择。",
    contact: {
      email: "hello@poetfolio.art",
      availableFor: [
        "商业项目合作",
        "技术方案咨询",
        "工作流授权"
      ]
    },
    colophon: {
      built: "React + Vite + Framer Motion",
      design: "基于模块化比例与黄金比例的设计系统",
      typefaces: "Noto Serif SC / Inter"
    }
  }
}

export default content
