import { useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { cartTotal, countItems, money, products } from "../../domain";
import { useStore } from "../../store";
import { Button, colors, Icon, images, Screen, styles } from "../../ui";
export default function CartScreen() {
  const { data, quantity, checkout, busy, ready, error } = useStore();
  const nameInput = useRef<TextInput>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const items = products.filter((p) => data.cart[p.id]);
  async function submit() {
    if (await checkout(name, note)) {
      setName("");
      setNote("");
      router.replace("/orders");
    } else if (name.trim().length < 2) nameInput.current?.focus();
  }
  return (
    <Screen
      title="Seu carrinho"
      subtitle="Escolhido por você, preparado com cuidado."
      showError={false}
    >
      {!items.length ? (
        <View style={styles.empty}>
          <Icon name="shopping-bag" size={44} />
          <Text style={styles.heading}>Sua próxima descoberta está aqui</Text>
          <Text style={styles.body}>
            Explore o catálogo e adicione suas peças favoritas.
          </Text>
          <Button
            label="Explorar catálogo"
            onPress={() => router.replace("/")}
          />
        </View>
      ) : (
        <>
          {items.map((p) => (
            <View key={p.id} style={{ gap: 12 }}>
              <View style={[styles.row, { justifyContent: "flex-start" }]}>
                <Image
                  source={images[p.image]}
                  style={{ width: 78, height: 86, borderRadius: 14 }}
                  accessibilityLabel={p.name}
                />
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={[styles.label, { marginBottom: 0 }]}>
                    {p.name}
                  </Text>
                  <Text style={styles.body}>{money(p.price)}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  {[-1, 1]
                    .map((delta) => (
                      <Pressable
                        key={delta}
                        accessibilityRole="button"
                        accessibilityLabel={`${delta < 0 ? "Diminuir" : "Aumentar"} quantidade de ${p.name}`}
                        disabled={busy || (delta > 0 && data.cart[p.id] >= 20)}
                        onPress={() => void quantity(p.id, delta)}
                        style={{
                          backgroundColor: colors.lavender,
                          height: 44,
                          width: 44,
                          borderRadius: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon name={delta < 0 ? "minus" : "plus"} />
                      </Pressable>
                    ))
                    .reduce<React.ReactNode[]>(
                      (result, button, i) =>
                        i === 0
                          ? [
                              button,
                              <Text
                                key="quantity"
                                accessibilityLabel={`Quantidade de ${p.name}: ${data.cart[p.id]}`}
                                style={styles.label}
                              >
                                {data.cart[p.id]}
                              </Text>,
                            ]
                          : [...result, button],
                      [],
                    )}
                </View>
                <Text style={styles.label}>
                  {money(p.price * data.cart[p.id])}
                </Text>
              </View>
              <View style={styles.divider} />
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.body}>
              Subtotal · {countItems(data.cart)} itens
            </Text>
            <Text style={styles.heading}>{money(cartTotal(data.cart))}</Text>
          </View>
          <Text style={styles.note}>
            Retirada na loja · sem taxa. Pedido demonstrativo: sem pagamento e
            sem envio à loja.
          </Text>
          <View>
            <Text style={styles.label}>Nome para retirada *</Text>
            <TextInput
              ref={nameInput}
              accessibilityLabel="Nome para retirada"
              value={name}
              onChangeText={setName}
              placeholder="Use um nome fictício"
              placeholderTextColor={colors.muted}
              maxLength={80}
              style={styles.input}
            />
            <Text style={styles.subtitle}>
              Obrigatório: de 2 a 80 caracteres.
            </Text>
          </View>
          <View>
            <Text style={styles.label}>Observação (opcional)</Text>
            <TextInput
              accessibilityLabel="Observação"
              value={note}
              onChangeText={setNote}
              placeholder="Ex.: embrulhar para presente"
              placeholderTextColor={colors.muted}
              maxLength={300}
              multiline
              style={[
                styles.input,
                { minHeight: 94, textAlignVertical: "top" },
              ]}
            />
            <Text style={styles.subtitle}>{note.length}/300 caracteres</Text>
          </View>
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          <Button
            label={busy ? "Salvando pedido…" : "Criar pedido demonstrativo"}
            disabled={busy || !ready}
            onPress={() => void submit()}
          />
          <Text style={styles.body}>
            Seus dados ficam apenas neste aparelho, sem criptografia. Não use
            informações pessoais reais.
          </Text>
        </>
      )}
    </Screen>
  );
}
