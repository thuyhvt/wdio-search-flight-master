import { expect } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import searchtPage from "../pageobjects/search.page.js";

describe("Search Flights", () => {
  it("it should be return results match with flights", async () => {
    await homePage.navigatetoUrl(`https://bestprice.vn`);
    await browser.maximizeWindow();
    await homePage.btnsearchFlight.waitForDisplayed();
    await homePage.selectHomeTab("Vé máy bay");
    await homePage.selectLocationFlight("From", "Nội Bài");
    await homePage.selectLocationFlight("To", "Tân Sơn Nhất");
    await homePage.setDate("Depart", "30/07/2024");
    await homePage.setDate("Return", "15/08/2024");
    await homePage.setPassengers({
      adults: 2,
      children: 1,
    });
    await homePage.btnsearchFlight.click();
    await expect(driver).toHaveUrl(/tim-kiem-ve/);
    await searchtPage.verifySearchPageVisible();
  });
});
