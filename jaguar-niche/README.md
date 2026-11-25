# Jaguar Niche — Landing page de Quarter Zips

Landing page premium em preto e branco da Jaguar Niche, marca de quarter zips. O elemento central é um quarter zip 3D modelado inteiramente em código, sem arquivos de modelo.

**Stack:** Next.js 16 · Tailwind CSS v4 · React Three Fiber + drei · GSAP ScrollTrigger · Framer Motion · Lenis

```bash
npm install
npm run dev          # http://localhost:3000
npm run build:pages  # gera a versão estática em ../jaguar-niche-site (GitHub Pages)
```

## Destaques

- **Quarter zip 3D** (`components/three/Garment.tsx`): corpo em superelipse com dobras e barra canelada, mangas com punhos, gola alta, zíper metálico com dentes, cursor e puxador que balança. O zíper abre com a rolagem.
- **Tecidos procedurais** (`components/three/fabric.ts`): mapas de relevo gerados em código para tricô merino, fleece, ripstop e moletom. As mesmas texturas viram as amostras macro da seção Materiais.
- **Iluminação dinâmica**: luz principal que orbita, contraluzes que se intensificam no palco escuro e uma luz que segue o cursor. Reflexos vêm de um estúdio de Lightformers, sem baixar nada.
- **Vapor e partículas**: vapor subindo da gola, névoa no chão e flocos/fibras que mudam de tom conforme o fundo.
- **Narrativa com rolagem**:
  - Abertura com JAGUAR NICHE vazado atrás da peça.
  - Anatomia: o fundo vira preto, a peça vira branca, gira e faz um close na gola enquanto o zíper abre.
  - Modelos: a rolagem troca o tecido (merino, fleece, tech shell, moletom).
  - Cores: o palco inverte para contrastar com a cor escolhida.
- **E-commerce**: vitrine com seleção de cor e tamanho por card, kit, sacola com barra de frete grátis e pedido finalizado pelo WhatsApp.
- **Tabela de medidas**: modal com medidas por tamanho, diagrama de como medir e recomendação de tamanho pelo tórax.
- **Contato**: WhatsApp (19) 98286-5594 no menu, no rodapé, num botão flutuante e na tabela de medidas. O número fica em `lib/contact.ts`.
- **Desempenho**: o WebGL para de renderizar quando a peça sai da tela; aparelhos menores usam menos partículas e resolução menor.
