//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Event is ERC721, Ownable {

    struct EventData {
        //let date = (new Date()).getTime();
        uint256 date;
        address[] invites;
        string description;
        address organizer;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => EventData) public eventsData;
    
    constructor() ERC721 ("calendar.eth", "CALETH") {}

    function createEvent(uint256 date, address[] memory invites, string memory description, address organizer) public onlyOwner returns(uint256){
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        eventsData[newItemId] = EventData(date, invites, description, organizer);
        _tokenIds.increment();
        return newItemId;
    }

    function cancelEvent(uint256 eventId) public onlyOwner returns(bool) {
        delete eventsData[eventId];
        _burn(eventId);
        return true;
    }

    function getEventData(uint256 id) public view returns(EventData memory){
        return eventsData[id];
    }

}
