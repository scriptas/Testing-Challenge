import { Page } from "@playwright/test";
import { Item } from "./item";

export class Cart {
    private page: Page;
    private homeUrl: string = "https://shop.polymer-project.org";

    constructor(page: Page) {
        this.page = page
    }

    async getShopCartItems(): Promise<Item[]> {
        await this.goToCart()
        
        let shopCartItems: Item[] = []; 
        const shopCartItemsLocator = this.page.locator("div.list shop-cart-item");
        const shopCartItemsElements = await shopCartItemsLocator.all();
        for (const item of shopCartItemsElements) {
            item.waitFor()

            const nameLocator = item.locator(".name");
            let itemName = await nameLocator.textContent();
            if (itemName) {
                itemName = itemName.trim();
            } else {
                throw new Error("Failed to get item name.")
            }

            const sizeLocator = item.locator(".size span");
            let itemSize = await sizeLocator.textContent();
            if (itemSize) {
                itemSize = itemSize.trim();
            } else {
                throw new Error("Failed to get item size.")
            }

            const quantitySelectLocator = item.locator("#quantitySelect");
            const itemQuantity = Number(await quantitySelectLocator.inputValue());

            let itemPrice: number = 0;
            const priceLocator = item.locator(".price");
            const pricePerOneItemText = await priceLocator.textContent();
            if (pricePerOneItemText) {
                const priceWithoutDollarSign = pricePerOneItemText.replace("$", "");
                const priceNumber = parseFloat(priceWithoutDollarSign);
                itemPrice = parseFloat((priceNumber * itemQuantity).toFixed(2));
            }

            shopCartItems.push(new Item(itemName, itemSize, itemQuantity, itemPrice));
        }

        return shopCartItems;
    }

    async getSubTotal(): Promise<number> {
        await this.goToCart();

        const subTotalLocator = this.page.locator(".subtotal");
        await subTotalLocator.waitFor();

        const subTotalText = await subTotalLocator.textContent();
        if (subTotalText) {
            const subTotalTextNoDollarSign = subTotalText.replace("$", "");
            return Number(parseFloat(subTotalTextNoDollarSign).toFixed(2));
        } else {
            throw new Error("Failed to get subtotal.")
        }
    }
    
    private async goToCart(): Promise<void> {
        await this.page.goto(this.homeUrl)
        const cartBtnContainer = this.page.locator(".cart-btn-container a")
        await cartBtnContainer.waitFor()
        const href = await cartBtnContainer.getAttribute("href")
        await this.page.goto(`${this.homeUrl}${href}`)
        await this.page.waitForLoadState("networkidle")
    }

}
