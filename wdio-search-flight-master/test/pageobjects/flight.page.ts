import { $ } from "@wdio/globals";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class FlightsPage extends Page {
  public get loadingFlights() {
    return $("#flight_loading_data_depart");
  }

  public get flightDepartList() {
    return $("#flight_content_depart");
  }

  public async verifyFlightsLoaded() {
    await this.loadingFlights.waitForDisplayed();
    await this.loadingFlights.waitForDisplayed({ reverse: true });
  }
}

export default new FlightsPage();
