import './App.css';
import { useAsync } from 'react-async';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import spEventsParser from "sharepoint-events-parser";

import getEvents from "./api/api"
const localizer = momentLocalizer(moment)

// const events = [
//   {
//     start: '2021-04-02',
//     end: '2021-04-02',
//     eventClasses: 'optionalEvent',
//     title: 'test event',
//     description: 'This is a test description of an event',
//   },
//   {
//     start: '2021-04-02',
//     end: '2021-04-25',
//     title: 'test event',
//     description: 'This is a test description of an event',
//     data: 'you can add what ever random data you may want to use later',
//   },
// ];

const loadEvents = async () =>  await getEvents();

function App() {
  const { data, error, isLoading } = useAsync({ promiseFn: loadEvents });
  if (isLoading) return "Loading..."
  if (error) return `Something went wrong: ${error.message}`
  if (data) {
    data.config.forEach((i, key) => {
      let dt = new Date();
      let startDate = new Date(dt.getFullYear(), 0, 1); //start from the 25th of last month
      let endDate = new Date(dt.getFullYear(), 11, 21);
      let parsedArray = spEventsParser.parseEvents(data.calendars[i.Id], startDate, endDate);
      parsedArray = parseEvents(parsedArray, i);
      data.calendars[i.Id] = parsedArray;
  });
    // const parsedArray = spEventsParser.parseEvents(data.data.d.results);
    let events = [];
    Object.keys(data.calendars).map(key => {
      events = [...events, ...data.calendars[key]];
    });
    return (
      <div className="App">
        <div className="calendar-history">
          {data.config.map(i => {
            return (<div className="history-item" style={{backgroundColor: i.Color}}>
              {i.Title}
            </div>);
          })}
        </div>
        <div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            views={['month', 'week', 'day']}
            eventPropGetter={(event) => {return {
              className: event.className,
              style: {background: event.blockColor}
            }}}
          />
        </div>
      </div>
    );
  }
}


function parseEvents(events, config) {
  return events.map(event => {
    event.start = event.EventDate;
    event.end = event.EndDate;
    event.eventClasses = 'optionalEvent';
    event.title = event.Title;
    event.description = event.Description;
    event.blockColor = config.Color;
    return event;
  });
}

export default App;
