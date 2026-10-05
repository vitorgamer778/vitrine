export type Category = "Todos" | "Cerâmica" | "Decoração" | "Presentes";
export type Product = {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: "cup" | "vase" | "bowl" | "plant";
  description: string;
  available: boolean;
};
export const products: Product[] = [
  {
    id: "caneca",
    name: "Caneca Aurora",
    category: "Cerâmica",
    price: 6800,
    image: "cup",
    description:
      "Uma pausa com mais cor. Caneca de cerâmica, acabamento acetinado e capacidade de 300 ml. Cada peça tem pequenas variações que a tornam única.",
    available: true,
  },
  {
    id: "vaso",
    name: "Vaso Horizonte",
    category: "Decoração",
    price: 11900,
    image: "vase",
    description:
      "Linhas simples para acolher suas flores. Vaso decorativo de cerâmica com 18 cm de altura. Uma peça para deixar a casa com a sua cara.",
    available: true,
  },
  {
    id: "bowl",
    name: "Bowl do dia",
    category: "Cerâmica",
    price: 5400,
    image: "bowl",
    description:
      "Do café da manhã ao jantar. Bowl de cerâmica de 500 ml, com formato confortável e acabamento artesanal.",
    available: true,
  },
  {
    id: "jardim",
    name: "Pequeno jardim",
    category: "Presentes",
    price: 8900,
    image: "plant",
    description:
      "Um presente que cresce junto. Cachepô com planta decorativa e cartão de cuidados. A espécie pode variar conforme a disponibilidade.",
    available: true,
  },
  {
    id: "dupla",
    name: "Dupla de canecas",
    category: "Presentes",
    price: 12400,
    image: "cup",
    description:
      "Duas canecas Aurora em uma embalagem para presente. Um convite para dividir um café e uma boa conversa.",
    available: true,
  },
  {
    id: "vaso-mini",
    name: "Vaso Mini",
    category: "Decoração",
    price: 4500,
    image: "vase",
    description:
      "Uma pequena peça para uma flor ou um cantinho especial. Vaso de 10 cm. Indisponível nesta demonstração.",
    available: false,
  },
];
export type Cart = Record<string, number>;
export type OrderStatus = "Recebido" | "Em preparo" | "Pronto para retirada";
export type Order = {
  id: string;
  createdAt: string;
  customer: string;
  note: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  total: number;
  status: OrderStatus;
};
export type StoreData = { version: 1; cart: Cart; orders: Order[] };
export const emptyData = (): StoreData => ({
  version: 1,
  cart: {},
  orders: [],
});
export const money = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    cents / 100,
  );
export const countItems = (cart: Cart) =>
  Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
export const cartTotal = (cart: Cart) =>
  products.reduce((total, p) => total + p.price * (cart[p.id] ?? 0), 0);
export function updateQuantity(cart: Cart, id: string, quantity: number): Cart {
  if (!products.some((p) => p.id === id && p.available))
    throw new Error("Este produto não está disponível.");
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 20)
    throw new Error("Escolha de 1 a 20 unidades por produto.");
  const next = { ...cart };
  if (quantity === 0) delete next[id];
  else next[id] = quantity;
  return next;
}
export function createOrder(
  cart: Cart,
  customer: string,
  note: string,
  id: string,
  createdAt: string,
): Order {
  if (customer.trim().length < 2 || customer.trim().length > 80)
    throw new Error("Informe um nome de 2 a 80 caracteres.");
  if (note.length > 300)
    throw new Error("A observação pode ter até 300 caracteres.");
  if (!countItems(cart))
    throw new Error("Adicione pelo menos um produto ao carrinho.");
  const items = Object.entries(cart).map(([productId, quantity]) => {
    const p = products.find(
      (product) => product.id === productId && product.available,
    );
    if (!p || !Number.isInteger(quantity) || quantity < 1 || quantity > 20)
      throw new Error("Revise os produtos do seu carrinho.");
    return { productId, quantity, name: p.name, price: p.price };
  });
  return {
    id,
    createdAt,
    customer: customer.trim(),
    note: note.trim(),
    items,
    total: cartTotal(cart),
    status: "Recebido",
  };
}
export function nextStatus(status: OrderStatus): OrderStatus {
  return status === "Recebido" ? "Em preparo" : "Pronto para retirada";
}
export function parseData(raw: string | null): StoreData {
  if (!raw) return emptyData();
  const data: unknown = JSON.parse(raw);
  if (
    !data ||
    typeof data !== "object" ||
    !("version" in data) ||
    data.version !== 1 ||
    !("cart" in data) ||
    !("orders" in data)
  )
    throw new Error("Dados locais incompatíveis.");
  const value = data as StoreData;
  if (
    !value.cart ||
    typeof value.cart !== "object" ||
    Array.isArray(value.cart) ||
    !Array.isArray(value.orders) ||
    value.orders.length > 100
  )
    throw new Error("Dados locais inválidos.");
  for (const [id, quantity] of Object.entries(value.cart))
    updateQuantity({}, id, quantity);
  for (const order of value.orders) {
    if (
      !order ||
      typeof order.id !== "string" ||
      typeof order.customer !== "string" ||
      order.customer.length > 80 ||
      typeof order.note !== "string" ||
      order.note.length > 300 ||
      typeof order.createdAt !== "string" ||
      !Number.isFinite(Date.parse(order.createdAt)) ||
      !["Recebido", "Em preparo", "Pronto para retirada"].includes(
        order.status,
      ) ||
      !Array.isArray(order.items) ||
      !order.items.length ||
      order.items.length > products.length
    )
      throw new Error("Pedido local inválido.");
    let total = 0;
    for (const item of order.items) {
      if (
        !item ||
        !products.some((p) => p.id === item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 20 ||
        !Number.isInteger(item.price) ||
        item.price < 0 ||
        typeof item.name !== "string" ||
        item.name.length > 100
      )
        throw new Error("Item local inválido.");
      total += item.price * item.quantity;
    }
    if (order.total !== total) throw new Error("Total local inválido.");
  }
  return value;
}
