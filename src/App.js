import logo from "./logo.svg";
import "./App.scss";
import CalendarETH from "./components/CalendarETH";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { calendarManager, events } from "./constants.js";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allEvents, setAllEvents] = useState();

  const signer = function () {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      return provider.getSigner();
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  }()

  const calendarManagerContract = new ethers.Contract(
    calendarManager.address,
    calendarManager.abi,
    signer
  );

  const eventsContract = new ethers.Contract(
    events.address,
    events.abi,
    signer
  );

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
    const events = await eventsContract.getAllEvents();
    setAllEvents(events.map(ev => cleanEvent(ev)));
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllEvents();
  }, []);

  return (
    <div className="App">
      <header className="App-header"><span>Calendar.ETH</span><span>{signer.address}</span></header>
      <CalendarETH
        events={allEvents}
        eventsContract={eventsContract}
        calendarManagerContract={calendarManagerContract} />
    </div>
  );
}

export default App;
