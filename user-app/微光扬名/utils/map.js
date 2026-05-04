export const MAP_APPS = {
  gaode: {
    name: '高德地图',
    scheme: 'iosamap://',
    icon: '🗺️'
  },
  baidu: {
    name: '百度地图',
    scheme: 'baidumap://',
    icon: '🧭'
  },
  tencent: {
    name: '腾讯地图',
    scheme: 'qqmap://',
    icon: '📍'
  }
}

export function buildGaodeNavigationUrl(lat, lng, name) {
  const encodedName = encodeURIComponent(name)
  return `iosamap://path?sourceApplication=微光扬名&slat=&slon=&sname=我的位置&dlat=${lat}&dlon=${lng}&dname=${encodedName}&dev=0&m=0&t=0`
}

export function buildBaiduNavigationUrl(lat, lng, name) {
  const encodedName = encodeURIComponent(name)
  return `baidumap://map/direction?origin=name:我的位置|latlng:,&destination=name:${encodedName}|latlng:${lat},${lng}&mode=driving&coord_type=gcj02`
}

export function buildTencentNavigationUrl(lat, lng, name) {
  const encodedName = encodeURIComponent(name)
  return `qqmap://map/routePlan?from=我的位置&fromcoord=,&to=${encodedName}&tocoord=${lat},${lng}&type=drive&coord_type=gcj02`
}

export function checkMapAppAvailable(scheme) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve(false)
    }, 500)

    if (uni.getSystemInfoSync().platform === 'ios') {
      plus.runtime.isApplicationExist({
        appid: scheme.startsWith('iosamap') ? 'com.autonavi.minimap' :
              scheme.startsWith('baidumap') ? 'com.baidu.BaiduMap' :
              scheme.startsWith('qqmap') ? 'com.tencent.map' : '',
        success: (res) => {
          clearTimeout(timeout)
          resolve(res)
        },
        fail: () => {
          clearTimeout(timeout)
          resolve(false)
        }
      })
    } else {
      const appId = scheme.startsWith('iosamap') ? 'com.autonavi.minimap' :
                    scheme.startsWith('baidumap') ? 'com.baidu.BaiduMap' :
                    scheme.startsWith('qqmap') ? 'com.tencent.map' : ''
      plus.runtime.isApplicationExist({
        appid: appId,
        success: (res) => {
          clearTimeout(timeout)
          resolve(res)
        },
        fail: () => {
          clearTimeout(timeout)
          resolve(false)
        }
      })
    }
  })
}

export async function openMapNavigation(lat, lng, name) {
  if (!lat || !lng) {
    uni.showToast({
      title: '该柜机暂无位置信息',
      icon: 'none'
    })
    return
  }

  const navOptions = []

  navOptions.push({
    id: 'gaode',
    name: '高德地图',
    icon: '🗺️',
    url: buildGaodeNavigationUrl(lat, lng, name)
  })

  navOptions.push({
    id: 'baidu',
    name: '百度地图',
    icon: '🧭',
    url: buildBaiduNavigationUrl(lat, lng, name)
  })

  navOptions.push({
    id: 'tencent',
    name: '腾讯地图',
    icon: '📍',
    url: buildTencentNavigationUrl(lat, lng, name)
  })

  uni.showActionSheet({
    itemList: navOptions.map(item => `${item.icon} ${item.name}`),
    success: async (res) => {
      const selectedApp = navOptions[res.tapIndex]
      if (!selectedApp) return

      try {
        await new Promise((resolve, reject) => {
          plus.runtime.openURL(selectedApp.url, (res) => {
            resolve(res)
          }, (err) => {
            reject(err)
          })
        })
      } catch (err) {
        console.error('打开地图失败:', err)
        uni.showToast({
          title: '未找到该地图应用',
          icon: 'none'
        })
      }
    }
  })
}

export default {
  MAP_APPS,
  buildGaodeNavigationUrl,
  buildBaiduNavigationUrl,
  buildTencentNavigationUrl,
  checkMapAppAvailable,
  openMapNavigation
}
