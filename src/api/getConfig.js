import axios from "axios";
import getToken from "./token";

async function getConfig() {
    let config = {
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    }
    if(process.env.NODE_ENV === "development") {
        config.headers["Authorization"] = `Bearer ${await getToken()}`;
    }
    return axios.get(`${process.env.NODE_ENV === "development" ? "https://chironitcom.sharepoint.com/sites/Demo/va" : "https://dvagov.sharepoint.com/sites/VAFMBTCalendars"}/_api/web/lists/getbytitle('CalendarConfig')/items`, config).then(res => {
        return res.data.d.results;
    });
}

export default getConfig;