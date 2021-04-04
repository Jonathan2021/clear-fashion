const axios = require('axios');

module.exports.get_url_data = async url => {

    console.log(`Getting url ${url}`);

    const response = await axios(url);
    const {data, status} = response;

    if (status >= 200 && status < 300) {
        return data;
    }

    console.error(status);

    return null;
}
