import { Page, expect } from "@playwright/test";
import { Item } from "./item";
import { PickedItem } from "./item-picker";

export class ItemSelector {
    private page: Page;
    selectedItems: Item[] = [];

    constructor(page: Page) {
        this.page = page
    }

    async selectItems(items: PickedItem[]): Promise<void> {
        for (const item of items) {
            await this.page.goto(item.url);
            await this.page.waitForLoadState("networkidle");
            await this.selectSize(item.size);
            await this.selectQuantity(item.quantity);
            await this.clickAddToCartButton();

            const singleItemPrice = await this.getItemPrice();
            const totalPrice = this.calculateTotalPrice(singleItemPrice, item.quantity);
            const itemName = await this.getItemName();
            this.selectedItems.push(new Item(itemName, item.size, item.quantity, totalPrice));
        }
    }

    getTotalPrice(): number {
        let totalPrice = 0;
        for (const item of this.selectedItems) {
            totalPrice += item.price;
        }
        return parseFloat(totalPrice.toFixed(2));
    }

    private async selectSize(size: string): Promise<void> {
        const sizeSelect = this.page.locator("#sizeSelect");
        await sizeSelect.waitFor();
        await sizeSelect.selectOption(size);
        const selectedOptionLocator = sizeSelect.locator("option:checked");
        const selectedTextContent = await selectedOptionLocator.textContent();
        expect(size).toBe(selectedTextContent);
    }

    private async selectQuantity(quantity: number): Promise<void> {
        const quantitySelect = this.page.locator("#quantitySelect");
        await quantitySelect.waitFor();
        await quantitySelect.selectOption(quantity.toString());
        const selectedOptionLocator = quantitySelect.locator("option:checked");
        const selectedTextContent = await selectedOptionLocator.textContent();
        expect(quantity.toString()).toBe(selectedTextContent);
    }

    private async getItemPrice(): Promise<number> {
        const price = this.page.locator(".price");
        await price.waitFor();
        const priceText = await price.textContent();
        if (priceText) {
            const priceWithoutDollarSign = priceText.replace('$', '');
            const priceNumber = parseFloat(priceWithoutDollarSign);
            return priceNumber;
        } else {
            throw new Error("Failed to get item price.");
        }
    }

    private calculateTotalPrice(singleItemPrice: number, quantity: number): number {
        return parseFloat((singleItemPrice * quantity).toFixed(2));
    }

    private async getItemName(): Promise<string> {
        const name = this.page.locator(".detail h1");
        await name.waitFor();
        const nameText = await name.textContent();
        if (nameText) {
                return nameText;
        } else{
                throw new Error("Failed to get item name.");
        }
    }
    
    private async clickAddToCartButton(): Promise<void> {
        const addToCartButton = this.page.locator("button[aria-label='Add this item to cart']");
        await addToCartButton.waitFor();
        await addToCartButton.click();
        const cartModal = this.page.locator('shop-cart-modal.opened');
        await cartModal.waitFor();
    }

}
