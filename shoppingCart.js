const carts = [
  { name: "Apple", category: "fruit", price: 30, quantity: 12 },
  { name: "Banana", category: "fruit", price: 10, quantity: 21 },
  { name: "Onion", category: "vegetable", price: 100, quantity: 12 },
  { name: "Cabbage", category: "vegetable", price: 50, quantity: 6 },
  { name: "Notebook", category: "stationery", price: 40, quantity: 21 },
  { name: "pen", category: "stationery", price: 10, quantity: 21 }
];

const itemDiscounts = {
  Apple: 10,
  Onion: 20
};

const categoryDiscounts = {
  fruit: 5,
  vegetable: 15,
  stationery: 0
};

const taxRates = {
  fruit: 5,
  vegetable: 12,
  stationery: 2
};

const itemsWithOffer = ["Apple", "Banana"];

const promoCode = { SAVE10: 10 }; 

const getDiscountPercent = (item) =>
  itemDiscounts[item.name] || categoryDiscounts[item.category] || 0;

const getTaxPercent = (item) => taxRates[item.category] || 0;

const getPayableQuantity = (item) =>
  itemsWithOffer.includes(item.name)
    ? item.quantity - Math.floor(item.quantity / 3)
    : item.quantity;

  
const applyPercentageDiscount = (amount) =>
  amount - (amount * 2) / 100 ;

const applyFixedAmount = (amount) =>
  amount - 5;

const applyItemCostBasedDiscount = (amount) =>
  amount > 200
    ? applyPercentageDiscount(amount)
    : amount >= 100
    ? applyFixedAmount(amount)
    : amount;

const applyPromoCode = (total, code) =>
  promoCode[code] && total > 2000
    ? total - (total * promoCode[code]) / 100
    : total;

const calculateItemTotal = (item) => {
  const payableQty = getPayableQuantity(item);
  const subtotal = item.price * payableQty;

  const discountPercent = getDiscountPercent(item);
  const discountAmount = (subtotal * discountPercent) / 100;
  const afterDiscount = subtotal - discountAmount;

  const costAfterExtraDiscount = applyItemCostBasedDiscount(afterDiscount);
  const taxPercent = getTaxPercent(item);
  const taxAmount = (costAfterExtraDiscount * taxPercent) / 100;

  const finalTotal = costAfterExtraDiscount + taxAmount;

  return {
    Name: item.name,
    Category: item.category,
    Quantity: item.quantity,
    PayableQty: payableQty,
    UnitPrice: item.price,
    Subtotal: subtotal,
    DiscountPercent: discountPercent,
    CostAfterDiscount: afterDiscount,
    ExtraDiscounted: costAfterExtraDiscount,
    TaxPercent: taxPercent,
    FinalTotal:Math.round(finalTotal),
  };
};

const main = (code = "") => {
  const result = carts.map(calculateItemTotal);

  const grandTotal = result.reduce((sum, item) => sum + item.FinalTotal, 0);
  const totalAfterPromo = applyPromoCode(grandTotal, code);

  console.table(result);

  console.log(" Grand Total: " + grandTotal);

  console.log(" Final Payable Amount:" + totalAfterPromo);
};

main("SAVE10");
