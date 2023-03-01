const puppeteer = require("puppeteer");

let date = new Date();
//This function will return a JSON object for a Lexmark printer.
async function scrapeLexmark(dbJSON) {
  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2000);
    await page.goto("http://" + dbJSON.HOSTNAME);

    //Online
    var online = true;

    //Messages
    element = await page.waitForSelector("tr > td:nth-child(2) > span");
    var messages = await page.evaluate(
      (element) => element.textContent,
      element
    );

    //Warning
    element = await page.waitForSelector(
      "#Irs > div > div.ir-warnings-container > table > tbody > tr > td:nth-child(2)"
    );
    var warning = await page.evaluate(
      (element) => element.textContent,
      element
    );

    //Ink Level
    element = await page.waitForSelector(
      "#TonerSupplies > div > div > div.contentBody > div > div > div > span"
    );
    var inkLevel = await page.evaluate(
      (element) => element.textContent,
      element
    );

    //Imaging Unit
    element = await page.waitForSelector(
      "#PCDrumStatus > div > div > div.contentBody > div > div > div > span"
    );
    var imagingUnit = await page.evaluate(
      (element) => element.textContent,
      element
    );

    //Maint. Kit Level
    element = await page.waitForSelector(
      "#FuserSuppliesStatus > div > div > div.contentBody > div > div > div > span"
    );
    var mainKit = await page.evaluate(
      (element) => element.textContent,
      element
    );

    //Status
    element = await page.waitForXPath(
      "/html/body/div[2]/div[3]/ul/ul/li[2]/div/div[1]/span[2]"
    );

    var status = await page.evaluate((element) => element.textContent, element);
    await browser.close();
    console.log(
      "\x1b[32m",
      date.getDate() +
        "/" +
        date.getMonth() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
    );
    console.log(
      "Sending JSON for HOST: " +
        dbJSON.HOSTNAME +
        "| MODEL: " +
        dbJSON.MODEL +
        "\n\n"
    );
    return {
      HOSTNAME: dbJSON.HOSTNAME,
      MODEL: dbJSON.MODEL,
      ONLINE: online,
      STATUS: status,
      WARNING: warning,
      MESSAGES: messages,
      INK_LEVEL: inkLevel,
      IMAGING: imagingUnit,
      Maint_KIT: mainKit,
    };
  } catch (error) {
    const browser = await puppeteer.launch({});
    await browser.close();
    console.log(
      "\x1b[32m",
      date.getDate() +
        "/" +
        date.getMonth() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
    );
    console.log(
      "Sending JSON for HOST: " + dbJSON.HOSTNAME + "| MODEL: " + dbJSON.MODEL
    );
    return {
      HOSTNAME: dbJSON.HOSTNAME,
      MODEL: dbJSON.MODEL,
      ONLINE: false,
      STATUS: "N/A",
      WARNING: "N/A",
      MESSAGES: "N/A",
      INK_LEVEL: "N/A",
      IMAGING: "N/A",
      Maint_KIT: "N/A",
    };
  }
}
/////////////////////////////For testing
//
//  obj = {
//
//    HOSTNAME: "10.132.44.201",
//    MODEL: "HMM",
//  };
//
//  async function print() {
//    obj2 = await scrapeLexmark(obj);
//    console.log(obj2);
//    await process.exit();
//  }
////////////////////////////////////////
module.exports = { scrapeLexmark };
