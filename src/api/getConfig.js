import axios from "axios";
import getToken from "./token";

async function getConfig() {
    let config = {
        headers: {
            "Accept": "application/json; odata=verbose",
            // "Authorization": `Bearer ${await getToken()}`
        }
    }
    return axios.get("https://dvagov.sharepoint.com/sites/VAFMBT/_api/web/lists/getbytitle('CalendarConfig')/items", config).then(res => {
        return res.data.d.results;
    });
}

export default getConfig;