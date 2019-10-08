import { ChalkPad } from '@app/scrapper';

export const chalkPadRoutes = (router, browser) => {
    const chalkpad = new ChalkPad(browser);

    router.get('/', async (req, res) => {
        const data = await chalkpad.getStudentInfo('1711981136','chitkara');
        res.send(data);
    });
}