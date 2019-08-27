import * as env from 'dotenv'
env.config()

import app from "./modules/server";
const PORT = 4600;
app.listen(PORT, () => {
    console.log('Express server: http://localhost:' + PORT);
}) 