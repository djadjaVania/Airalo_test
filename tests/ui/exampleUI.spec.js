import {test, expect} from '@playwright/test';
/**
 * Test Case:
 *
 * Open Airalo's Website:
 * - Launch a browser and navigate to Airalo's website.
 *
 * Search for Japan:
 * - In the search field on the home page, type "Japan" and select the "Japan" destination
 *   from the “Local” section in the autocomplete options.
 *
 * Select an eSIM Package:
 * - On the next page, choose the first eSIM package.
 * - Click on "Buy Now."
 *
 * Verify Package Details:
 * - In the popup that appears, ensure the following details are accurate:
 *   - Title: Moshi Moshi
 *   - Coverage: Japan
 *   - Data: 1 GB
 *   - Validity: 7 days
 *   - Price: $4.50
 */

function getLocator(page, dataTestId) {
    if (!dataTestId) {
        throw new Error('dataTestId is required and must be a non-empty string.');
    }
    return page.locator(`[data-testid="${dataTestId}"]`);
}

async function getText(locator) {
    return await locator.evaluate(el => el.textContent.replace(/\s+/g, ' ').trim());
}

const xPathPackageDetail = 'xpath=//*[@data-testid="package-detail"]';
const xPathPackageHeader = xPathPackageDetail + '//*[@data-testid="sim-detail-header"]';
const testPackageDetailData = [
    {
        xPath: xPathPackageDetail + '//*[@data-testid="sim-detail-operator-title"]',
        field: 'Title',
        expected: 'Moshi Moshi'
    },
    {xPath: xPathPackageHeader + '//*[@data-testid="COVERAGE-value"]', field: 'COVERAGE', expected: 'Japan'},
    {xPath: xPathPackageHeader + '//*[@data-testid="DATA-value"]', field: 'DATA', expected: '1 GB'},
    {xPath: xPathPackageHeader + '//*[@data-testid="VALIDITY-value"]', field: 'VALIDITY', expected: '7 Days'},
    {xPath: xPathPackageHeader + '//*[@data-testid="PRICE-value"]', field: 'PRICE', expected: '$4.50 USD'},
];

test.describe('UI: Verify Japan first local plan', () => {
    let page;
    const mainUrl = 'https://www.airalo.com/';
    test.beforeAll(async ({browser}) => {
        await test.step('Open ' + mainUrl, async () => {
            const context = await browser.newContext();
            page = await context.newPage();

            await page.goto(mainUrl);
        });

        await test.step('Search and open "Japan" local plan', async () => {
            await getLocator(page, 'search-input').fill('Japan');
            await getLocator(page, 'Japan-name').click();
        });

        await test.step('Open the first package with option "BUY NOW"', async () => {
            await expect(getLocator(page, 'store-title')).toHaveText("Japan");

            await page.locator('xpath=//*[@data-testid="esim-button"]/button[text()="BUY NOW"]').first().click();
        });
        await expect(getLocator(page, 'buy-button'))
            .toHaveText("BUY", 'Wait till package information will be appear');

    });

    for (const data of testPackageDetailData) {
        test(`Field ${data.field} has value "${data.expected}"`, async () => {
            const elementText = await getText(page.locator(data.xPath));
            expect(elementText).toBe(data.expected);
        });
    }

    test.afterAll(async () => {
        await page.context().close();
    });
});
