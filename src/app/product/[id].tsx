import { Image, Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { products, money } from "../../domain";
import { useStore } from "../../store";
import { Button, Icon, images, Screen, styles } from "../../ui";
export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { quantity, busy, ready, data } = useStore();
  if (!product)
    return (
      <Screen title="Peça não encontrada">
        <Button
          label="Voltar ao catálogo"
          onPress={() => router.replace("/")}
        />
      </Screen>
    );
  return (
    <Screen title={product.name} subtitle={product.category}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar ao catálogo"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace("/")
        }
        style={[styles.row, { alignSelf: "flex-start", minHeight: 44 }]}
      >
        <Icon name="arrow-left" />
        <Text style={styles.body}>Catálogo</Text>
      </Pressable>
      <Image
        source={images[product.image]}
        style={{ height: 310, width: "100%", borderRadius: 22 }}
        accessibilityLabel={product.name}
      />
      <View style={styles.row}>
        <Text style={styles.heading}>{money(product.price)}</Text>
        <Text style={styles.body}>
          {product.available ? "Disponível" : "Esgotado"}
        </Text>
      </View>
      <Text style={styles.body}>{product.description}</Text>
      <Text style={styles.note}>
        Retirada na loja fictícia, sem taxa. Este app não processa pagamentos
        nem envia pedidos reais.
      </Text>
      <Button
        label="Adicionar ao carrinho"
        disabled={
          !product.available ||
          !ready ||
          busy ||
          (data.cart[product.id] ?? 0) >= 20
        }
        onPress={() => void quantity(product.id, 1)}
      />
      <Text accessibilityLiveRegion="polite" style={styles.body}>
        {data.cart[product.id]
          ? `${data.cart[product.id]} unidade(s) no carrinho`
          : "Escolha sua peça e monte seu pedido."}
      </Text>
      <Button
        label="Ver carrinho"
        secondary
        onPress={() => router.push("/cart")}
      />
    </Screen>
  );
}
