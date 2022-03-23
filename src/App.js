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
    "0xf5153286fd3E49Cc2c3bEc135162AD60fA31007f";
  const eventsContractAddress = "0x39ad297674a97830779f924E6c6E2C5c1e35f48F";

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

  const getAllEvents = async () => {
    const { ethereum } = window;

    console.log("getting events")
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

        console.log(events);

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
      <CalendarETH></CalendarETH>
    </div>
  );
}

export default App;
