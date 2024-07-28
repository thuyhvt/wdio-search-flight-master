import { $ } from "@wdio/globals";
import CommonPage from "./common.page.js";

class SearchPage extends CommonPage {
  public get sortDeparts() {
    return $(".sort-des-depart");
  }

  public get flightDataContentDepart() {
    return $("#flight_data_content_depart");
  }

  public async verifySearchPageVisible() {
    await this.sortDeparts.waitForDisplayed();
    await this.flightDataContentDepart.waitForDisplayed();
  }
}

export default new SearchPage();
