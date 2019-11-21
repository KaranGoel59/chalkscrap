import plimit from 'p-limit';

import { ChalkPad } from '@app/scrapper';
import { ENV } from '@app/config';

export const chalkPadEvents = (socket) => {
    const chalkpad = new ChalkPad();
  
    // handle concurrent requests
    const { CONCURRENCY } =  ENV;
    const limit = plimit(CONCURRENCY);
    let requests = [];
    let scrapping = false;

    socket.on('student', async (student) => {
        const id = student.id;
        const password = student.password;
        
        requests.push( 
            limit(() => chalkpad.getStudentInfo(id,password)
            .then((data) => {
                if(data == null) {
                    //logic to handle error
                    console.log("no data scrapped");
                } else {
                    //logic to save data
                    console.log(data);
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