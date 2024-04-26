import { Page } from "@playwright/test";
import { Item } from "./item";

export class Cart {
    private page: Page;
    items: Item[] = [];

    constructor(page: Page) {
        this.page = page
    }

    async addItem(itemUrl: string, size: string, quantity: number): Promise<void> {
        await this.page.goto(itemUrl);
        await this.selectSize(size);
        await this.selectQuantity(quantity);
        await this.clickAddToCartButton();

        const singleItemPrice = await this.getItemPrice();
        const totalPrice = this.calculateTotalPrice(singleItemPrice, quantity);
        const itemName = await this.getItemName();
        this.items.push(new Item(itemName, size, quantity, totalPrice));
    }

    private async selectSize(size: string): Promise<void> {
        const validSizes = ['XS', 'S', 'M', 'L', 'XL'];
        if (!validSizes.includes(size)) {
            throw new Error(`Invalid size: ${size}. Valid sizes are: ${validSizes.join(', ')}`);
        }
        const sizeSelect = this.page.locator("#sizeSelect");
        await sizeSelect.waitFor();
        await sizeSelect.selectOption(size);
    }

    private async selectQuantity(quantity: number): Promise<void> {
        if (quantity < 1 || quantity > 5) {
            throw new Error(`Invalid quantity: ${quantity}. Must be 1 to 5.`);
        }
        const quantitySelect = this.page.locator("#quantitySelect");
        await quantitySelect.waitFor();
        await quantitySelect.selectOption(quantity.toString());
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
        const addToCartButton = this.page.locator("text=Add to Cart");
        await addToCartButton.waitFor();
        await addToCartButton.click();

        const addedToCartNotification = this.page.locator(".label:has-text('Added to cart')");
        await addedToCartNotification.waitFor();
    }
}
