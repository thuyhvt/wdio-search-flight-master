import { $ } from "@wdio/globals";
import Page from "./page.js";

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomePage extends Page {

  public btnChooseLocation(name: "From" | "To") {
    return $(`//input[@name='${name}']`);
  }

  public get popupFlightFrom() {
    return $(".flight_from_destination");
  }

  public get popupFlightTo() {
    return $(".flight_to_destination");
  }

  public get inputFlightFromPopup() {
    return $(`.flight_from_destination input[data-id='flight_from']`);
  }

  public get inputFlightToPopup() {
    return $(`.flight_to_destination input[data-id='flight_to']`);
  }

  public get listSuggestLocation() {
    return $(".tt-dropdown-menu");
  }

  public get inputfightPassenger() {
    return $("input#flight_passenger");
  }

  public get popupFlightPassenger() {
    return $(".pop-flight-passenger");
  }

  public inputDateFlight(type: "Depart" | "Return") {
    return $(`//input[@name='${type}']`);
  }

  public inputPassengerPopup(type: "adults" | "children" | "infants") {
    return $(`input[data-name='nb_${type}']`);
  }

  public get btnsearchFlight() {
    return $("button#search_button");
  }

  public plusBtn(type: "adults" | "children" | "infants") {
    return $(
      `//div[ancestor::*[contains(@class,'pop-flight-passenger')] and @data-field='nb_${type}' and @data-type='plus']//i`
    );
  }
  
  public async homeSearchMenu(tab: string) {
    return await $(`[data-id=${tab}]`);
  }

  public async selectHomeTab(
    tabName: "Vé máy bay" | "Khách sạn" | "Tour du lịch"
  ): Promise<void> {
    let tab = ""
    switch(tabName) {
      case 'Vé máy bay':
        tab = 'flight'
        break;
      case 'Khách sạn':
        tab = 'hotel'
        break;
      default:
        tab = 'tour'
    }
    await (await this.homeSearchMenu(tab)).click()
  }

  public async selectLocationFlight(type: "From" | "To", des: string) {
    let selectFlightBtn = await this.btnChooseLocation(type);
    await selectFlightBtn.click();
    let popup =
      type == "From" ? await this.popupFlightFrom : await this.popupFlightTo;
    let input =
      type == "From" ? await this.inputFlightFromPopup : await this.inputFlightToPopup;
    await expect(popup).toBeDisplayed;
    await expect(input).toBeDisplayed();
    await input.addValue(des);
    let listSuggest = await $(`strong.tt-highlight.*=${des}`);
    await expect(listSuggest).toBeExisting();
    await listSuggest.click();
  }

  public async setDate(
    type: "Depart" | "Return",
    date: string
  ): Promise<void> {
    let inputDate = await this.inputDateFlight(type);
    let eleInput = type == "Depart" ? "#departure_date_flight" : "#returning_date_flight";
    await browser.execute((ele) => {
      let input = document.querySelector(ele);
      input?.removeAttribute("readonly");
    }, eleInput);
    await inputDate.setValue(date);
  }

  public async setPassengers(passengers?: {
    adults?: number;
    children?: number;
    infants?: number;
  }) {
    if (passengers) {
      await this.inputfightPassenger.click();
      await expect(this.popupFlightPassenger).toBeDisplayed();
      for (let [key, value] of Object.entries(passengers)) {
        let inputEle = await this.inputPassengerPopup(key as any);
        let currentValue = await inputEle.getValue();
        let gap = value - parseInt(currentValue);
        for (let i = 0; i < gap; i++) {
          let increaseBtn = await this.plusBtn(key as any);
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
