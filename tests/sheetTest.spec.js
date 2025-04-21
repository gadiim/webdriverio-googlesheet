const sheet = require("../services/googleSheetService");
const webPage = require("../pages/webPage.page");
const sheetRanges = require("../config/sheetRanges");
const selectors = require("../config/webSelectors");

before(async () => {
  await sheet.init();
});

describe("Google Sheets API + Web Page", () => {
  it(`should get webPage value from ${sheetRanges.readCell} and write to ${sheetRanges.writeCell}`, async () => {
    const url = await sheet.readCell(sheetRanges.readCell);

    await webPage.open(url);
    let cellValue = ``;
    try {
      cellValue = await webPage.getValue(selectors.github.fullName);
    } 
    catch (err) {
      console.log(`🔴 Error handling:`, err.message);
      cellValue =`Error`;
    }
    await sheet.writeCell(sheetRanges.writeCell, cellValue);

    console.log(`🟡 URL from: ${sheetRanges.readCell}:`, url || `Empty`);
    console.log(`🟢 Web Page value:`, cellValue);
    console.log(`✅ ${sheetRanges.writeCell} written`);
  });
});

