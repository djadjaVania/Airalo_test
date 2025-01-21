// @ts-check
import {test, expect} from '@playwright/test';
/**
 * Test Case:
 *
 * Request Token via POST BASE_API_URL/token
 * Request 6 eSims via POST BASE_API_URL/orders
 * Verify that ALL eSims were created via BASE_API_URL/sims?filter[iccid]=`
 */

test.describe('API: Verify POST Submit Order', () => {
    const API_ROUTES = {
        TOKEN: `${process.env.BASE_API_URL}/token`,
        ORDERS: `${process.env.BASE_API_URL}/orders`,
        SIMS: `${process.env.BASE_API_URL}/sims?filter[iccid]=`,
    };
    const esim_count = 6;
    let access_token;
    let sims;

    test.beforeAll(async ({request}) => {
        await test.step('Request Bearer token', async () => {
            const headersOAuth2 = {
                Accept: 'application/json',
            };

            let data = {
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'client_credentials',
            };
            const responseToken = await request.post(API_ROUTES.TOKEN, {headers: headersOAuth2, data});
            expect(responseToken.status()).toBe(200);

            const responseTokenBody = await responseToken.json();
            access_token = responseTokenBody.data.access_token;
        });
    });

    test(`For ${esim_count} esims`, async ({request}) => {
        const headers = {
            Accept: 'application/json',
            Authorization: 'Bearer ' + access_token,
        };

        await test.step('Send POST request to ' + API_ROUTES.ORDERS, async () => {
            let data = {
                package_id: 'kallur-digital-7days-1gb', // 'merhaba-7days-1gb',
                quantity: '6',
                type: 'sim',
                description: 'Example description to identify the order',
            };
            const ordersResponse = await request.post(API_ROUTES.ORDERS, {headers, data});
            expect(ordersResponse.status()).toBe(200);

            const orders = await ordersResponse.json();
            sims = orders.data.sims.map(({id, iccid}) => ({id, iccid}));
        });

        expect(sims).toHaveLength(esim_count, 'Ensure eSIM count from response is equal to ' + esim_count)


        await test.step('Validate that every created sim is available via ' + API_ROUTES.SIMS, async () => {
            for (const sim of sims) {
                let simsResponse = await request.get(API_ROUTES.SIMS + sim.iccid, {headers});
                let simsJson = await simsResponse.json();
                expect(simsJson.data[0].iccid).toEqual(sim.iccid)
                expect(simsJson.data[0].id).toEqual(sim.id)
            }
        });
    });

});
