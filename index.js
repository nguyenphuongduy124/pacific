const fs = require("fs");
const csv = require("fast-csv");
const _ = require("lodash");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
const { dataDieuXe } = require("./dieuxe.js");
const {
  xulyDataDieuXe,
  gopDonDaiLy,
  gopKhachHangTrungTen,
  gopDonTheoKhuVuc,
} = require("./help/functions.js");

require("dotenv").config();

var low = require("lowdb");
var FileSync = require("lowdb/adapters/FileSync");
const { log } = require("console");
var adapter = new FileSync("db.json");
var db = low(adapter);
db.defaults({
  users: [],
}).write();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});
app.get("/tinh", (req, res) => {
  res.render("index");
});
app.post("/tinh", (req, res) => {
  let a = parseInt(req.body["6kg"]) || 0;
  let b = parseInt(req.body["12kg"]) || 0;
  let c = parseInt(req.body["12.5kg"]) || 0;
  let d = parseInt(req.body["45kg"]) || 0;
  let e = parseInt(req.body["50kg"]) || 0;
  console.log(a);
  let tongTrongLuong = a * 15 + b * 25 + c * 25 + d * 85 + e * 90;
  console.log(tongTrongLuong);
  res.render("index", { tongTrongLuong });
});

app.get("/don-hang", (req, res) => {
  const data = [];
  fs.createReadStream("./files/don-hang.csv")
    .pipe(csv.parse({ headers: true, discardUnmappedColumns: true }))
    .on("error", error => res.json(error))
    .on("data", row => data.push(row))
    .on("end", () => {
      let donHangList = [
        {
          "Đai lý": "HÙNG HÀO PHÁT",
          "Mã số hoá đơn": "5329",
          "Tổng Số lượng": "239",
          "Dung luợng": "12kg",
          "Thương hiệu": "P XÁM",
          "Số lượng": "230",
        },
        {
          "Đai lý": "HÙNG HÀO PHÁT",
          "Mã số hoá đơn": "5329",
          "Tổng Số lượng": "239",
          "Dung luợng": "45kg",
          "Thương hiệu": "PC45",
          "Số lượng": "9",
        },
        {
          "Đai lý": "Ngọc ánh",
          "Mã số hoá đơn": "5328",
          "Tổng Số lượng": "80",
          "Dung luợng": "12kg",
          "Thương hiệu": "P Xám",
          "Số lượng": "50",
        },
        {
          "Đai lý": "Ngọc ánh",
          "Mã số hoá đơn": "5328",
          "Tổng Số lượng": "80",
          "Dung luợng": "12kg",
          "Thương hiệu": "P Xanh Đậm",
          "Số lượng": "20",
        },
        {
          "Đai lý": "Ngọc ánh",
          "Mã số hoá đơn": "5328",
          "Tổng Số lượng": "80",
          "Dung luợng": "12kg",
          "Thương hiệu": "P Shell",
          "Số lượng": "10",
        },
        {
          "Đai lý": "Ngọc Bích",
          "Mã số hoá đơn": "5327",
          "Tổng Số lượng": "100",
          "Dung luợng": "12kg",
          "Thương hiệu": "P Xám",
          "Số lượng": "100",
        },
        {
          "Đai lý": "Hải Âu",
          "Mã số hoá đơn": "5326",
          "Tổng Số lượng": "100",
          "Dung luợng": "12kg",
          "Thương hiệu": "P Xám",
          "Số lượng": "90",
        },
        {
          "Đai lý": "Hải Âu",
          "Mã số hoá đơn": "5326",
          "Tổng Số lượng": "100",
          "Dung luợng": "45kg",
          "Thương hiệu": "PC45",
          "Số lượng": "10",
        },
        {
          "Đai lý": "Trọng Thành",
          "Mã số hoá đơn": "5325",
          "Tổng Số lượng": "100",
          "Dung luợng": "12kg",
          "Thương hiệu": "P Xám",
          "Số lượng": "100",
        },
        {
          "Đai lý": "Ngọc ánh",
          "Mã số hoá đơn": "5333",
          "Tổng Số lượng": "80",
          "Dung luợng": "12kg",
          "Thương hiệu": "P Xám",
          "Số lượng": "30",
        },
      ];

      let cloneDonHang = _.cloneDeep(donHangList);
      let result = [];
      let orders = [];
      for (let i = 0; i < cloneDonHang.length; i++) {
        const element = cloneDonHang[i];
        const maHoaDon = element["Mã số hoá đơn"];
        if (orders.indexOf(maHoaDon) < 0) {
          orders.push(maHoaDon);
        }
      }

      orders.forEach(code => {
        let tmp = cloneDonHang.filter(o => {
          return o["Mã số hoá đơn"] == code;
        });
        let sumOrder = {
          [code]: {
            "Đại lý": tmp[0]["Đai lý"],
            orders: [],
          },
        };

        for (let i = 0; i < tmp.length; i++) {
          const element = tmp[i];
          sumOrder[code]["orders"].push({
            "Dung luợng": element["Dung luợng"],
            "Thương hiệu": element["Thương hiệu"],
            "Số lượng": element["Số lượng"],
          });
        }
        result.push(sumOrder);
      });

      let finalResult = [];
      let daiLyList = [];

      for (let index = 0; index < result.length; index++) {
        const daiLy = result[index][Object.keys(result[index])[0]]["Đại lý"];
        if (!daiLyList.includes(daiLy)) daiLyList.push(daiLy);
      }
      // console.log(daiLyList);
      daiLyList.forEach(name => {
        let obj = {};
        let tmp = result.filter(ele => {
          return ele[Object.keys(ele)[0]]["Đại lý"] == name;
        });
        // console.log(tmp);
        obj[name] = {};
        for (let i = 0; i < tmp.length; i++) {
          console.log(tmp[i][Object.keys(tmp[i])]["orders"]);
        }
        // console.log(obj)
      });
      res.json(donHangList);
    });
});

app.get("/dieuxe", (req, res) => {
  let thongTinDieuXe = xulyDataDieuXe(dataDieuXe);
  res.render("dieuxe/index", {
    data: thongTinDieuXe,
  });
  // res.json(thongTinDieuXe)
});

app.get("/users", (req, res) => {
  res.render("users/index", {
    users: db.get("users").value(),
  });
});
app.get("/users/create", (req, res) => {
  res.render("users/create");
});
app.post("/users/create", (req, res) => {
  users.push(req.body);
  res.redirect("/users");
});
app.get("/users/search", (req, res) => {
  const q = req.query.q;
  const matchedUsers = users.filter(user => {
    return user.name.toLowerCase().indexOf(q) !== -1;
  });
  res.render("users/index", {
    users: matchedUsers,
  });
});

app.get("/xuat-kho", (req, res) => {
  const data = [];
  const danh_sach_dai_ly = [];
  fs.createReadStream("./files/danh-sach-dai-ly.csv")
    .pipe(csv.parse({ headers: true, discardUnmappedColumns: true }))
    .on("error", error => res.json(error))
    .on("data", row => danh_sach_dai_ly.push(row))
    .on("end", () => {
      console.log(danh_sach_dai_ly.length); // lấy danh sách đại lý
      fs.createReadStream("./files/xuat-kho.csv") // bắt đầu lấy danh sách xuất kho
        .pipe(csv.parse({ headers: true, discardUnmappedColumns: true }))
        .on("error", error => res.json(error))
        .on("data", row => data.push(row))
        .on("end", () => {
          let cloneDonHang = _.cloneDeep(data);
          // lấy danh sách mã số phiếu
          let ma_phieu_arr = [];
          for (let i = 0; i < cloneDonHang.length; i++) {
            const ma_phieu = cloneDonHang[i]["Mã số phiếu"];
            if (ma_phieu_arr.indexOf(ma_phieu) < 0) {
              ma_phieu_arr.push(ma_phieu);
            }
          }

          // danh
          let danh_sach_don_hang = [];
          _.forEach(ma_phieu_arr, function (so_phieu) {
            
            let tong_don_theo_so_phieu = _.filter(cloneDonHang, function (o) {
              // or remove
              return o["Mã số phiếu"] == so_phieu;
            });
            let gop_don_hang = gopDonDaiLy(tong_don_theo_so_phieu);
            let first_don_hang = tong_don_theo_so_phieu[0];
            let ten_dai_ly = first_don_hang["Khách hàng"];
            let dai_ly_obj = _.find(danh_sach_dai_ly, function (o) {
              return o["Tên viết tắt"] == ten_dai_ly;
            });

            let dia_chi_dai_ly = dai_ly_obj[`Tỉnh/Thành phố`];
            gop_don_hang["dia_chi_dai_ly"] = dia_chi_dai_ly;
            danh_sach_don_hang.push(gop_don_hang);
          });

          let khach_hang_trung_ten_filter =
            gopKhachHangTrungTen(danh_sach_don_hang);
          let gop_don_theo_khu_vuc = gopDonTheoKhuVuc(
            khach_hang_trung_ten_filter
          );

          res.render("xuat-kho/index", {
            orders: gop_don_theo_khu_vuc,
          });
        });
    });
});
app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
