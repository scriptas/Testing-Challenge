import { chromium, expect, test } from "@playwright/test";
import { Cart } from "../challenge-1/cart";
import { Checkout } from "../challenge-1/checkout";
import { ItemPicker } from "../challenge-1/item-picker";
import { ItemSelector } from "../challenge-1/item-selector";

test("challenge-1", async() => {
    const homeUrl = "https://shop.polymer-project.org";
    const browser = await chromium.launch()
    const context = await browser.newContext();
    const page = await context.newPage();

    let itemPicker = new ItemPicker(homeUrl, page)
    const pickedItems = await itemPicker.pickRandomShopListItems(2, 2)

    let itemSelector = new ItemSelector(page)
    await itemSelector.selectItems(pickedItems)

    let cart = new Cart(homeUrl, page);
    const shopCartItems = await cart.getShopCartItems()

    itemSelector.selectedItems.forEach((selectedItem, index) => {
        const shopCartItem = shopCartItems[index];
        expect(selectedItem.name).toBe(shopCartItem.name);
        expect(selectedItem.quantity).toBe(shopCartItem.quantity);
        expect(selectedItem.size).toBe(shopCartItem.size);
    });
    expect(itemSelector.getTotalPrice()).toBe(await cart.getSubTotal());

    await cart.goToCheckout();

    let checkout = new Checkout(page);
    await checkout.fillEmail("t.gleichner@mail.com");
    await checkout.fillPhoneNumber("5142846555");
    await checkout.fillAddress("1476 Crescent St");
    await checkout.fillCity("Montreal");
    await checkout.fillState("Quebec");
    await checkout.fillZip("H3G 2B6");
    await checkout.selectCountry("Canada");
    await checkout.fillCardholderName("Tyson Gleichner");
    await checkout.fillCardNumber("6011517829909495");
    await checkout.selectCardExpMonth("Nov");
    await checkout.selectCardExpYear("2025");
    await checkout.fillCVV("586");
    await checkout.placeOrder();

    const thankYouHeaderLocator = page.locator(".iron-selected h1").getByText("Thank you");
    expect(await thankYouHeaderLocator.isVisible()).toBe(true);
})
