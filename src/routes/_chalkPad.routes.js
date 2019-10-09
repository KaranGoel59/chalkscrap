import { ChalkPad } from '@app/scrapper';

export const chalkPadRoutes = (router, browser) => {
    const chalkpad = new ChalkPad(browser);

    router.post('/student', async (req, res) => {
        const id = req.body.id;
        const password = req.body.password;
        const data = await chalkpad.getStudentInfo(id,password);
        if(data == null) {
            res.send("Wrong user name or password");
        } else {
        res.send(data);
        }
    });
}