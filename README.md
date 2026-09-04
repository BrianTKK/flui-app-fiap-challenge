# Flui ⚡

Aplicativo de busca de eletropostos (estações de recarga para veículos elétricos) em São Paulo.
Projeto acadêmico desenvolvido com **Expo / React Native** para o FIAP Challenge.

> Protótipo de front-end: todos os dados vêm de `constants/mockData.ts`. Não há back-end,
> autenticação nem persistência — filtros e favoritos vivem apenas na memória da sessão.

## Funcionalidades

- **Mapa** com marcadores que mostram a fração de conectores livres (`livres/total`) e cor por disponibilidade.
- **Busca** por nome ou endereço + **filtros** por conector, potência mínima, disponibilidade e comodidades.
- **Prévia da estação** em bottom sheet, com preço, conectores e atalho para a rota (Waze → Google Maps → web).
- **Ficha completa** da estação: comodidades, gráfico de horário de pico e avaliações.
- **Formulário de avaliação** com nota geral e notas por critério.
- **Atividade**: histórico de recargas e eletropostos salvos.
- **Perfil**: dados do usuário, veículo e estatísticas de uso.

## Tecnologias

| Camada | Ferramenta |
| --- | --- |
| Framework | Expo SDK 54 + React Native 0.81 (New Architecture) |
| Navegação | `expo-router` (file-based routing) |
| Mapa nativo | `react-native-maps` (Google Maps) |
| Mapa web | Leaflet + tiles CartoDB dark, dentro de um `iframe` |
| Bottom sheet | `@gorhom/bottom-sheet` + `react-native-reanimated` |
| Tipagem | TypeScript em modo `strict` |

## Como rodar

```bash
npm install
npm start
```

Depois escolha a plataforma no terminal do Expo (`a` Android, `i` iOS, `w` web),
ou use os atalhos: `npm run android`, `npm run ios`, `npm run web`.

### Chave do Google Maps (somente Android)

O mapa nativo no Android exige uma chave da *Google Maps SDK for Android*:

```bash
cp .env.example .env   # e preencha GOOGLE_MAPS_API_KEY
```

A chave é injetada em `app.config.js` e **não** é versionada. Sem ela o mapa aparece
em branco no Android; iOS (Apple Maps) e web (Leaflet) funcionam normalmente.

### Verificações

```bash
npm run lint
npm run typecheck
```

## Estrutura

```
app/                     Rotas (expo-router)
  (tabs)/                Mapa, Atividade e Perfil com TabBar customizada
  station/[id].tsx       Ficha completa do eletroposto
  review/[id].tsx        Formulário de avaliação
  filters.tsx            Modal de filtros
components/              MapScreen (nativo e .web), marcador, prévia da estação
constants/               Design tokens, dados mockados, estilo do mapa, medidas
context/AppProvider.tsx  Estado compartilhado: filtros aplicados e favoritos
lib/                     Regras puras: disponibilidade, filtros, rotas e alertas
```

### Decisões de arquitetura

- **Disponibilidade é sempre derivada** de `totalConnections - occupiedConnections`
  (`lib/stations.ts`). Nenhuma tela guarda um booleano paralelo, o que evita o marcador
  dizer "0/2 livres" enquanto a ficha diz "Disponível".
- **`MapScreen.web.tsx`** substitui `react-native-maps` (que não roda no navegador) por um
  mapa Leaflet em `iframe`, com comunicação via `postMessage`. O React Native escolhe o
  arquivo `.web.tsx` automaticamente no bundle web.
- **`lib/`** concentra regras sem UI para não duplicar lógica entre as versões nativa e web.
