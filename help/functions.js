const _ = require("lodash");

function sortDieuXe(xe, list) {
  let sortable = [];
  let tmp = {};
  for (var daiLy in list) {
    sortable.push([daiLy, list[daiLy]]);
  }
  sortable.sort(function (a, b) {
    return b[1]["soLanVanChuyen"] - a[1]["soLanVanChuyen"];
  });

  for (let index = 0; index < 12; index++) {
    let key = sortable[index][0];
    let value = sortable[index][1];
    let o = {
      [key]: value,
    };
    tmp = {
      ...tmp,
      [key]: value,
    };
  }
  return tmp;
}

function xulyDataDieuXe(dataDieuXe) {
  let arrXe = Object.keys(dataDieuXe);
  let arrDanhSachDaiLy = [];
  let result = {};

  arrXe.forEach(xe => {
    for (let i = 0; i < dataDieuXe[xe].item.length; i++) {
      // kiem tra dai ly co ton tai trong mang, neu chua them vao
      let tenDaiLy = dataDieuXe[xe].item[i]["shippingCollectionSource"];
      let soLuongBinh = parseInt(dataDieuXe[xe].item[i]["productCount"]);
      let diaChi = dataDieuXe[xe].item[i]["shippingCollectionDestination"];
      if (!result.hasOwnProperty(xe)) {
        result[xe] = {};
      }
      if (arrDanhSachDaiLy.indexOf(tenDaiLy) < 0) {
        arrDanhSachDaiLy.push(tenDaiLy);
        result[xe][tenDaiLy] = {
          soLanVanChuyen: 0,
          tongSoLuongBinh: 0,
          diaChi,
        };
      }
      result[xe][tenDaiLy]["soLanVanChuyen"] =
        result[xe][tenDaiLy]["soLanVanChuyen"] + 1;
      result[xe][tenDaiLy]["tongSoLuongBinh"] =
        result[xe][tenDaiLy]["tongSoLuongBinh"] + soLuongBinh;
    }
    arrDanhSachDaiLy = [];
    let sort = sortDieuXe(xe, result[xe]);
    result[xe] = sort;
  });

  return result;
}

function gopDonDaiLy(tong_don_theo_so_phieu) {
  let first_don_hang = tong_don_theo_so_phieu[0];
  let ma_so_phieu = first_don_hang["Mã số phiếu"];
  let ten_khach_hang = first_don_hang["Khách hàng"];
  let tong_so_luong = first_don_hang["Tổng số lượng"];
  let details = {
    _6kg: 0,
    _12kg: 0,
    _12kg5: 0,
    _45kg: 0,
    _50kg: 0,
  };
  let tong_so_binh_quet = 0;
  _.forEach(tong_don_theo_so_phieu, function (o) {
    switch (o["Dung lượng"]) {
      case "6kg":
        details["_6kg"] += 1;
        break;
      case "12kg":
        details["_12kg"] += 1;
        break;
      case "12.5kg":
        details["_12kg5"] += 1;
        break;
      case "45kg":
        details["_45kg"] += 1;
        break;
      case "50kg":
        details["_50kg"] += 1;
        break;
      default:
        break;
    }
  });

  tong_so_binh_quet = Object.values(details).reduce((a, b) => a + b, 0);
  return {
    ma_so_phieu,
    ten_khach_hang,
    tong_so_luong,
    details,
    tong_so_binh_quet,
  };
}

function gopKhachHangTrungTen(danh_sach_don_hang) {
  let ten_khach_hang_arr = [];
  let clone_dsdh = _.cloneDeep(danh_sach_don_hang);
  _.forEach(danh_sach_don_hang, function (o) {
    if (ten_khach_hang_arr.indexOf(o["ten_khach_hang"]) < 0) {
      ten_khach_hang_arr.push(o["ten_khach_hang"]);
    }
  });

  let result = [];
  _.forEach(ten_khach_hang_arr, function (ten_khach_hang, i) {
    let tmp = _.filter(clone_dsdh, function (o) {
      return o["ten_khach_hang"] == ten_khach_hang;
    });
    if (tmp.length > 1) {
      let tsl = 0;
      let sum_details = { _6kg: 0, _12kg: 0, _12kg5: 0, _45kg: 0, _50kg: 0 };
      let tsbq = 0;
      _.forEach(tmp, function (obj) {
        tsl += parseInt(obj["tong_so_luong"]);
        tsbq += parseInt(obj["tong_so_binh_quet"]);
        sum_details["_6kg"] += parseInt(obj["details"]["_6kg"]);
        sum_details["_12kg"] += parseInt(obj["details"]["_12kg"]);
        sum_details["_12kg5"] += parseInt(obj["details"]["_12kg5"]);
        sum_details["_45kg"] += parseInt(obj["details"]["_45kg"]);
        sum_details["_50kg"] += parseInt(obj["details"]["_50kg"]);
      });
      tmp = {
        ten_khach_hang: tmp[0]["ten_khach_hang"],
        tong_so_luong: tsl,
        details: sum_details,
        tong_so_binh_quet: tsbq,
        dia_chi_dai_ly: tmp[0]["dia_chi_dai_ly"],
      };
      result.push(tmp);
    } else {
      result.push(tmp[0]);
    }
  });
  return result;
}

function gopDonTheoKhuVuc(danh_sach_don_hang) {
  let ten_khu_vuc_arr = [];
  let clone_dsdh = _.cloneDeep(danh_sach_don_hang);
  _.forEach(danh_sach_don_hang, function (o) {
    if (ten_khu_vuc_arr.indexOf(o["dia_chi_dai_ly"]) < 0) {
      ten_khu_vuc_arr.push(o["dia_chi_dai_ly"]);
    }
  });

  let result = [];
  _.forEach(ten_khu_vuc_arr, function (ten_khu_vuc, i) {
    let tmp = _.filter(clone_dsdh, function (o) {
      return o["dia_chi_dai_ly"] == ten_khu_vuc;
    });
    if (tmp.length > 1) {
      let tsl = 0;
      let sum_details = { _6kg: 0, _12kg: 0, _12kg5: 0, _45kg: 0, _50kg: 0 };
      let tsbq = 0;
      _.forEach(tmp, function (obj) {
        tsl += parseInt(obj["tong_so_luong"]);
        tsbq += parseInt(obj["tong_so_binh_quet"]);
        sum_details["_6kg"] += parseInt(obj["details"]["_6kg"]);
        sum_details["_12kg"] += parseInt(obj["details"]["_12kg"]);
        sum_details["_12kg5"] += parseInt(obj["details"]["_12kg5"]);
        sum_details["_45kg"] += parseInt(obj["details"]["_45kg"]);
        sum_details["_50kg"] += parseInt(obj["details"]["_50kg"]);
      });
      tmp = {
        dia_chi_dai_ly: tmp[0]["dia_chi_dai_ly"],
        tong_so_luong: tsl,
        details: sum_details,
        tong_so_binh_quet: tsbq,
      };
      result.push(tmp);
    } else {
      result.push(tmp[0]);
    }
  });
  return result;
}

async function getTextInElement(page, selector) {
  let element = await page.$(selector);
  let value = await page.evaluate(el => el.textContent.trim().replace(": ", ''), element);
  return value;
}


module.exports = {
  xulyDataDieuXe,
  gopDonDaiLy,
  gopKhachHangTrungTen,
  gopDonTheoKhuVuc,
  getTextInElement
};
