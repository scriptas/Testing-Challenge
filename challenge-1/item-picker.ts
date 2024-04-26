import { Page } from "@playwright/test";

export type PickedItem = {
    url: string;
    size: string;
    quantity: number;
};

export class ItemPicker{
    private isMobile: boolean;
    private page: Page;
    private homeUrl: string;
    private validSizes: string[] = ["XS", "S", "M", "L", "XL"];
    private validQuantities: number[] = [1, 2, 3, 4, 5];

    constructor(isMobile: boolean, homeUrl: string, page: Page) {
        this.isMobile = isMobile
        this.homeUrl = homeUrl
        this.page = page
    }

    async pickRandomShopListItems(amtMens: number, amtLadies: number): Promise<PickedItem[]> {
        const shopListUrls = await this.getShopListUrls();
        const mensOuterwearUrl = shopListUrls.filter(url => url.includes('mens_outerwear'))[0];
        const ladiesOuterwearUrl = shopListUrls.filter(url => url.includes('ladies_outerwear'))[0];

        const allMensItems = await this.getAllShopListItems(mensOuterwearUrl);
        const randomMensItems = this.getRandomItemsFromArray(allMensItems, amtMens);

        const allLadiesItems = await this.getAllShopListItems(ladiesOuterwearUrl);
        const randomLadiesItems = this.getRandomItemsFromArray(allLadiesItems, amtLadies);

        const allItems = [...randomMensItems, ...randomLadiesItems];

        return allItems.map(itemUrl => ({
            url: itemUrl,
            size: this.validSizes[Math.floor(Math.random() * this.validSizes.length)],
            quantity: this.validQuantities[Math.floor(Math.random() * this.validQuantities.length)]
        }));
    }

    private getRandomItemsFromArray(arr: string[], n: number): string[] {
        const shuffled = Array.from(arr).sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    }

    private async getAllShopListItems(shopListUrl: string): Promise<string[]> {
        await this.page.goto(shopListUrl);
        await this.page.waitForLoadState("networkidle");
        
        const hrefs = await this.page.$$eval('.grid a', (elements) => {
            return elements.map((element) => element.getAttribute('href'));
        });
        const fullItemUrls = hrefs.map(href => `${this.homeUrl}${href}`);
        return fullItemUrls
    }

    private async getShopListUrls(): Promise<string[]> {
        await this.page.goto(this.homeUrl);

        let fullLinks: string[] = [];
        if (this.isMobile) {
            const paperIconButton = this.page.locator(".menu-btn");
            await paperIconButton.waitFor();
            await paperIconButton.click();

            const ironSelectorDrawerListLocator = this.page.locator(".drawer-list");
            await ironSelectorDrawerListLocator.waitFor();
            const links = await this.page.$$eval('.drawer-list a', (elements) => {
                return elements.map((element) => element.getAttribute('href'));
            });
            fullLinks = links.map(link => `${this.homeUrl}${link}`);
        } else {
            const tabContainer = this.page.locator("#tabContainer > shop-tabs");
            await tabContainer.waitFor();

            const links = await this.page.$$eval("#tabContainer a", (elements) => {
                return elements.map((element) => element.getAttribute("href"));
            });
            const validLinks = links.filter(link => link);
            fullLinks = validLinks.map(link => `${this.homeUrl}${link}`);
        }

        return fullLinks;
    }

}
