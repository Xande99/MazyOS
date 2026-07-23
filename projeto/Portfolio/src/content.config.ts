import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projetos = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projetos" }),
  schema: ({ image }) =>
    z.object({
      titulo: z.string(),
      descricao: z.string(),
      url: z.string().url().optional(),
      screenshot: image(),
      tags: z.array(z.string()),
      status: z.enum(["entregue", "em-desenvolvimento"]),
    }),
});

export const collections = { projetos };
