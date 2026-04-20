/**
 * 中国省市级联数据（含港澳台及海外选项）
 * 用于"学校所在城市"和"家乡所在城市"下拉联动
 */

export const chinaCities = [
  { province: "北京",   cities: ["北京"] },
  { province: "上海",   cities: ["上海"] },
  { province: "天津",   cities: ["天津"] },
  { province: "重庆",   cities: ["重庆"] },
  {
    province: "广东",
    cities: ["广州", "深圳", "佛山", "东莞", "珠海", "惠州", "中山", "汕头", "湛江"],
  },
  {
    province: "浙江",
    cities: ["杭州", "宁波", "温州", "绍兴", "嘉兴", "金华", "台州", "义乌"],
  },
  {
    province: "江苏",
    cities: ["南京", "苏州", "无锡", "常州", "南通", "扬州", "徐州", "镇江"],
  },
  {
    province: "山东",
    cities: ["济南", "青岛", "烟台", "威海", "潍坊", "淄博", "临沂"],
  },
  {
    province: "四川",
    cities: ["成都", "绵阳", "德阳", "南充", "宜宾"],
  },
  {
    province: "湖北",
    cities: ["武汉", "宜昌", "襄阳", "黄石", "荆州"],
  },
  {
    province: "湖南",
    cities: ["长沙", "株洲", "湘潭", "衡阳", "常德"],
  },
  {
    province: "陕西",
    cities: ["西安", "咸阳", "宝鸡", "延安", "榆林"],
  },
  {
    province: "河南",
    cities: ["郑州", "洛阳", "开封", "新乡", "南阳", "许昌"],
  },
  {
    province: "河北",
    cities: ["石家庄", "保定", "唐山", "廊坊", "秦皇岛", "雄安新区"],
  },
  {
    province: "福建",
    cities: ["福州", "厦门", "泉州", "漳州", "莆田"],
  },
  {
    province: "辽宁",
    cities: ["沈阳", "大连", "鞍山", "锦州", "抚顺"],
  },
  {
    province: "安徽",
    cities: ["合肥", "芜湖", "马鞍山", "蚌埠", "安庆"],
  },
  {
    province: "江西",
    cities: ["南昌", "赣州", "九江", "景德镇", "上饶"],
  },
  {
    province: "云南",
    cities: ["昆明", "大理", "丽江", "曲靖", "玉溪"],
  },
  {
    province: "贵州",
    cities: ["贵阳", "遵义", "六盘水", "毕节"],
  },
  {
    province: "广西",
    cities: ["南宁", "桂林", "柳州", "梧州", "北海"],
  },
  {
    province: "黑龙江",
    cities: ["哈尔滨", "大庆", "齐齐哈尔", "绥化", "牡丹江"],
  },
  {
    province: "吉林",
    cities: ["长春", "吉林市", "四平", "延吉"],
  },
  {
    province: "山西",
    cities: ["太原", "大同", "运城", "临汾", "长治"],
  },
  {
    province: "内蒙古",
    cities: ["呼和浩特", "包头", "鄂尔多斯", "赤峰", "通辽"],
  },
  {
    province: "甘肃",
    cities: ["兰州", "天水", "白银", "嘉峪关"],
  },
  {
    province: "海南",
    cities: ["海口", "三亚", "儋州"],
  },
  {
    province: "新疆",
    cities: ["乌鲁木齐", "喀什", "伊宁", "库尔勒"],
  },
  {
    province: "西藏",
    cities: ["拉萨", "日喀则", "林芝"],
  },
  {
    province: "宁夏",
    cities: ["银川", "吴忠", "固原"],
  },
  {
    province: "青海",
    cities: ["西宁", "海东"],
  },
  {
    province: "香港",
    cities: ["香港"],
  },
  {
    province: "澳门",
    cities: ["澳门"],
  },
  {
    province: "台湾",
    cities: ["台北", "台中", "高雄", "台南"],
  },
  {
    province: "海外",
    cities: [
      "美国",
      "英国",
      "澳大利亚",
      "加拿大",
      "新加坡",
      "日本",
      "德国",
      "法国",
      "荷兰",
      "香港（院校）",
      "其他",
    ],
  },
];

export const SINGLE_LEVEL_PROVINCES = new Set([
  "北京",
  "上海",
  "天津",
  "重庆",
  "香港",
  "澳门",
]);

/** 根据省份名称获取城市列表 */
export function getCitiesByProvince(provinceName) {
  const entry = chinaCities.find((p) => p.province === provinceName);
  return entry ? entry.cities : [];
}

export function isSingleLevelProvince(provinceName) {
  return SINGLE_LEVEL_PROVINCES.has(provinceName);
}

export function normalizeCityValue(provinceName, cityName) {
  if (isSingleLevelProvince(provinceName)) {
    const [singleLevelCity = ""] = getCitiesByProvince(provinceName);
    return singleLevelCity;
  }

  return (cityName ?? "").trim();
}
