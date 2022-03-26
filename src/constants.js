import calendarManagerABI from "./solidity/artifacts/contracts/CalendarManager.sol/CalendarManager.json";
import eventsABI from "./solidity/artifacts/contracts/Event.sol/Event.json";

export const calendarManager = {
    address: "0xAF376C348f13741E19504207cCdE30504FFFD367",
    abi: calendarManagerABI.abi,
}

export const events = {
    address: "0x3391116508846B8970a81efB05b90971110A5346",
    abi: eventsABI.abi,
}