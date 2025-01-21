import {test, expect} from '@playwright/test';

function getXPathSelector(dataTestId) {
    if (!dataTestId) {
        throw new Error('dataTestId is required and must be a non-empty string.');
    }
    return `xpath=//*[@data-testid="${dataTestId}"]`;
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
    test.beforeAll(async ({browser}) => {
        const context = await browser.newContext();
        page = await context.newPage();

        await page.goto('https://www.airalo.com/');

        await page.fill(getXPathSelector('search-input'), 'Japan');

        await page.locator(getXPathSelector('Japan-name')).click();

        await expect(page.locator(getXPathSelector('store-title'))).toHaveText("Japan");

        await page.locator('xpath=//*[@data-testid="esim-button"]/button[text()="BUY NOW"]').first().click();

        await expect(page.locator(getXPathSelector('buy-button'))).toHaveText("BUY");
    });
    for (const data of testPackageDetailData) {
        test(`Verify ${data.field} for Japan local plan`, async () => {

            //await expect(page.locator(data.xPath)).toHaveText(data.expected);
            const elementText = await page.locator(data.xPath)
                .evaluate(el => el.textContent.replace(/\s+/g, ' ').trim());
            expect(elementText).toBe(data.expected);
        });
    }

    test.afterAll(async () => {
        await page.context().close();
    });
});
