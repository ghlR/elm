/*
 * 存储数据
 *id:商家id,key:属性，value值
 *@example saveTocal(this.seller.id, a, b)
 * */
export function saveToLocal(id, key, value) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  window.localStorage.__seller__ = JSON.stringify(seller)
}
/*
 * 读取数据
 * id:商家id，key:读取的属性，def:默认的值
 *@example loadFromLocal(this.seller.id, a, false)
 * @return Object[key]
 * */
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
