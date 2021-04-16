
import axios from "axios";
import getToken from "./token";
import getConfig from "./getConfig";

// function Api() {
//     return {
//         getEvents: getEvents
//     };
// }

async function getEvents() {
    let calendarConfig = await getConfig();

    let config = {
        headers: {
            "Accept": "application/json; odata=verbose",
            "Authorization": `Bearer ${await getToken()}`
        }
    }

    let req = [];
    calendarConfig.forEach(i => {
        req.push(axios.get(`${i.SiteUrl.Url}/_api/web/lists/getbytitle('${i.Title}')/items?$select=*,Duration,RecurrenceData`, config).then(res => res.data.d.results));
    });
    return Promise.all(req).then(res => {
        let calendars = {};
        calendarConfig.forEach((i, key) => {
            calendars[i.Id] = res[key];
        });
        return {
            config: calendarConfig,
            calendars: calendars
        };
    });
}



export default getEvents;