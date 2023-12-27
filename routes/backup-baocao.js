const express = require("express");
const _ = require("lodash");
const router = express.Router();
const puppeteer = require("puppeteer");
const { getTextInElement, delay } = require("../help/functions");
// Home page route.
router.get("/", function (req, res) {
  res.send("/ben-cat or /hoang-an");
});

// About page route.
router.get("/ben-cat", function (req, res) {
  const date = "26/12/2023";
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

    await page.goto("https://admin.arigatogas.com/vehicle/vehicle-register");
    // chờ loading
    let flag = true;
    let load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }

    // click chọn bán buôn
    await page.click(
      "form.grid > div:nth-child(2) > div:nth-child(3) > .p-element:nth-child(1)"
    );

    await page.click("form.grid > div:nth-child(2) div.p-dropdown");
    // chọn trạng thái đơn hàng
    await page.click(
      "form.grid > div:nth-child(2) div.p-dropdown ul .p-element:nth-child(3)"
    );


    // START chọn ngày
    let inputDateFrom = await page.$(
      "form.grid > div:first-child > div:nth-child(2) div.custom > div:nth-child(1) input"
    );
    // clear INPUT
    let inputValueDateFrom = await page.$eval(
      "form.grid > div:first-child > div:nth-child(2) div.custom > div:nth-child(1) input",
      el => el.value
    );
    await inputDateFrom.focus();
    for (let i = 0; i < inputValueDateFrom.length; i++) {
      await page.keyboard.press("Backspace");
    }
    await inputDateFrom.type(date);

    let inputDateEnd = await page.$(
      "form.grid > div:first-child > div:nth-child(2) div.custom > div:nth-child(3) input"
    );
    // clear INPUT
    let inputValueDateEnd = await page.$eval(
      "form.grid > div:first-child > div:nth-child(2) div.custom > div:nth-child(3) input",
      el => el.value
    );
    await inputDateEnd.focus();
    for (let i = 0; i < inputValueDateEnd.length; i++) {
      await page.keyboard.press("Backspace");
    }
    await inputDateEnd.type(date);
    // END chọn ngày

    // click tìm kiếm
    await page.click("form.grid button.button-air-water");

    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }

    let so_hoa_don = await getTextInElement(
      page,
      "div:nth-child(1) span:nth-child(1) > label:nth-child(1)"
    );
    let value_so_hoa_don = await getTextInElement(
      page,
      "div:nth-child(1) span:nth-child(1) > label:nth-child(2)"
    );
    let so_dieu_phoi = await getTextInElement(
      page,
      "div:nth-child(1) span:nth-child(2) > label:nth-child(1)"
    );
    let value_so_dieu_phoi = await getTextInElement(
      page,
      "div:nth-child(1) span:nth-child(2) > label:nth-child(2)"
    );

    let don_hang = {
      [so_hoa_don]: value_so_hoa_don,
      [so_dieu_phoi]: value_so_dieu_phoi,
    };

    // START Vận chuyển giữa các chi nhánh
    // hủy chọn bán buôn 
    await page.click(
      "form.grid > div:nth-child(2) > div:nth-child(3) > .p-element:nth-child(1)"
    );
    
    // click chọn Vận chuyển giữa các chi nhánh
    await page.click(
      "form.grid > div:nth-child(2) > div:nth-child(3) > .p-element:nth-child(2)"
    );
    // click tìm kiếm
    await page.click("form.grid button.button-air-water");
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    const van_chuyen_giua_chi_nhanh = await page.evaluate(() => {
      const tds = Array.from(
        document.querySelectorAll(
          "div.p-datatable-gridlines.cursor-pointer table tr td"
        )
      );
      return tds.map(td => td.innerText);
    });
    let chunk_van_chuyen_giua_chi_nhanh = _.chunk(
      van_chuyen_giua_chi_nhanh,
      13
    );
    // END Vận chuyển giữa các chi nhánh

    // START Vận chuyển đến nơi đổi vỏ bình
    // hủy chọn Vận chuyển giữa các chi nhánh
    await page.click(
      "form.grid > div:nth-child(2) > div:nth-child(3) > .p-element:nth-child(2)"
    );
    // click chọn Vận chuyển đến nơi đổi vỏ bình
    await page.click(
      "form.grid > div:nth-child(2) > div:nth-child(3) > .p-element:nth-child(4)"
    );
    // click tìm kiếm
    await page.click("form.grid button.button-air-water");
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    const van_chuyen_doi_vo_binh = await page.evaluate(() => {
      const tds = Array.from(
        document.querySelectorAll(
          "div.p-datatable-gridlines.cursor-pointer table tr td"
        )
      );
      return tds.map(td => td.innerText);
    });
    let chunk_van_chuyen_doi_vo_binh = _.chunk(van_chuyen_doi_vo_binh, 13);
    // END Vận chuyển đến nơi đổi vỏ bình

    // START Vận chuyển đi chiết nạp
    // hủy chọn Vận chuyển đến nơi đổi vỏ bình
    await page.click(
      "form.grid > div:nth-child(2) > div:nth-child(3) > .p-element:nth-child(4)"
    );
    // click chọn Vận chuyển đi chiết nạp
    await page.click(
      "form.grid > div:nth-child(2) > div:nth-child(3) > .p-element:nth-child(5)"
    );
    // click tìm kiếm
    await page.click("form.grid button.button-air-water");
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    const van_chuyen_di_chiet_nap = await page.evaluate(() => {
      const tds = Array.from(
        document.querySelectorAll(
          "div.p-datatable-gridlines.cursor-pointer table tr td"
        )
      );
      return tds.map(td => td.innerText);
    });
    let chunk_van_chuyen_di_chiet_nap = _.chunk(van_chuyen_di_chiet_nap, 13);
    // END Vận chuyển giữa các chi nhánh

    // Thống kê xe khách
    await page.goto("https://admin.arigatogas.com/whole-sale/wholesale-list");
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    // START chọn ngày
    let inputDateXeKhachFrom = await page.$(
      "div.card form > div:last-child > div:nth-child(3) > div:last-child div > div:first-child input"
    );
    // clear INPUT
    let inputValueDateXeKhachFrom = await page.$eval(
      "div.card form > div:last-child > div:nth-child(3) > div:last-child div > div:first-child input",
      el => el.value
    );
    await inputDateXeKhachFrom.focus();
    for (let i = 0; i < inputValueDateXeKhachFrom.length; i++) {
      await page.keyboard.press("Backspace");
    }
    await inputDateXeKhachFrom.type(date);

    let inputDateXeKhachEnd = await page.$(
      "div.card form > div:last-child > div:nth-child(3) > div:last-child div > div:last-child input"
    );
    // clear INPUT
    let inputValueDateXeKhachEnd = await page.$eval(
      "div.card form > div:last-child > div:nth-child(3) > div:last-child div > div:last-child input",
      el => el.value
    );
    await inputDateXeKhachEnd.focus();
    for (let i = 0; i < inputValueDateXeKhachEnd.length; i++) {
      await page.keyboard.press("Backspace");
    }
    await inputDateXeKhachEnd.type(date);
    // END chọn ngày

    // Tìm đại lý xe khách

    let list = [
      "TĐL-003CÔNG TY TNHH MỘT THÀNH VIÊN HÙNG HÀO PHÁT",
      "ĐL-196CÔNG TY TNHH THƯƠNG MẠI KHÍ HÓA LỎNG HƯỚNG DƯƠNG",
      "TĐL-006CÔNG TY TNHH DẦU KHÍ CHÍNH SỸ",
      "ĐL-093CỬA HÀNG BÁN LẺ LPG CHAI GAS TRÚC",
      "ĐL-413TÂN THÁI DƯƠNG",
      "ĐL-004CÔNG TY TNHH MỘT THÀNH VIÊN THƯƠNG MẠI - DỊCH VỤ VĂN THANH",
    ];
    let resultDaiLyXeKhach = {};
    // Hủy chọn trạng thái
    await page.click(
      "div.form-group form > div:first-child > div:nth-child(4) i.p-dropdown-clear-icon"
    );
    await page.click(
      "div.form-group form > div:first-child > div:first-child > div:last-child"
    );
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      // click vào ô input đại lý

      console.log(element);
      let inputDaily = await page.$(
        "div.form-group form > div:first-child > div:first-child > div:last-child div.p-dropdown div:last-child > div:first-child input"
      );
      if (!inputDaily) {
        await page.click(
          "div.form-group form > div:first-child > div:first-child > div:last-child"
        );
        inputDaily = await page.$(
          "div.form-group form > div:first-child > div:first-child > div:last-child div.p-dropdown div:last-child > div:first-child input"
        );
      }
      await inputDaily.type(element);
      await page.waitForSelector(
        "div.form-group form > div:first-child > div:first-child > div:last-child div.p-dropdown div:last-child > div:last-child ul li"
      );
      await page.click(
        "div.form-group form > div:first-child > div:first-child > div:last-child div.p-dropdown div:last-child > div:last-child ul li"
      );
      // click tìm kiếm
      await page.click(
        "div.form-group form > div:last-child > div:last-child button"
      );
      // chờ loading
      flag = true;
      load = (await page.$("div.spinner")) || "";
      while (flag) {
        load = (await page.$("div.spinner")) || "";
        if (!load) {
          flag = false;
        }
      }
      const dataFromTable = await page.evaluate(() => {
        const tds = Array.from(
          document.querySelectorAll(
            "div.card > div:last-child > div:last-child table tbody tr td"
          )
        );
        return tds.map(td => td.innerText);
      });
      let chunk_dataFromTable = _.chunk(dataFromTable, 15);
      resultDaiLyXeKhach[element] = chunk_dataFromTable.length;
      // clear INPUT Đại lý
      await page.click(
        "div.form-group form > div:first-child > div:first-child > div:last-child"
      );
      let inputValueDaiLy = await page.$eval(
        "div.form-group form > div:first-child > div:first-child > div:last-child div.p-dropdown div:last-child > div:first-child input",
        el => el.value
      );

      await inputDaily.focus();
      for (let i = 0; i < inputValueDaiLy.length; i++) {
        await page.keyboard.press("Backspace");
      }
    }

    // lấy dữ liệu số lượng bình đăng ký
    let so_luong_binh_dang_ky = {};
    await page.goto(
      "https://admin.arigatogas.com/gas-cylinders/list-cylinders"
    );
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }

    // chọn phân loại ngày đăng ký
    await page.click(
      "form.border-1 > div:nth-child(3) > div:nth-child(1) div.p-dropdown"
    );
    await page.click(
      "form.border-1 > div:nth-child(3) > div:nth-child(1) div.p-dropdown > div:nth-child(4) ul .p-element:nth-child(1) li"
    );

    // START chọn ngày
    let inputRegisterFrom = await page.$(
      "form.border-1 > div:nth-child(3) > div:nth-child(2) div.custom > div:nth-child(1) input"
    );
    // clear INPUT
    let valueInputRegisterFrom = await page.$eval(
      "form.border-1 > div:nth-child(3) > div:nth-child(2) div.custom > div:nth-child(1) input",
      el => el.value
    );
    await inputRegisterFrom.focus();
    for (let i = 0; i < valueInputRegisterFrom.length; i++) {
      await page.keyboard.press("Backspace");
    }
    await inputRegisterFrom.type(date);

    let inputRegisterEnd = await page.$(
      "form.border-1 > div:nth-child(3) > div:nth-child(2) div.custom > div:nth-child(3) input"
    );
    // clear INPUT
    let valueInputRegisterEnd = await page.$eval(
      "form.border-1 > div:nth-child(3) > div:nth-child(2) div.custom > div:nth-child(3) input",
      el => el.value
    );
    await inputRegisterEnd.focus();
    for (let i = 0; i < valueInputRegisterEnd.length; i++) {
      await page.keyboard.press("Backspace");
    }
    await inputRegisterEnd.type(date);
    // END chọn ngày

    // chọn bình mới
    await page.click(
      "form.border-1 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div.p-dropdown"
    );
    await page.click(
      "form.border-1 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div.p-dropdown ul .p-element:nth-child(1) li"
    );

    // click tìm kiếm
    await page.click(
      "form.border-1 > div:nth-child(3) > div:nth-child(3) button"
    );
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    // lấy số lượng
    let str_so_luong_binh_moi_return = await getTextInElement(
      page,
      ".report-page div label"
    );
    let so_luong_binh_moi = str_so_luong_binh_moi_return.match(/\d+/g)[2];
    so_luong_binh_dang_ky["Bình mới"] = so_luong_binh_moi;

    // lấy số lượng bình phổ thông
    await page.click(
      "form.border-1 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div.p-dropdown"
    );
    await page.click(
      "form.border-1 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div.p-dropdown ul .p-element:nth-child(2) li"
    );
    // click tìm kiếm
    await page.click(
      "form.border-1 > div:nth-child(3) > div:nth-child(3) button"
    );
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    // lấy số lượng
    let str_so_luong_binh_pho_thong_return = await getTextInElement(
      page,
      ".report-page div label"
    );
    let so_luong_binh_pho_thong =
      str_so_luong_binh_pho_thong_return.match(/\d+/g)[2];
    so_luong_binh_dang_ky["Bình phổ thông"] = so_luong_binh_pho_thong;

    // lấy số lượng bình tái chế
    await page.click(
      "form.border-1 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div.p-dropdown"
    );
    await page.click(
      "form.border-1 > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) div.p-dropdown ul .p-element:nth-child(4) li"
    );
    // click tìm kiếm
    await page.click(
      "form.border-1 > div:nth-child(3) > div:nth-child(3) button"
    );
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    // lấy số lượng
    let str_so_luong_binh_tai_che_return = await getTextInElement(
      page,
      ".report-page div label"
    );
    let so_luong_binh_tai_che =
      str_so_luong_binh_tai_che_return.match(/\d+/g)[2];
    so_luong_binh_dang_ky["Bình tái chế"] = so_luong_binh_tai_che;

    // lấy số lượng bình đăng ký tái kiểm định
    await page.goto('https://admin.arigatogas.com/gas-cylinders/list-check-cylinders');
    // chờ loading
    flag = true;
    load = (await page.$("div.spinner")) || "";
    while (flag) {
      load = (await page.$("div.spinner")) || "";
      if (!load) {
        flag = false;
      }
    }
    await page.waitForSelector('table tbody tr')
    let str_so_luong_binh_dang_ky_tai_kiem_dinh_return = await getTextInElement(
      page,
      ".report-page div label"
    );
    let so_luong_binh_dang_ky_tai_kiem_dinh =
      str_so_luong_binh_dang_ky_tai_kiem_dinh_return.match(/\d+/g)[2];

    console.log(so_luong_binh_dang_ky_tai_kiem_dinh)
    await browser.close();
    res.render("bao-cao/ben-cat", {
      data: {
        "Bán buôn": don_hang,
        "Vận chuyển giữa các chi nhánh": chunk_van_chuyen_giua_chi_nhanh,
        "Vận chuyển đổi vỏ bình": chunk_van_chuyen_doi_vo_binh,
        "Vận chuyển đi chiết nạp": chunk_van_chuyen_di_chiet_nap,
        "Xe khách": resultDaiLyXeKhach,
        "Bình đăng ký": {
          "Bình mới": so_luong_binh_moi,
          "Bình phổ thông": so_luong_binh_pho_thong,
          "Bình tái chế": so_luong_binh_tai_che,
          "Số lượng bình tái kiểm định": so_luong_binh_dang_ky_tai_kiem_dinh
        },
      },
    });
  })();
});

router.get("/hoang-an", function (req, res) {
  res.send("Hoang an");
});

module.exports = router;
