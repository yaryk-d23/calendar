
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
            "Accept": "application/json; odata=verbose"
        }
    }
    if(process.env.NODE_ENV === "development") {
        config.headers["Authorization"] = `Bearer ${await getToken()}`;
    }

    let req = [];
    calendarConfig.forEach(i => {
        req.push(axios.get(`${i.SiteUrl.Url}/_api/web/lists/getbytitle('${i.Title}')/items?$select=*,Duration,RecurrenceData&$expand=FieldValuesAsText,FieldValuesAsHtml, Properties`, config).then(res => res.data.d.results));
    });
    return Promise.all(req).then(async res => {
        let timeSettings = [];
        let calendars = {};
        calendarConfig.forEach((i, key) => {
            calendars[i.Id] = res[key].filter(x => x.Enterprise_x0020_Event === 'Yes').map(event => { event.recurrenceValue = event.fRecurrence; return event; });
            timeSettings[i.Id] = Promise.all(res[key].filter(x => x.Enterprise_x0020_Event === 'Yes').map(event => {
                return Promise.all([
                    axios.get(`${i.SiteUrl.Url}/_api/web/regionalsettings/timezone/utctolocaltime('${event.EventDate}')`, config),
                    axios.get(`${i.SiteUrl.Url}/_api/web/regionalsettings/timezone/utctolocaltime('${event.EndDate}')`, config),
                ]);
            }));
        });

        let timeSettingsRes = await Promise.all(timeSettings);
        calendarConfig.forEach((i, key) => {
            calendars[i.Id] = calendars[i.Id].map((event, index) => {
                if(!event.fAllDayEvent){
                    event.EventDate = new Date(timeSettingsRes[i.Id][index][0].data.d.UTCToLocalTime);
                    event.EndDate = new Date(timeSettingsRes[i.Id][index][1].data.d.UTCToLocalTime);
                    event.LinkToEdit = `${i.SiteUrl.Url}/Lists/${i.Title}/EditForm.aspx?ID=${event.Id}`;
                }
                return event;
            });
        });
        return {
            config: calendarConfig,
            calendars: calendars
        };
    });
}

export default getEvents;