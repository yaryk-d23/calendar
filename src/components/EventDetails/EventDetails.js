import React from 'react';
import './EventDetails.css';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import * as dayjs from 'dayjs'


function EventDetails({ event, toggleHideDialog }) {
    const generateOutlookExport = (e) => {
        let params = [
            "https://outlook.office.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent",
            `startdt=${encodeURIComponent(dayjs(e.EventDate).format("YYYY-MM-DDTHH:mm:ssZ"))}`,
            `enddt=${encodeURIComponent(dayjs(e.EndDate).format("YYYY-MM-DDTHH:mm:ssZ"))}`,
            // `enddt=${encodeURIComponent("2022-01-12T20:00:00+00:00")}`,
            `subject=${encodeURIComponent(e.Title)}`,
            `location=${encodeURIComponent(e.Location)}`,
            `body=${encodeURIComponent(e.Description)}`,
        ];
        return params.join("&");
    }
    return (
        <div className="EventDetails">
            <Dialog
                className='event-details'
                hidden={!event}
                onDismiss={() => toggleHideDialog(null)}
                dialogContentProps={{
                    type: DialogType.largeHeader,
                    title: event.Title,
                    closeButtonAriaLabel: 'Close',
                }}
                modalProps={{
                    titleAriaId: 'dialogLabel',
                    subtitleAriaId: 'subTextLabel',
                    isBlocking: false,
                }}
            >
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm4">
                            <label>Category:</label>
                        </div>
                        <div className="ms-Grid-col ms-sm8">{event.Category}</div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm4">
                            <label>Location:</label>
                        </div>
                        <div className="ms-Grid-col ms-sm8">{event.Location}</div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm4">
                            <label>Start Time:</label>
                        </div>
                        <div className="ms-Grid-col ms-sm8">{dayjs(event.EventDate).format("MM/DD/YYYY")}{" "}
                        {!event.fAllDayEvent ? dayjs(event.EventDate).format("h:mm A") : null}</div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm4">
                            <label>End Time:</label>
                        </div>
                        <div className="ms-Grid-col ms-sm8">{dayjs(event.EndDate).format("MM/DD/YYYY")}{" "}
                        {!event.fAllDayEvent ? dayjs(event.EndDate).format("h:mm A") : null}</div>
                    </div>
                    <div className="ms-Grid-row description">
                        <div className="ms-Grid-col ms-sm4">
                            <label>Description:</label>
                        </div>
                        <div className="ms-Grid-col ms-sm8">
                            <div dangerouslySetInnerHTML={{ __html: event.Description }}></div>
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm4">
                            <label>All Day Event:</label>
                        </div>
                        <div className="ms-Grid-col ms-sm8">{event.fAllDayEvent ? "Yes" : "No"}</div>
                    </div>
                    {event.recurrenceValue ? <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm4">
                            <label>Recurrence:</label>
                        </div>
                        <div className="ms-Grid-col ms-sm8">{event.RecurrenceData}</div>
                    </div> : null}
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-sm12">
                            <a rel="noreferrer" target="_blank" href={generateOutlookExport(event)}>Add to Outlook</a>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <PrimaryButton href={event.LinkToEdit} target="_blank" text="Edit" />
                    <DefaultButton onClick={() => toggleHideDialog(null)} text="Close" />
                </DialogFooter>
            </Dialog>
        </div>
    );
}


export default EventDetails;
