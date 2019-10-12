import plimit from 'p-limit';

import { ChalkPad } from '@app/scrapper';
import { ENV } from '@app/config';

export const chalkPadRoutes = (router) => {
    const chalkpad = new ChalkPad();
  
    // handle concurrent requests
    const { CONCURRENCY } =  ENV;
    const limit = plimit(CONCURRENCY);
    let requests = [];
    let scrapping = false;

    router.post('/student', async (req, res) => {
        const id = req.body.id;
        const password = req.body.password;
        
        requests.push( 
            limit(() => chalkpad.getStudentInfo(id,password)
            .then((data) => {
                if(data == null) {
                    res.send("Wrong user name or password");
                } else {
                    res.send(data);
                }
            }))
        );

        if(!scrapping) {
            scrapping = true;
            Promise.all(requests)
            .then(() => {
                scrapping = false;
            });
        }

    });
}