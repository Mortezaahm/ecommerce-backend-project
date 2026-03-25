import { createOrderItem, getOrderItemById, deleteOrderItem } from './mysql/orderItem.model';

describe('OrderItem model functions', () => {
  let newId: number;

  it('should create, get and delete an order item', async () => {
    // Skapa nytt order item
    const newItemData = {
      order__id: 1,
      product__id: 1,
      quantity: 2,
      price_at_order: 100
    };
    newId = await createOrderItem(newItemData);
    expect(newId).toBeDefined();

    // Hämta item
    const fetched = await getOrderItemById(newId);
    expect(fetched).not.toBeNull();
    expect(fetched.quantity).toBe(2);

    // Ta bort item
    const deleted = await deleteOrderItem(newId);
    expect(deleted).toBeTruthy();

    // Kontrollera att det är borttaget
    const checkDeleted = await getOrderItemById(newId);
    expect(checkDeleted).toBeNull();
  });
});
