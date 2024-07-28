import { browser } from '@wdio/globals'

export default class CommonPage {
    public async navigatetoUrl(url: string) {
        await browser.url(url);
    }
}
