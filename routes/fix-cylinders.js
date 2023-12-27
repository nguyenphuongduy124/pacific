const express = require("express");
const _ = require("lodash");
const router = express.Router();
const puppeteer = require("puppeteer");
const { getTextInElement } = require("../help/functions");
// Home page route.

router.get("/", function (req, res) {
  res.send("kđ");
});
router.get("/sua-kiem-dinh", function (req, res) {
  let updateMonth = "31/12/2023";
  let qrcode = ["9000000062", "9000000060", "9000000058", "9000000052", "9000000045", "9000000035"];

  (async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--start-maximized", // you can also use '--start-fullscreen'
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });
    // Navigate the page to a URL
    await page.goto("https://admin.arigatogas.com/");
    await page.click("div.selected-lang");
    await page.click("div.lang-menu .menu ul li:nth-child(2)");

    let v = await page.$eval("div.lang-menu img", element =>
      element.getAttribute("src")
    );
    if (v === "/assets/img/japan-flag.png") {
      await page.click("div.selected-lang");
      await page.click("div.lang-menu .menu ul li:nth-child(2)");
    }

    await page.type("#userName", "vobinh");
    await page.type("#password", "Vobinh@123");
    await page.click("div.p-checkbox");
    await page.click("button[type=submit]");
    await page.waitForSelector("div.menu-bar > ul > li:nth-child(3)");

    await page.goto("https://admin.arigatogas.com/gas-cylinders/list-cylinders");
    // chờ loading
    let flag = true;
    let load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    // So dinh danh
    let inputSoDinhDanh = await page.$(
      "form.border-1 > div:first-child > div:first-child input"
    );
    // clear INPUT So dinh danh
    let valueSoDinhDanh = await page.$eval(
      "form.border-1 > div:first-child > div:first-child input",
      el => el.value
    );
    // lap qua mang so dinh danh can chinh sua lai ngay kiem dinh
    for (let i = 0; i < qrcode.length; i++) {
      const qr = qrcode[i];
      await inputSoDinhDanh.focus();
      valueSoDinhDanh = await page.$eval(
        "form.border-1 > div:first-child > div:first-child input",
        el => el.value
      );
      for (let i = 0; i < valueSoDinhDanh.length; i++) {
        await page.keyboard.press("Backspace");
      }
      await inputSoDinhDanh.type(qr);
      // click tim kiem
      await page.click("form.border-1 > div:last-child > div:last-child button");
      // chờ loading
      flag = true;
      load = (await page.$("div.spinner")) || "";
      while (flag) {
        load = (await page.$("div.spinner")) || "";
        if (!load) {
          flag = false;
        }
      }
      // click chinh sua
      await page.click("form div.p-datatable-wrapper table tbody > tr:first-child > td:nth-child(14) > div > div:last-child button");

      // Ngay tai kiem dinh
      let inputTaiKiemDinh = await page.$(
        "form.ng-pristine div.p-datatable-wrapper table tbody > tr:first-child > td:nth-child(11) input"
      );
      // clear INPUT So dinh danh
      let valueTaiKiemDinh = await page.$eval(
        "form.ng-pristine div.p-datatable-wrapper table tbody > tr:first-child > td:nth-child(11) input",
        el => el.value
      );
      await inputTaiKiemDinh.focus();
      for (let i = 0; i < valueTaiKiemDinh.length; i++) {
        await page.keyboard.press("Backspace");
      }
      await inputTaiKiemDinh.type(updateMonth);

      // click cap nhat
      await page.click("form div.p-datatable-wrapper table tbody > tr:first-child > td:nth-child(14) > div > div:last-child button");
      // chờ loading
      flag = true;
      load = (await page.$("div.spinner")) || "";
      while (flag) {
        load = (await page.$("div.spinner")) || "";
        if (!load) {
          flag = false;
        }
      }
    }

    res.send("Chuong trinh ket thuc")
  })();
});

module.exports = router;
