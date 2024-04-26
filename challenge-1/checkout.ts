import { Page } from "@playwright/test";

export class Checkout {
    page: Page;

    constructor(page: Page) {
        this.page = page
    }

    async fillEmail(email: string): Promise<void> {
        return await this.fillInput(email, "accountEmail");
    }

    async fillPhoneNumber(phoneNumber: string): Promise<void> {
        return await this.fillInput(phoneNumber, "accountPhone");
    }

    async fillAddress(address: string): Promise<void> {
        return await this.fillInput(address, "shipAddress");
    }

    async fillCity(city: string): Promise<void> {
        return await this.fillInput(city, "shipCity");
    }

    async fillState(state: string): Promise<void> {
        return await this.fillInput(state, "shipState");
    }

    async fillZip(zip: string): Promise<void> {
        return await this.fillInput(zip, "shipZip");
    }

    async fillCardholderName(name: string): Promise<void> {
        return await this.fillInput(name, "ccName");
    }

    async fillCardNumber(number: string): Promise<void> {
        return await this.fillInput(number, "ccNumber");
    }

    async fillCVV(cvv: string): Promise<void> {
        return await this.fillInput(cvv, "ccCVV");
    }

    private async fillInput(data: string, inputId: string): Promise<void> {
        const emailInputLocator = this.page.locator(`#${inputId}`);
        await emailInputLocator.fill(data);
    }

    async selectCountry(country: string): Promise<void> {
        return await this.selectOption(country, "shipCountry");
    }

    async selectCardExpMonth(expMonth: string): Promise<void> {
        return await this.selectOption(expMonth, "ccExpMonth");
    }

    async selectCardExpYear(expYear: string): Promise<void> {
        return await this.selectOption(expYear, "ccExpYear");
    }

    private async selectOption(option: string, selectId: string): Promise<void> {
        const countrySelectLocator = this.page.locator(`#${selectId}`)
        await countrySelectLocator.selectOption(option)
    }

    async placeOrder(): Promise<void> {
        const buttonLocator = this.page.locator("#submitBox");
        await buttonLocator.click();
        await this.page.waitForLoadState("networkidle")

        const thankYouHeaderLocator = this.page.locator(".iron-selected h1").getByText("Thank you")
        await thankYouHeaderLocator.waitFor();
    }

}