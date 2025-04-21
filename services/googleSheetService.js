const { google } = require("googleapis");
const fs = require("fs");

const credentialsPath = process.env.GOOGLE_CREDENTIALS;
const sheetId = process.env.GOOGLE_SHEET_ID;
const sheetName = process.env.GOOGLE_SHEET_NAME;

if (!credentialsPath || !sheetId || !sheetName) {
  throw new Error("🔴 Missing required environment variables: GOOGLE_CREDENTIALS, SHEET_ID, SHEET_NAME");
};

class GoogleSheetService {
  constructor() {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }
 
  // to initialize the Google Sheets API client
  async init() {
    this.client = await this.auth.getClient();
    this.sheets = google.sheets({ version: "v4", auth: this.client });
  }

  // to read a cell
  async readCell(cell) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!${cell}`,
    });
    return response.data.values?.[0]?.[0] || null;
  }

  // to fill a cell
  async writeCell(cell, value) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!${cell}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[value]],
      },
    });
  }

  // to read a column
  async readColumn(columnRange) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${sheetName}!${columnRange}`,
    });
    return response.data.values?.flat() || [];
  }

  // to fill a column
  async writeColumn(startCell, valuesArray) {
    const values = valuesArray.map((v) => [v]);
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!${startCell}`,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });
  }
}

module.exports = new GoogleSheetService();
