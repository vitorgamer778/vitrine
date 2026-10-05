# Vitrine

Aplicativo Android de catálogo e pedidos para pequenos negócios, criado como projeto de portfólio de VH Code Solutions. React Native, Expo SDK 57, Expo Router e TypeScript. A loja Casa Lume é fictícia.

[Baixar APK de demonstração (62 MB)](https://github.com/vitorgamer778/vitrine/releases/download/v1.0.0/vitrine-demo.apk) · [Portfólio](https://programador-alpha.vercel.app/#vitrine) · [Validação e limites](docs/validation.md)

## Captura real no Android

<img src="docs/screenshots/catalog.png" alt="Vitrine instalado no Android: catálogo demonstrativo da Casa Lume" width="300" />

Captura do APK instalado no emulador Android API 36, feita em 04/10/2026. Não é mockup nem imagem gerada. O APK funciona sem Expo Go ou servidor de desenvolvimento; usa assinatura de debug, apenas para demonstração.

## Experiência implementada

- Catálogo com fotos locais, busca, filtros por categoria e produtos esgotados.
- Detalhes do produto, carrinho, alteração de quantidade e cálculo em centavos.
- Pedido demonstrativo com validação, observação e nome para retirada.
- Acompanhamento simulado: recebido, em preparo e pronto para retirada.
- Carrinho e pedidos persistidos localmente com schema versionado e validação.
- Limpeza dos dados com confirmação; mensagens de erro e estados vazios.
- Navegação inferior, rótulos acessíveis, alvos de toque de 44 px e safe areas.

Não há autenticação, cobrança, envio de pedidos, estoque real, WhatsApp ou sincronização. Não inserir informações pessoais reais: AsyncStorage não é criptografado. Os pedidos são demonstrativos e ficam neste aparelho; a limpeza do armazenamento do app os remove. Uma versão comercial precisa de backend com autorização, validação no servidor, controle de estoque e política de privacidade específica.

## Executar

```sh
npm ci
npm start
```

Abrir no Expo Go compatível com SDK 57. No Android Emulator com adb:

```sh
adb reverse tcp:8082 tcp:8082
npx expo start --port 8082
adb shell am start -a android.intent.action.VIEW -d exp://127.0.0.1:8082 -p host.exp.exponent
```

Prévia web de desenvolvimento: `npm run web`. Prévia do bundle exportado: `npm run build:web && npm run preview`, em `http://127.0.0.1:8084`, com compressão, cache de assets versionados e fallback das rotas. O navegador é uma prévia adicional, não substitui a validação Android.

## Qualidade

```sh
npm run typecheck
npm run lint
npm test
npx expo-doctor
npm run build:web
npm run build:android-bundle
```

Testes unitários: totais em centavos, limites de quantidade, produtos indisponíveis, checkout, snapshot de preços e dados locais corrompidos.

Testes de interface nesta entrega: busca, categorias, detalhes, carrinho, erro de formulário e foco, checkout, status, persistência e limpeza no navegador em 320, 390 e 900 px. Android API 36 / Expo Go SDK 57: fluxo de pedido, aumento de quantidade, validação de nome, preparo, retirada e persistência após encerrar e reabrir o processo, com capturas da UI e inspeção de logcat. Isso não substitui testes de APK independente, aparelho físico, TalkBack ou uso real.

O bootstrap do Expo trouxe alertas transitivos de dependências. As correções compatíveis disponíveis foram aplicadas; não foi usado `npm audit fix --force`. Revisar os avisos de upstream antes de uma distribuição comercial. O servidor Metro é somente de desenvolvimento e não deve ser exposto publicamente.

## APK

O diretório `android/` é gerado por `npx expo prebuild --platform android`; não contém implementação nativa manual. A configuração mantida é `app.json`. Um APK de demonstração pode ser compilado localmente com JDK 21 e Android SDK:

```sh
npx expo prebuild --platform android --no-install
cd android
./gradlew :app:assembleRelease -PreactNativeArchitectures=x86_64,arm64-v8a --max-workers=2
```

O preset gerado usa chave de debug também na variante release. Qualquer APK assim gerado é apenas para demonstração, não para publicar na Play Store. Uma publicação exige configuração de assinatura própria, revisão das dependências, testes adicionais e autorização do titular.

No Windows, use uma cópia do projeto em um caminho curto (por exemplo `C:/vt`) para a compilação nativa. Caminhos longos podem ultrapassar o limite do Ninja ao gerar objetos C++; não é necessário alterar o registro do sistema nem editar os arquivos nativos gerados. Execute `npm ci` e o prebuild nessa cópia.

## Imagens

Fotografias ilustrativas do Unsplash, baixadas para assets locais, sem depender da rede durante a navegação:

- Caneca: https://images.unsplash.com/photo-1514228742587-6b1558fcca3d
- Vasos: https://images.unsplash.com/photo-1490312278390-ab64016e0aa9
- Cerâmica/bowls: https://images.unsplash.com/photo-1578749556568-bc2c40e68b61
- Planta: https://images.unsplash.com/photo-1485955900006-10f4d324d411

As fotos não representam mercadoria real disponível. Licença: https://unsplash.com/license. Dados, nomes da loja e preços são fictícios.

Documentação de referência: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/), [Expo Router](https://docs.expo.dev/router/installation/), [AsyncStorage](https://docs.expo.dev/versions/v57.0.0/sdk/async-storage/).
