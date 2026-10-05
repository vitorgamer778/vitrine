import { useState } from "react";
import { Text, View } from "react-native";
import { useStore } from "../../store";
import { Button, Icon, Screen, styles } from "../../ui";
export default function ShopScreen() {
  const { reset, busy } = useStore();
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen title="Casa Lume" subtitle="Objetos para acompanhar seus dias.">
      <Icon name="sun" size={48} />
      <Text style={styles.heading}>
        Uma pequena loja, feita de boas escolhas.
      </Text>
      <Text style={styles.body}>
        Uma experiência fictícia de cerâmica, decoração e presentes. O Vitrine
        mostra como um pequeno negócio pode ter um catálogo no celular e
        organizar pedidos sem complicação.
      </Text>
      <View style={{ gap: 14 }}>
        <Text style={styles.label}>Como experimentar</Text>
        <Text style={styles.body}>
          Busque uma peça, abra os detalhes, adicione ao carrinho e crie um
          pedido com um nome fictício. Na aba Pedidos, simule as etapas de
          preparo.
        </Text>
      </View>
      <Text style={styles.note}>
        Projeto de portfólio por VH Code Solutions. Não há loja real, pagamento,
        entrega, sincronização ou conexão com WhatsApp. Os pedidos são salvos
        somente neste aparelho.
      </Text>
      <Text style={styles.body}>
        As fotos são ilustrativas, de fotógrafos do Unsplash; não representam
        produtos reais à venda. Os créditos estão na documentação do projeto.
      </Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>Seus dados locais</Text>
      <Text style={styles.body}>
        Carrinho e pedidos ficam no armazenamento do app, sem criptografia.
        Limpar a demonstração remove apenas esses dados do Vitrine.
      </Text>
      {!confirm ? (
        <Button
          label="Limpar demonstração"
          secondary
          onPress={() => setConfirm(true)}
        />
      ) : (
        <View style={{ gap: 12 }}>
          <Text accessibilityRole="alert" style={styles.body}>
            Excluir o carrinho e todos os pedidos locais? Esta ação não pode ser
            desfeita.
          </Text>
          <Button
            label="Confirmar limpeza"
            disabled={busy}
            onPress={async () => {
              await reset();
              setConfirm(false);
            }}
          />
          <Button
            label="Cancelar"
            secondary
            onPress={() => setConfirm(false)}
          />
        </View>
      )}
    </Screen>
  );
}
