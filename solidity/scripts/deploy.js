const main = async () => {

  console.log("start")

  const Event = await hre.ethers.getContractFactory("Event");
  const event = await Event.deploy();

  await event.deployed();

  const CalendarManager = await hre.ethers.getContractFactory(
    "CalendarManager"
  );
  calendarManager = await CalendarManager.deploy(event.address);

  await calendarManager.deployed();

  await event.transferOwnership(calendarManager.address);

  console.log("Events address: ", event.address);
  console.log("Calendar manager address: ", calendarManager.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
