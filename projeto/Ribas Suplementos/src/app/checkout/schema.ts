import { z } from "zod";

export const itemPedidoSchema = z.object({
  produtoId: z.string().uuid(),
  varianteId: z.string().uuid().nullable(),
  quantidade: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  nomeCliente: z.string().trim().min(2, "Informe o nome completo."),
  emailCliente: z.string().trim().email("E-mail inválido."),
  telefoneCliente: z.string().trim().min(8, "Telefone inválido."),
  endereco: z.object({
    rua: z.string().trim().min(2, "Informe a rua."),
    numero: z.string().trim().min(1, "Informe o número."),
    complemento: z.string().trim().optional(),
    bairro: z.string().trim().min(2, "Informe o bairro."),
    cidade: z.string().trim().min(2, "Informe a cidade."),
    uf: z.string().trim().length(2, "UF com 2 letras."),
    cep: z
      .string()
      .trim()
      .regex(/^\d{5}-?\d{3}$/, "CEP inválido."),
  }),
  itens: z.array(itemPedidoSchema).min(1, "O carrinho está vazio."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
