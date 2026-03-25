import { createOrder, getOrderById, getOrdersByUserId, updateOrder, deleteOrder } from "./models/mysql/order.model";

const testOrders = async () => {
  try {
    // 1. Skapa en ny order
    const newOrderId = await createOrder({ user_id: 1, total_price: 100 });
    console.log("Order skapad med id:", newOrderId);

    // 2. Hämta order med id
    const orderById = await getOrderById(newOrderId);
    console.log("Order by ID:", orderById);

    // 3. Hämta alla orders för användare 1
    const ordersByUser = await getOrdersByUserId(1);
    console.log("Orders for user 1:", ordersByUser);

    // 4. Uppdatera order
    const updated = await updateOrder(newOrderId, { total_price: 150 });
    console.log("Order uppdaterad?", updated);

    // 5. Hämta order igen för att se ändringen
    const updatedOrder = await getOrderById(newOrderId);
    console.log("Updated order:", updatedOrder);

    // 6. Ta bort order
    const deleted = await deleteOrder(newOrderId);
    console.log("Order borttagen?", deleted);

    // 7. Kontrollera att order är borta
    const checkDeleted = await getOrderById(newOrderId);
    console.log("Check deleted order (ska vara null):", checkDeleted);

  } catch (error) {
    console.error("Fel vid test av orders:", error);
  }
};

testOrders();
