import React, { useState } from 'react';
import './App.css';
import { useAsync } from 'react-async';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import spEventsParser from "sharepoint-events-parser";

import getEvents from "./api/api"
import EventDetails from "./components/EventDetails/EventDetails";

const localizer = momentLocalizer(moment)
const loadEvents = async () => await getEvents();

function App() {
  const { data, error, isLoading } = useAsync({ promiseFn: loadEvents });
  const [hideCalendars, setHideCalendars] = useState([]);
  const onClickCalendar = function (id) {
    if (hideCalendars.indexOf(id) === -1) {
      setHideCalendars([...hideCalendars, id]);
    }
    else {
      let tmp = hideCalendars;
      tmp.splice(hideCalendars.indexOf(id), 1)
      setHideCalendars([...tmp]);
    }
  }
  const [selectedEvent, setSelectedEvent] = useState(null);
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
    Object.keys(data.calendars).filter(x => {
      return hideCalendars.indexOf(parseInt(x)) === -1;
    }).forEach(key => {
      events = [...events, ...data.calendars[key]];
    });
    return (
      <div className="App">
        <div className="calendar-history">
          {data.config.map(i => {
            return (<div key={i.Id} className={["history-item", hideCalendars.indexOf(i.Id) !== -1 ? "hide" : ""].join(" ")} style={{ backgroundColor: i.Color }} onClick={() => onClickCalendar(i.Id)}>
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
            eventPropGetter={(event) => {
              return {
                className: event.className,
                style: { background: event.blockColor }
              }
            }}
            onSelectEvent={(e) => {
              setSelectedEvent(e);
            }}
          />
        </div>
        {!!selectedEvent ? <div>
          <EventDetails event={ selectedEvent } toggleHideDialog={(val) => setSelectedEvent(val)}/>
        </div> : null}
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
