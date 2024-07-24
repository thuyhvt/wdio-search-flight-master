import { expect } from "@wdio/globals";
import homePage from "../pageobjects/home.page.js";
import flightPage from "../pageobjects/flight.page.js";

describe("Search for flights", () => {
  it("should return results for flights", async () => {
    await homePage.open();
    await homePage.pickFlightBtn("From").waitForExist();
    await homePage.selectSearchTab("Vé máy bay");
    await expect(homePage.getSearchTab("Vé máy bay")).toHaveAttribute(
      "class",
      /active/
    );
    await homePage.selectFlightFromTo({
      from: "Nội Bài",
      to: "Tân Sơn Nhất",
    });
    await homePage.setDepartReturnDate({
      depart: "30/07/2024",
      return: "15/08/2024",
    });
    await homePage.setPassengers({
      adults: 2,
      children: 1,
    });
    await homePage.findFlightsBtn.click();
    await expect(driver).toHaveUrl(/tim-kiem-ve/);
    await flightPage.verifyFlightsLoaded()
    await expect(flightPage.flightDepartList).toBeDisplayed();
  });
});
