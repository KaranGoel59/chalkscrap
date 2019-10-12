export const chalkPadRoutes = (router) => {
    router.get('/',async (req,res) => {
        res.send("ChalkPad Scrapper");
    });   
}