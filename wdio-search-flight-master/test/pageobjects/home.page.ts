import { $ } from "@wdio/globals";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {
  public pickFlightBtn(name: "From" | "To") {
    return $(`[class*=des__flight_${name.toLowerCase()}]`);
  }

  public get flightFromPopup() {
    return $(".flight_from_popup");
  }

  public get flightToPopup() {
    return $(".flight_to_popup");
  }

  public get inputFromInPopup() {
    return this.flightFromPopup.$("input[data-id=flight_from]");
  }

  public get inputToInPopup() {
    return this.flightToPopup.$("input[data-id=flight_to]");
  }

  public get destinySuggestionsMenu() {
    return $(".tt-dropdown-menu");
  }

  public get inputFlightPassenger() {
    return $("input#flight_passenger");
  }

  public get passengerPopup() {
    return $(".pop-flight-passenger");
  }

  public inputDatePicker(type: "Depart" | "Return") {
    return $(`input[name=${type}]`);
  }

  public inputPassengersPopup(type: "adults" | "children" | "infants") {
    return $(`input[data-name='nb_${type}']`);
  }

  public get findFlightsBtn() {
    return $("button#search_button");
  }

  public increasePsgBtn(passengerType: "adults" | "children" | "infants") {
    return $(
      `//*[contains(@class,'pop-flight-passenger')] //*[@class='row' and .//input[@data-name='nb_${passengerType}']] //span[contains(@class,'input-group-btn') and .//*[contains(@class,'btn-plus')]]`
    );
  }

  /**
   * Get elements of search tabs
   * @param name: name in Vietnamese
   * @returns
   */
  async getSearchTab(name: "Vé máy bay" | "Khách sạn" | "Tour du lịch") {
    const searchTabs = {
      "Vé máy bay": "flight",
      "Khách sạn": "hotel",
      "Tour du lịch": "tour",
    };
    return await $(`[data-id=${searchTabs[name]}]`);
  }

  /**
   * Method select search tab
   * @param tabName : Name of the tab
   */
  public async selectSearchTab(
    tabName: "Vé máy bay" | "Khách sạn" | "Tour du lịch"
  ): Promise<void> {
    const tab = await this.getSearchTab(tabName);
    const tabStatus = await tab.getAttribute("class");
    if (!tabStatus.includes("active")) {
      await tab.click();
    }
  }

  /**
   * Method to set flight destiny from., to
   * @param type: 2 types from, to
   * @param des: destiny fill in the search
   */
  private async selectFlightDestiny(type: "From" | "To", des: string) {
    const selectFlightBtn = await this.pickFlightBtn(type);
    const popup =
      type == "From" ? await this.flightFromPopup : await this.flightToPopup;
    const input =
      type == "From" ? await this.inputFromInPopup : await this.inputToInPopup;
    const isInputDisplayed = await input.isDisplayedInViewport();
    if (!isInputDisplayed) {
      await selectFlightBtn.click();
    }
    await expect(popup).toBeDisplayed();
    await input.addValue(des);
    const option = await $(`strong.tt-highlight.*=${des}`);
    await expect(option).toBeExisting();
    await option.click();
  }

  /**
   * Complete select flight from... to...
   * @param data
   */
  public async selectFlightFromTo(data: { from: string; to: string }) {
    await this.selectFlightDestiny("From", data.from);
    await this.selectFlightDestiny("To", data.to);
  }

  /**
   * Set date for only once time for Depart flight or Return flight
   * @param type
   * @param date
   */
  private async setDate(
    type: "Depart" | "Return",
    date: string
  ): Promise<void> {
    const inputDate = await this.inputDatePicker(type);
    const inputCss =
      type == "Depart" ? "#departure_date_flight" : "#returning_date_flight";
    await browser.execute((ele) => {
      const input = document.querySelector(ele);
      input?.removeAttribute("readonly");
    }, inputCss);
    await inputDate.setValue(date);
  }

  /**
   * Set date for both Depart and Return flight
   * @param data date should be in format dd/mm/yyyy
   */
  public async setDepartReturnDate(data: {
    depart: string;
    return: string;
  }): Promise<void> {
    await this.setDate("Depart", data.depart);
    await this.setDate("Return", data.return);
  }

  public async setPassengers(passengers?: {
    adults?: number;
    children?: number;
    infants?: number;
  }) {
    if (passengers) {
      const isPopupPsgDisplayed =
        await this.passengerPopup.isDisplayedInViewport();
      if (!isPopupPsgDisplayed) {
        await this.inputFlightPassenger.click();
        await expect(this.passengerPopup).toBeDisplayed();
      }
      for (const [key, value] of Object.entries(passengers)) {
        const inputEle = await this.inputPassengersPopup(key as any);
        let currentValue = await inputEle.getValue();
        const gap = value - parseInt(currentValue);
        for (let i = 0; i < gap; i++) {
          const increaseBtn = await this.increasePsgBtn(key as any);
          await increaseBtn.waitForClickable();
          await increaseBtn.click();
        }
        currentValue = await inputEle.getValue();
        expect(parseInt(currentValue)).toEqual(value);
      }
    }
  }
}

export default new HomePage();
