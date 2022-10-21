async function openwb(){

    const puppeteer = require('puppeteer');
    const browser= await puppeteer.launch({});
    var page= await browser.newPage();
    
    
    //This function will return a JSON object for a Lexmark printer.
    async function scrapeLexmark(dbJSON){
        //Creating Headless Browser 
        
        try {

            page= await browser.newPage();
           // page.setDefaultNavigationTimeout(2000);
            await page.goto('http://'+dbJSON.HOSTNAME);
    
        //Online
        var online=true;
        
        //Messages
        element= await page.waitForSelector("tr > td:nth-child(2) > span");
        var messages= await page.evaluate(element=> element.textContent, element);
    
        //Warning
        element= await page.waitForSelector("#Irs > div > div.ir-warnings-container > table > tbody > tr > td:nth-child(2)");
        var warning= await page.evaluate(element=> element.textContent, element);
    
        //Ink Level
        element= await page.waitForSelector("#TonerSupplies > div > div > div.contentBody > div > div > div > span");
        var inkLevel= await page.evaluate(element=> element.textContent, element);
    
        //Imaging Unit
        element= await page.waitForSelector("#PCDrumStatus > div > div > div.contentBody > div > div > div > span");
        var imagingUnit= await page.evaluate(element=> element.textContent, element);
        
        //Maint. Kit Level
        element= await page.waitForSelector("#FuserSuppliesStatus > div > div > div.contentBody > div > div > div > span");
        var mainKit= await page.evaluate(element=> element.textContent, element);
    
        //Status
        element= await page.waitForXPath("/html/body/div[2]/div[3]/ul/ul/li[2]/div/div[1]/span[2]");
        var status= await page.evaluate(element=> element.textContent, element);
      
        return {
            HOSTNAME:dbJSON.HOSTNAME,
            HMA_QUE:dbJSON.HMA_QUE,
            LOCATION:dbJSON.LOCATION,
            MANUFACTOR:dbJSON.MANUFACTOR,
            TYPE:dbJSON.TYPE,
            ONLINE:online,
            STATUS:status,
            WARNING:warning,
            MESSAGES:messages,
            INK_LEVEL:inkLevel,
            IMAGING:imagingUnit,
            Maint_KIT:mainKit,     
        };
        } catch (error) {
            return {
                HOSTNAME:dbJSON.HOSTNAME,
                HMA_QUE:dbJSON.HMA_QUE,
                LOCATION:dbJSON.LOCATION,
                MANUFACTOR:dbJSON.MANUFACTOR,
                TYPE:dbJSON.TYPE,
                ONLINE:false
                }
        }
    };
    
    //This function will return a JSON object of a Zebra printer.
    async function scrapeZebra(dbJSON){
    
        //Creating Headless Browser
        try {
            page= await browser.newPage();
            //page.setDefaultNavigationTimeout(2000);
            await page.goto('http://'+dbJSON.HOSTNAME);
            
    
        //Online
        var online=true
        
        //Status
        element= await page.waitForSelector("body > center:nth-child(1) > h3:nth-child(4)")
        var status= await page.evaluate(element=> element.textContent, element)
        var status_s= await status.split(":")
        var status_f= await status_s[1].substring(1,status_s[1].length)
    
        
        return {
            HOSTNAME:dbJSON.HOSTNAME,
            HMA_QUE:dbJSON.HMA_QUE,
            LOCATION:dbJSON.LOCATION,
            MANUFACTOR:dbJSON.MANUFACTOR,
            TYPE:dbJSON.TYPE,
            ONLINE:online,
            STATUS:status_f 
        }
        } catch (error) {
            return {
                HOSTNAME:dbJSON.HOSTNAME,
                HMA_QUE:dbJSON.HMA_QUE,
                LOCATION:dbJSON.LOCATION,
                MANUFACTOR:dbJSON.MANUFACTOR,
                TYPE:dbJSON.TYPE,
                ONLINE:false
                }
        }
    };
    
    //This function checks the Manufactoring Type. 
    async function conversion(dbJSON){
    
        switch(dbJSON.MANUFACTOR){
            case "LEXMARK":
                return scrapeLexmark(dbJSON)      
            break;
    
            case "ZEBRA":
                return scrapeZebra(dbJSON)
            break;
        }
    };
    
    //This function Cycles through The list of JSON from the DB. 
    async function proliferate(dbJSON){
        let webJSON= []
    
        for(let i=0;i<dbJSON.length;i++){
           webJSON[i]= await conversion(dbJSON[i]);
           console.log(i+" : "+webJSON[i])
        };
        return webJSON;
    };
    
    //This function will get and sent the JSONs for the Web-App. 
    async function appJSON(dbJSON){
       let webJSON= await proliferate(dbJSON);
       console.log(webJSON)
    };
    
    //Gets the JSON list from the Database
    async function dbInint(){
    
        var dbJSON=  [
                        {   //correct
                            HOSTNAME: '10.132.48.11',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'ZEBRA',
                            TYPE: 'PROD'  
                        },
                        {   //correct
                            HOSTNAME: '10.132.45.94',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'ZEBRA',
                            TYPE: 'PROD'  
                        },
                        {   // type is zebra
                            HOSTNAME: '10.132.45.94',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'ZEBRA',
                            TYPE: 'PROD'
                        },
                        {   //correct
                            HOSTNAME: '10.132.28.179',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'LEXMARK',
                            TYPE: 'PROD'
                        },
                        {   //correct
                            HOSTNAME: '10.132.44.64',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'LEXMARK',
                            TYPE: 'PROD'
                        },
                        {   //Error:True type is Lexmark
                            HOSTNAME: '10.132.44.64',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'LEXMARK',
                            TYPE: 'PROD'
                        },
                        {   //correct
                            HOSTNAME: '10.132.28.179',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'LEXMARK',
                            TYPE: 'PROD'
                        },
                        {   //wrong IP
                            HOSTNAME: '10.132.48.222',
                            HMA_QUE: 'DNM',
                            LOCATION: 'DNM',
                            MANUFACTOR: 'LEXMARK',
                            TYPE: 'PROD'
                        },
                    ];
    
       await appJSON(dbJSON);
       
    };
    
    await dbInint();
    
    };
    
    openwb()
    
    
    