import {
  getAllOrderItems,
  getOrderItemById,
  getOrderItemsByOrderId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  OrderItem
} from "./models/mysql/orderItem.model"; // OBS! .model måste vara med

const testOrderItems = async () => {
  try {
    console.log("===== TEST AV ORDERITEM MODELL =====");

    // 1. Skapa ett nytt order item
    const newItemData = {
      order__id: 1,
      product__id: 1,
      quantity: 2,
      price_at_order: 100
    };

    const newId = await createOrderItem(newItemData);
    console.log("✅ Order item skapad med ID:", newId);

    // 2. Hämta order item med ID
    const orderItem = await getOrderItemById(newId);
    console.log("📦 Order item by ID:", orderItem);

    // 3. Hämta alla order items för order 1
    const allItems = await getOrderItemsByOrderId(1);
    console.log("📋 Alla order items för order 1:", allItems);

    // 4. Uppdatera order item
    const updateData = { quantity: 5 };
    const updated = await updateOrderItem(newId, updateData);
    console.log("✏️ Order item uppdaterad?", updated);

    // 5. Hämta uppdaterat item för kontroll
    const updatedItem = await getOrderItemById(newId);
    console.log("🔄 Uppdaterat order item:", updatedItem);

    // 6. Ta bort order item
    const deleted = await deleteOrderItem(newId);
    console.log("🗑️ Order item borttagen?", deleted);

    // 7. Kontrollera att item inte längre finns
    const checkDeleted = await getOrderItemById(newId);
    console.log("🔍 Kontroll efter borttagning (ska vara null/undefined):", checkDeleted);

    console.log("===== SLUT PÅ TEST =====");
  } catch (err) {
    console.error("❌ Fel vid test av OrderItem:", err);
  }
};

testOrderItems();
