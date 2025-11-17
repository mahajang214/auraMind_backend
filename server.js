const config = require('dotenv').config();
const webApp = require('./src/WebSetup/web.js');





const PORT = process.env.PORT || 4001;
webApp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});