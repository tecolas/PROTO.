/**
 * Institutional pages (footer "Institucional" column).
 * Each page becomes a static route at /institucional/<slug>/.
 *
 * Inline tokens inside text are turned into links by the page renderer:
 *   {whatsapp}     → WhatsApp (19) 98286-5594
 *   {instagram}    → Instagram @jaguarniche.co
 *   {privacidade}  → Política de Privacidade (linked once that page exists)
 *   {loja}         → link back to the shop
 */

export type Block = string | { list: string[] };
export type Section = { title: string; blocks: Block[] };
export type InstitutionalPage = {
  slug: string;
  /** label used in the footer and side menu */
  label: string;
  title: string;
  updated: string;
  intro: string;
  sections: Section[];
};

export const PAGES: InstitutionalPage[] = [
  {
    slug: "termos",
    label: "Termos de uso",
    title: "Termos de Uso",
    updated: "novembro de 2026",
    intro: "Ao comprar na Jaguar Niche, você concorda com as regras abaixo. Elas valem para todas as compras feitas pelo site.",
    sections: [
      {
        title: "Produtos",
        blocks: [
          "Todas as peças vendidas pela Jaguar Niche são novas, de produção própria e em lotes limitados.",
          "As imagens do site, incluindo as peças em 3D, são ilustrativas. As cores podem variar levemente de acordo com a tela de cada aparelho. Composição, gramatura e cuidados de cada modelo estão descritos na página.",
          "Antes de comprar, confira a tabela de medidas disponível em cada produto da {loja}. A disponibilidade de cor e tamanho é confirmada no atendimento ao finalizar o pedido.",
        ],
      },
      {
        title: "Pagamento",
        blocks: [
          "Aceitamos Pix e cartão de crédito. Não trabalhamos com boleto. A forma de pagamento e as condições de parcelamento são combinadas no atendimento pelo WhatsApp, ao finalizar o pedido.",
          "O pedido só é confirmado e separado para envio após a aprovação do pagamento.",
        ],
      },
      {
        title: "Trocas, devoluções e reembolso",
        blocks: [
          "Como todas as nossas peças são novas, você conta com as garantias abaixo:",
          {
            list: [
              "Arrependimento: você pode desistir da compra em até 7 dias corridos após o recebimento, sem precisar justificar. Devolvemos o valor integral, incluindo o frete.",
              "Troca de tamanho ou cor: em até 30 dias corridos após o recebimento. A primeira troca é grátis e depende da disponibilidade em estoque.",
              "Defeito de fabricação: avise a gente em até 7 dias após o recebimento. Você escolhe entre a troca por uma peça igual ou o reembolso integral. Esse prazo não afeta a garantia legal prevista no Código de Defesa do Consumidor.",
            ],
          },
          "Para trocas e devoluções por arrependimento, a peça deve voltar sem sinais de uso, sem lavagem, com as etiquetas e na embalagem original.",
          "Como solicitar: fale com a gente pelo {whatsapp} informando o número do pedido. Em caso de defeito, envie fotos do problema. Nós passamos as instruções e o código de postagem.",
          "Reembolso: é feito pela mesma forma de pagamento da compra, em até 7 dias úteis após recebermos e conferirmos a peça. No cartão de crédito, o estorno pode aparecer em até duas faturas, conforme a operadora.",
        ],
      },
      {
        title: "Aceite dos termos",
        blocks: [
          "Para finalizar a compra, você precisa marcar na sacola que leu e aceita estes Termos de Uso. A confirmação do aceite, com data e hora, vai junto da mensagem do pedido enviada pelo WhatsApp e fica registrada no atendimento.",
        ],
      },
      {
        title: "Privacidade",
        blocks: ["O uso dos seus dados está descrito na nossa {privacidade}."],
      },
      {
        title: "Contato",
        blocks: ["Dúvidas? Fale com a gente pelo {whatsapp} ou pelo Instagram {instagram}."],
      },
    ],
  },
  {
    slug: "privacidade",
    label: "Política de privacidade",
    title: "Política de Privacidade",
    updated: "novembro de 2026",
    intro:
      "Esta Política descreve como a Jaguar Niche coleta, usa, compartilha e protege seus dados pessoais, de acordo com a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).",
    sections: [
      {
        title: "Dados que coletamos",
        blocks: [
          {
            list: [
              "Atendimento e pedido: nome, telefone, CPF e endereço de entrega, informados por você no WhatsApp ao finalizar a compra. Eles são necessários para processar o pedido, emitir a nota fiscal e gerar o envio.",
              "Itens do pedido: produtos, cores, tamanhos, quantidades e valores, além da data e hora do aceite dos Termos de Uso.",
              "Lista Jaguar: o e-mail, caso você se cadastre para receber novidades.",
              "Navegação: o site não tem cadastro nem login e não usa cookies. A sacola fica salva apenas no seu navegador, durante a visita. O provedor que hospeda o site pode registrar dados técnicos de acesso, como o endereço IP, por motivos de segurança.",
            ],
          },
        ],
      },
      {
        title: "Como usamos seus dados",
        blocks: [
          "Usamos seus dados exclusivamente para processar compras, entregar pedidos, oferecer suporte, realizar trocas e devoluções, prevenir fraudes e cumprir obrigações legais. O e-mail da Lista Jaguar é usado só para enviar novidades da marca, e você pode pedir para sair a qualquer momento.",
          "Não vendemos seus dados e não os compartilhamos para fins de marketing de terceiros.",
        ],
      },
      {
        title: "Pagamento",
        blocks: [
          "Os pagamentos por Pix e cartão de crédito são processados por instituições de pagamento autorizadas. Não armazenamos dados completos de cartão. Essas informações vão direto entre você e a instituição de pagamento, de forma criptografada, e nós recebemos apenas a confirmação do pagamento.",
          "A Jaguar Niche nunca pede número completo do cartão, código de segurança ou senha pelo WhatsApp ou pelo Instagram.",
        ],
      },
      {
        title: "Envio",
        blocks: [
          "Todos os pedidos são enviados pelos Correios. Para gerar a etiqueta e rastrear a entrega, compartilhamos com os Correios apenas nome, CPF, telefone e endereço.",
        ],
      },
      {
        title: "Atendimento pelo WhatsApp e Instagram",
        blocks: [
          "Nosso atendimento e a finalização dos pedidos acontecem pelo WhatsApp e pelo Instagram, serviços da Meta. As mensagens trocadas nesses aplicativos também seguem as políticas de privacidade deles.",
        ],
      },
      {
        title: "Seus direitos (LGPD)",
        blocks: [
          "Você pode, a qualquer momento:",
          {
            list: [
              "Confirmar se tratamos dados seus;",
              "Acessar, corrigir ou atualizar seus dados;",
              "Solicitar a exclusão dos seus dados pessoais;",
              "Revogar o consentimento, como o cadastro na Lista Jaguar;",
              "Solicitar a portabilidade dos seus dados para outro fornecedor.",
            ],
          },
          "Para exercer qualquer direito, fale com a gente pelo {whatsapp} ou pelo Instagram {instagram}.",
        ],
      },
      {
        title: "Retenção",
        blocks: [
          "Mantemos seus dados pelo tempo necessário para cumprir as finalidades acima e as obrigações legais, como notas fiscais, prazos de troca e garantia e prevenção a fraudes.",
        ],
      },
      {
        title: "Segurança",
        blocks: [
          "Adotamos medidas para proteger seus dados: o site funciona com conexão criptografada (HTTPS), não guarda dados pessoais em banco de dados próprio, e os dados dos pedidos ficam com acesso restrito à nossa equipe.",
        ],
      },
      {
        title: "Cookies",
        blocks: ["O site não usa cookies, nem para login nem para publicidade. Se isso mudar, atualizaremos esta Política."],
      },
      {
        title: "Contato",
        blocks: ["Dúvidas? Fale com a gente pelo {whatsapp} ou pelo Instagram {instagram}."],
      },
    ],
  },
];

export const getPage = (slug: string) => PAGES.find((p) => p.slug === slug);
export const pageHref = (slug: string) => `/institucional/${slug}`;
