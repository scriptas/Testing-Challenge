import { test } from "@playwright/test";

test("challenge-2", async({page}) => {
    const path = require("path");
    const filePath = `file:///${path.resolve(__dirname, "../challenge-2/file.html")}`;
    await page.goto(filePath);

    // // Click the “Dog” option.
    const dogOptionLocator = page.locator("h5[data-textid='Dog']");
    await dogOptionLocator.waitFor();
    await dogOptionLocator.click();

    // // Click the “Continuer” button under the question “Année d'adoption”.
    const yearOfAdoptionSection = page.locator("h2[data-textid='Year of adoption']");
    await yearOfAdoptionSection.waitFor();
    const continuerButton = page.locator(".process:has(h2[data-textid='Year of adoption']) .next-btn button");
    await continuerButton.waitFor();
    await continuerButton.click();

    // Select year “2023” from the dropdown.
    const inputLocator = page.locator(".input.input--suffix");
    await inputLocator.waitFor();
    await inputLocator.click();
    const year2023Option = page.locator(".scrollbar.dropdown__list li:has-text('2023')");
    await year2023Option.waitFor();
    await year2023Option.click();
})
