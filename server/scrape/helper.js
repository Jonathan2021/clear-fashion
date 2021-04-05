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

module.exports.currentDate = (date) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return [yyyy, mm, dd].join('-');
}
