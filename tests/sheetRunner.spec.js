const sheet = require("../services/googleSheetService");
const webPage = require("../pages/webPage.page");
const sheetRanges = require("../config/sheetRanges");
const selectors = require("../config/webSelectors");

before(async () => {
  await sheet.init();
});

describe("Google Sheets API + webPage (Column Mode)", () => {
  it(`should get webPage values from ${sheetRanges.readRange} and write to column from ${sheetRanges.writeStartCell}`, async () => {
    const urls = await sheet.readColumn(sheetRanges.readRange);

    const cellValues = [];

    for (const url of urls) {
      if (!url) {
        cellValues.push(`Empty URL`);
        continue;
      }

      await webPage.open(url);

      try {
        const cellValue = await webPage.getValue(selectors.github.fullName);
        cellValues.push(cellValue);
      } catch (err) {
        console.log(`🔴 Error handling:`, err.message);
        cellValues.push(`Error`);
      }
    }

    await sheet.writeColumn(sheetRanges.writeStartCell, cellValues);
    console.log(`✅ All data written to column ${sheetRanges.writeStartCell}`);
  });
});
