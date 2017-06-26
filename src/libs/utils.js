// 获取链接参数
export const getUrlParam = function (name) {
  return decodeURIComponent((
    new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)')
      .exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}
// 根据Id 获取名字
export const getNameByIds = function (contacts, ids) {
  if (ids instanceof Array) {

  } else {
    ids = ids.split(',')
  }
  var tempArr = []
  contacts.forEach(function (contactObj) {
    ids.forEach(function (id) {
      if (parseInt(id) === contactObj.id) {
        tempArr.push(contactObj.name)
      }
    })
  })
  return tempArr.join('、')
}
// 判断对象 是否为空
export const isEmptyObject = function (obj) {
  let t
  for (t in obj) {
    return !1
  }
  return !0
}
// 根据生日判断星座
export const getStarSignByDate = function (date) {
  var dateArr = date.split('-'),
    year = parseInt(dateArr[0]),
    month = parseInt(dateArr[1]),
    day = parseInt(dateArr[2]),
    returnObj = {},
    animalArr = '鼠牛虎兔龙蛇马羊猴鸡狗猪',
    starArr = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯",
    starNumArr = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
  //判断星座
  returnObj.constellation = starArr.substr(2 * ( month - (day < starNumArr[month - 1] ? 1 : 0) ), 2) + '座'
  //判断生肖
  returnObj.chineseZodiac = animalArr.charAt((year - 4) % 12)

  return returnObj
}
// 根据生日计算年龄
export const getAgeByDate = function (brith) {
  var aDate = new Date()
  var thisYear = aDate.getYear()
  if (!brith) {
    return null
  }//再加上其他判断
  brith = brith.substr(0, 4)
  return parseInt(thisYear - brith)
}
