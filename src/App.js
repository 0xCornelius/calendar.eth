import logo from "./logo.svg";
import "./App.scss";
import CalendarETH from "./components/CalendarETH";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import calendarManagerABI from "./solidity/artifacts/contracts/CalendarManager.sol/CalendarManager.json";
import eventsABI from "./solidity/artifacts/contracts/Event.sol/Event.json";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allEvents, setAllEvents] = useState();

  const calendarManagerContractAddress =
    "0xAF376C348f13741E19504207cCdE30504FFFD367";
  const eventsContractAddress = "0x3391116508846B8970a81efB05b90971110A5346";

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      await window.ethereum.enable();

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const cleanEvent = (scEvent) => {
    return {
      start: new Date(scEvent.startDate.toNumber()),
      end: new Date(scEvent.endDate.toNumber()),
      invitees: scEvent.invites,
      description: scEvent.description,
      title: scEvent.description,
      organizer: scEvent.organizer,
      allDay: false,
    }
  }

  const getAllEvents = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const eventsContract = new ethers.Contract(
          eventsContractAddress,
          eventsABI.abi,
          signer
        );

        const events = await eventsContract.getAllEvents();
        setAllEvents(events.map(ev => cleanEvent(ev)));

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllEvents();
  }, []);

  return (
    <div className="App">
      <header className="App-header">Calendar.ETH</header>
      <CalendarETH events={allEvents}></CalendarETH>
    </div>
  );
}

export default App;
