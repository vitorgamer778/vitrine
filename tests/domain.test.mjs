import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cartTotal,
  countItems,
  createOrder,
  emptyData,
  money,
  nextStatus,
  parseData,
  updateQuantity,
} from "../src/domain.ts";
test("integer cents and quantities give correct totals", () => {
  assert.equal(cartTotal({ caneca: 2, vaso: 1 }), 25500);
  assert.equal(countItems({ caneca: 2, vaso: 1 }), 3);
  assert.match(money(6800), /68,00/);
});
test("quantity boundaries and sold-out products", () => {
  assert.deepEqual(updateQuantity({ caneca: 1 }, "caneca", 0), {});
  for (const quantity of [-1, 21, 1.5])
    assert.throws(() => updateQuantity({}, "caneca", quantity));
  assert.throws(() => updateQuantity({}, "vaso-mini", 1));
  assert.throws(() => updateQuantity({}, "unknown", 1));
});
test("checkout validates required fields and cart", () => {
  assert.throws(() => createOrder({}, "Ana", "", "1", "2026-10-04"));
  assert.throws(() => createOrder({ caneca: 1 }, "", "", "1", "2026-10-04"));
  assert.throws(() =>
    createOrder({ caneca: 1 }, "Ana", "x".repeat(301), "1", "2026-10-04"),
  );
  assert.throws(() =>
    createOrder({ caneca: 21 }, "Ana", "", "1", "2026-10-04"),
  );
});
test("order keeps price snapshot and does not mutate cart", () => {
  const cart = { caneca: 2 };
  const order = createOrder(
    cart,
    " Ana ",
    " Presente ",
    "VT-1",
    "2026-10-04T12:00:00Z",
  );
  assert.equal(order.total, 13600);
  assert.equal(order.customer, "Ana");
  assert.equal(order.note, "Presente");
  assert.equal(order.items[0].price, 6800);
  assert.equal(cart.caneca, 2);
  assert.equal(nextStatus("Recebido"), "Em preparo");
  assert.equal(nextStatus("Em preparo"), "Pronto para retirada");
});
test("storage schema validates corrupted and unsupported data", () => {
  assert.deepEqual(parseData(null), emptyData());
  assert.throws(() => parseData("{"));
  assert.throws(() =>
    parseData(JSON.stringify({ version: 2, cart: {}, orders: [] })),
  );
  assert.throws(() =>
    parseData(JSON.stringify({ version: 1, cart: { unknown: 1 }, orders: [] })),
  );
  const order = createOrder(
    { caneca: 1 },
    "Ana",
    "",
    "VT-1",
    "2026-10-04T12:00:00Z",
  );
  const data = { version: 1, cart: {}, orders: [order] };
  assert.deepEqual(parseData(JSON.stringify(data)), data);
  order.total = 1;
  assert.throws(() => parseData(JSON.stringify(data)));
});
