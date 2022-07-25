const {By,Key,Builder} = require("selenium-webdriver");
require("chromedriver");

async function backend_test1(){

       var searchString = "Automation testing with Selenium";

       //To wait for browser to build and launch properly
       let driver = await new Builder().forBrowser("chrome").build();

        //To fetch http://google.com from the browser with our code.
        const url = "http://localhost:8080/api/hotel/diH7"
        await driver.get(url);
        // await driver.get("http://google.com");

        //To send a search query by passing the value in searchString.
        // await driver.findElement(By.name("q")).sendKeys(searchString,Key.RETURN);
        driver.findElement(By.xpath("/html/body/pre"))
        .then((e)=>{
           console.log(e.getAttribute("innerHTML"))

        })
        // driver.getPageSource().then(console.log)
        //Verify the page title and print it
        var title = await driver.getTitle();
        console.log('Title is:',title);

        //It is always a safe practice to quit the browser after execution
        await driver.quit();

}

backend_test1()