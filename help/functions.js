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

module.exports = { xulyDataDieuXe };
