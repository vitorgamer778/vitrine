# Vitrine — validação em 04/10/2026

## Escopo

Aplicativo de portfólio Android para catálogo e pedidos demonstrativos. Casa Lume, produtos e preços fictícios; fotografias ilustrativas reais locais. Nenhum pedido, pagamento ou dado foi enviado para um negócio real. Não foi publicado em GitHub, Vercel ou Play Store nesta tarefa.

## Testes confirmados

- Lint e TypeScript: passaram.
- Regras de negócio: 5 testes passaram (centavos, quantidades, indisponibilidade, validação, snapshot do pedido e armazenamento corrompido).
- Expo Doctor: 21 verificações passaram.
- Exportações web e Android/Hermes: passaram.
- Navegador: fluxo completo em 320, 390 e 900 px; busca, filtros, indisponibilidade, detalhes, quantidades, persistência, erro/foco do formulário, checkout, estados do pedido, limpeza e cancelamento. Sem overflow ou erros de console/requests no fluxo automatizado.
- Android API 36 via Expo Go SDK 57: catálogo, detalhes, carrinho, validação, checkout, estados e persistência após force-stop passaram. Evidência: `android-vitrine-qa/result.json`.
- Lighthouse da prévia web comprimida: performance 79, acessibilidade 100, boas práticas 96. Uma execução local, com compilação concorrente: não representa avaliação de performance nativa ou certificado de conformidade WCAG.

## APK instalado

APK independente compilado com sucesso (`assembleRelease`), instalado e testado no emulador Pixel 7 / Android API 36, ABI x86_64, com Wi-Fi e dados móveis desligados e Metro encerrado. Catálogo, detalhes, carrinho, quantidade, erro obrigatório do formulário, criação de pedido, estados e persistência após force-stop passaram: `android-vitrine-apk-qa/result.json` (29 dumps de UI). Não apareceram erros JS/crashes nos logs do processo relançado. As coordenadas de toque vieram dos bounds da árvore de UI, não de capturas.

O APK `vitrine-demo.apk` tem 61.520.810 bytes, suporta ARM64 e x86_64, Android mínimo API 24, target API 36. A execução ARM64 e Android API 24 não foi validada em aparelho físico.

SHA-256: `DE66D9F4D62D0C80007DD6746BF9CC4E3C87FCD911B0242F0A44C8599B00BDE2`.

## Amostra de performance nativa

Uma execução release no emulador, renderização GPU por software, fluxo delimitado catálogo → detalhes → adicionar → carrinho, após reset de gfxinfo: 121 frames, 42 janky (34,71%), p50 38 ms / p90 57 ms / p95 81 ms / p99 150 ms. Snapshot estável do carrinho: PSS 129.416 KB, RSS 232.432 KB. Evidências: `android-vitrine-apk-qa/gfxinfo-product-to-cart.txt`, `gfxinfo-framestats-product-to-cart.txt` e `meminfo-cart.txt`.

Essa amostra mostra frames lentos no ambiente de teste; não comprova performance aceitável, causa de jank nem vazamento de memória. Próxima validação proporcional: repetir o mesmo fluxo em celular físico ARM64; se os atrasos persistirem, capturar Perfetto nesse fluxo antes de propor mudanças. Não foi feito profiling de CPU ou análise de heap.

## Correções

- Versões nativas alinhadas ao Expo SDK 57; Reanimated 4.5.1 e Worklets 0.10.1.
- Tratamento de erro, foco do campo obrigatório e persistência antes de atualizar a interface.
- Hero, responsividade e compressão/cache da prévia estática.
- Compilação local em cópia de caminho curto, sem editar o registro do Windows nem sobrescrever o projeto original.

## Limites e pendências de uma versão comercial

Pedidos e estados são simulados e ficam em AsyncStorage não criptografado. Não usar dados pessoais reais. Backend, autenticação/autorização, estoque, pagamentos, envio real de pedidos e política específica não foram implementados. Alertas transitivos de dependências exigem revisão upstream antes de distribuição comercial; não foram forçadas atualizações incompatíveis. Assinatura release padrão gerada é chave de debug, adequada apenas ao APK de demonstração. TalkBack manual e celulares físicos não foram testados.
