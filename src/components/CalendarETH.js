import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import { Form, FormControl, InputGroup } from "react-bootstrap";
import { ethers } from "ethers";

function CalendarETH({ events, eventsContract, calendarManagerContract }) {
  const localizer = momentLocalizer(moment);
  const [allowInviteAddress, setAllowInviteAddress] = useState("");
  const [invitees, setInvitees] = useState([]);
  const [currentInvitee, setCurrentInvitee] = useState([]);
  const [eventDescription, setEventDescription] = useState("");

  const addInvitee = () => {
    try {
      ethers.utils.getAddress(currentInvitee);
      //Check if not user address
      //Check if user has permission for invite
      if (!invitees.includes(currentInvitee)) {
        setInvitees((prevValue) => prevValue.concat([currentInvitee]));
      }
    } catch (e) {
      //Make this a pretty error
      console.log("Invalid address");
    }
  }

  const removeInvitee = (inviteeToRemove) => {
    setInvitees((prevValue) => prevValue.filter(inv => inv !== inviteeToRemove));
  }

  const allowInvitesFrom = async (from) => {
    try {
      ethers.utils.getAddress(currentInvitee);
      await calendarManagerContract.allowInvites(from)
    } catch (e) {
      //Make this a pretty error
      console.log("Invalid address");
    }
  }

  const createEvent = async (invitees, startDate, endDate, description) => {
    await calendarManagerContract.createEvent(invitees, new Date().getTime(), new Date().getTime(), description)
  }

  return (
    <div className="calendar">
      <Calendar
        localizer={localizer}
        events={events || []}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 650 }}
      />
      <div className="allow-invites action-card">
        <p className="mb-3">Allow invites from other addresses</p>
        <div className="content">
          <InputGroup>
            <FormControl placeholder="Insert address (0x)" value={allowInviteAddress} onChange={(e) => setAllowInviteAddress(e.target.value)} />
            <Button variant="primary" onClick={() => allowInvitesFrom(allowInviteAddress)}>
              Allow invites from address
            </Button>
          </InputGroup>
        </div>
      </div>
      <div className="create-event action-card">
        <p className="mb-3">Create invite</p>
        <div className="content">
          <Form className="text-start">

            <Form.Group className="mb-3">
              <Form.Label>Event description</Form.Label>
              <Form.Control placeholder="Enter event description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Invitees</Form.Label>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Enter a valid addresses (0x)"
                  value={currentInvitee}
                  onChange={(e) => setCurrentInvitee(e.target.value)}
                />
                <Button onClick={() => { addInvitee() }} variant="outline-primary">
                  <span className="fw-bold">+</span>
                </Button>
              </InputGroup>
              {invitees.map((invitee) =>
                <div className="mb-2">
                  {invitee}
                  <span onClick={() => { removeInvitee(invitee) }} className={"fw-bold ms-3 text-secondary"}>X</span>
                </div>
              )}
            </Form.Group>
          </Form>


          <Button variant="primary" onClick={() => createEvent(invitees, 0, 0, eventDescription)}>
            Create event
          </Button>
        </div>
      </div>
    </div >
  );
}

export default CalendarETH;
