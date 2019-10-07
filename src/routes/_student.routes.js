import { getStudentInfo } from '@app/scrapper';

export const studentRoutes = (router) => {
    router.get('/', async (req, res) => {
        const data = await getStudentInfo('1711981136','chitkara');
        res.send(data);
    });
}