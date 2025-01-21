// @ts-check
import {test, expect} from '@playwright/test';

test.describe('API Verify POST Submit Order', () => {
    const baseURL = 'https://sandbox-partners-api.airalo.com/v2';
    let access_token;
    let sims;

    test.beforeAll(async ({request}) => {
        const headersOAuth2 = {
            Accept: 'application/json',
        };
        let data = {
            client_id: '7e29e2facf83359855f746fc490443e6',
            client_secret: 'e5NNajm6jNAzrWsKoAdr41WfDiMeS1l6IcGdhmbb',
            grant_type: 'client_credentials',
        };
        const responseToken = await request.post(`${baseURL}/token`, {headers: headersOAuth2, data});
        expect(responseToken.status()).toBe(200);

        const responseTokenBody = await responseToken.json();
        access_token = responseTokenBody.data.access_token;
    });

    test('Verify POST /orders for 6 esims', async ({request}) => {
        console.log('access_token:', access_token);

        const headers = {
            Accept: 'application/json',
            Authorization: 'Bearer ' + access_token,
        };

        let data = {
            package_id: 'kallur-digital-7days-1gb', // 'merhaba-7days-1gb',
            quantity: '6',
            type: 'sim',
            description: 'Example description to identify the order',
        };
        const ordersResponse = await request.post(`${baseURL}/orders`, {headers, data});
        expect(ordersResponse.status()).toBe(200);
        const orders = await ordersResponse.json();

        expect(ordersResponse.status()).toBe(200);
        sims = orders.data.sims.map(sim => ({
            id: sim.id,
            iccid: sim.iccid,
        }));
        console.log('results sims:', sims);

        for (const sim of sims) {
            let simsResponse = await request.get(`${baseURL}/sims?filter[iccid]=` + sim.iccid, {headers});
            let simsJson = await simsResponse.json();
            expect(simsJson.data[0].iccid).toEqual(sim.iccid)
            expect(simsJson.data[0].id).toEqual(sim.id)
        }
    });

});
