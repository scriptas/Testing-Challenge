import { Page } from "@playwright/test";

export class RandomItemGetter{
    private page: Page;
    private homeUrl: string = "https://shop.polymer-project.org";

    constructor(page: Page) {
        this.page = page
    }

    async getRandomShopListItems(amtMens: number, amtLadies: number): Promise<string[]> {
        const shopListUrls = await this.getShopListUrls();
        const mensOuterwearUrl = shopListUrls.filter(url => url.includes('mens_outerwear'))[0];
        const ladiesOuterwearUrl = shopListUrls.filter(url => url.includes('ladies_outerwear'))[0];

        const allMensItems = await this.getAllShopListItems(mensOuterwearUrl);
        const randomMensItems = this.getRandomItemsFromArray(allMensItems, amtMens);

        const allLadiesItems = await this.getAllShopListItems(ladiesOuterwearUrl);
        const randomLadiesItems = this.getRandomItemsFromArray(allLadiesItems, amtLadies);

        return [...randomMensItems, ...randomLadiesItems];
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
        const tabContainer = this.page.locator("#tabContainer > shop-tabs");
        await tabContainer.waitFor();
        const links = await this.page.$$eval('#tabContainer a', (elements) => {
            return elements.map((element) => element.getAttribute('href'));
        });
        const validLinks = links.filter(link => link);
        const fullShopListUrls = validLinks.map(link => `${this.homeUrl}${link}`);
        return fullShopListUrls;
    }
}
