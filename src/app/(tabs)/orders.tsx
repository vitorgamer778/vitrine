import { Text, View } from "react-native";
import { router } from "expo-router";
import { money, type OrderStatus } from "../../domain";
import { useStore } from "../../store";
import { Button, colors, Icon, Screen, styles } from "../../ui";
const stages: OrderStatus[] = [
  "Recebido",
  "Em preparo",
  "Pronto para retirada",
];
export default function OrdersScreen() {
  const { data, advance, busy } = useStore();
  return (
    <Screen
      title="Seus pedidos"
      subtitle="Do primeiro toque à próxima retirada."
    >
      <Text style={styles.note}>
        Acompanhamento simulado. Você controla o status para explorar a
        experiência da loja.
      </Text>
      {!data.orders.length ? (
        <View style={styles.empty}>
          <Icon name="package" size={44} />
          <Text style={styles.heading}>Ainda sem pedidos</Text>
          <Text style={styles.body}>
            Monte um carrinho para experimentar o fluxo completo.
          </Text>
          <Button
            label="Explorar catálogo"
            onPress={() => router.replace("/")}
          />
        </View>
      ) : (
        data.orders.map((order) => (
          <View
            key={order.id}
            style={{
              backgroundColor: colors.white,
              padding: 20,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 16,
            }}
          >
            <View style={styles.row}>
              <Text style={styles.label}>{order.id}</Text>
              <Text style={styles.body}>
                {new Date(order.createdAt).toLocaleDateString("pt-BR")}
              </Text>
            </View>
            <Text style={styles.heading}>{order.status}</Text>
            <View
              style={{ flexDirection: "row", gap: 6 }}
              accessibilityLabel={`Status: ${order.status}`}
            >
              {stages.map((stage, index) => (
                <View
                  key={stage}
                  style={{
                    flex: 1,
                    height: 5,
                    borderRadius: 4,
                    backgroundColor:
                      stages.indexOf(order.status) >= index
                        ? colors.plum
                        : colors.border,
                  }}
                />
              ))}
            </View>
            <Text style={styles.body}>Retirada por {order.customer}</Text>
            {order.items.map((item) => (
              <View key={item.productId} style={styles.row}>
                <Text style={[styles.body, { flex: 1 }]}>
                  {item.quantity} × {item.name}
                </Text>
                <Text style={styles.body}>
                  {money(item.quantity * item.price)}
                </Text>
              </View>
            ))}
            {order.note ? (
              <Text style={styles.body}>Observação: {order.note}</Text>
            ) : null}
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Total demonstrativo</Text>
              <Text style={styles.heading}>{money(order.total)}</Text>
            </View>
            {order.status !== "Pronto para retirada" ? (
              <Button
                label={
                  order.status === "Recebido"
                    ? "Simular preparo"
                    : "Simular pedido pronto"
                }
                secondary
                disabled={busy}
                onPress={() => void advance(order.id)}
              />
            ) : (
              <Text style={styles.note}>
                Tudo pronto! Esta é uma simulação, não uma confirmação real de
                retirada.
              </Text>
            )}
          </View>
        ))
      )}
    </Screen>
  );
}
