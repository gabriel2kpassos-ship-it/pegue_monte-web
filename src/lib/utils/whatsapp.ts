export const WHATSAPP_NUMBER = "553185933480";

export type BuildWhatsAppLinkArgs = {
  nome: string;
  codigo: string;
  link: string;
  fotoUrl?: string;
};

export function buildWhatsAppLink(args: BuildWhatsAppLinkArgs) {
  const msg =
    `Olá! Encontrei este item no site da Vive Encante e gostaria de orçamento e disponibilidade.\n\n` +
    `Item: ${args.nome}\n` +
    `Código: ${args.codigo}\n` +
    `Link: ${args.link}\n` +
    `Foto: ${args.fotoUrl || ""}\n\n` +
    `Data do evento: \n` +
    `Bairro/Cidade:`;

  const text = encodeURIComponent(msg);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
