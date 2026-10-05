import { Tabs } from "expo-router";
import { colors, Icon } from "../../ui";
import { useStore } from "../../store";
import { countItems } from "../../domain";
export default function TabsLayout() {
  const { data } = useStore();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.plum,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarItemStyle: { minHeight: 52 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Catálogo",
          tabBarAccessibilityLabel: "Catálogo",
          tabBarIcon: ({ color }) => <Icon name="grid" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrinho",
          tabBarAccessibilityLabel: "Carrinho",
          tabBarBadge: countItems(data.cart) || undefined,
          tabBarBadgeStyle: { backgroundColor: colors.plum },
          tabBarIcon: ({ color }) => <Icon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarAccessibilityLabel: "Pedidos",
          tabBarIcon: ({ color }) => <Icon name="package" color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Loja",
          tabBarAccessibilityLabel: "Loja",
          tabBarIcon: ({ color }) => <Icon name="home" color={color} />,
        }}
      />
    </Tabs>
  );
}
