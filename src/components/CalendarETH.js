import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

function CalendarETH({ events }) {
  const localizer = momentLocalizer(moment);

  return (
    <div className="calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default CalendarETH;
