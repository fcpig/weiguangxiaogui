<template>
  <view class="map-container">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

    <view class="nav-header">
      <view class="nav-bar">
        <view class="back-btn" @tap="handleBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">小柜位置</text>
      </view>
    </view>

    <view class="map-wrapper">
      <view class="map-container" @tap="onMapContainerTap">
        <view class="map-grid">
          <view class="grid-line horizontal" v-for="i in 8" :key="'h'+i"></view>
          <view class="grid-line vertical" v-for="i in 6" :key="'v'+i"></view>
        </view>

        <view
          class="cabinet-marker"
          v-for="cabinet in cabinetList"
          :key="cabinet.id"
          :style="getMarkerStyle(cabinet)"
          @tap="selectCabinet(cabinet)"
        >
          <view class="marker-icon" :class="{ selected: selectedCabinet?.id === cabinet.id }">
            <text>🏪</text>
          </view>
          <view class="marker-pulse" v-if="selectedCabinet?.id === cabinet.id"></view>
        </view>

        <view class="user-location-marker" v-if="userLocation">
          <view class="user-dot"></view>
          <view class="user-pulse"></view>
        </view>
      </view>

      <view class="location-btn" @tap="getUserLocation">
        <text class="location-icon">📍</text>
      </view>
    </view>

    <view class="cabinet-list" :class="{ expanded: showCabinetDetail }">
      <view class="list-header" @tap="toggleList">
        <text class="list-title">附近小柜 ({{ cabinetList.length }})</text>
        <text class="list-toggle">{{ showCabinetDetail ? '▼' : '▲' }}</text>
      </view>

      <view class="cabinet-detail" v-if="showCabinetDetail && selectedCabinet">
        <view class="detail-header">
          <view class="detail-icon">
            <text class="detail-emoji">🏪</text>
          </view>
          <view class="detail-info">
            <text class="detail-name">{{ selectedCabinet.location_name }}</text>
            <text class="detail-code">{{ selectedCabinet.cabinet_code }}</text>
          </view>
          <view class="detail-status" :class="selectedCabinet.status">
            <text class="status-text">{{ getStatusText(selectedCabinet.status) }}</text>
          </view>
        </view>

        <view class="detail-items" v-if="selectedCabinetItems.length > 0">
          <text class="items-label">可用物资：</text>
          <view class="items-tags">
            <text
              class="item-tag"
              v-for="item in selectedCabinetItems"
              :key="item.id"
            >{{ item.item_name }} ({{ item.current_quantity }})</text>
          </view>
        </view>
        <view class="detail-items" v-else>
          <text class="items-label no-items">暂无可用物资</text>
        </view>

        <view class="detail-distance" v-if="selectedCabinet.distance">
          <text class="distance-text">距离您约 {{ selectedCabinet.distance }} 米</text>
        </view>

        <view class="detail-actions">
          <view class="action-btn navigate-btn" @tap="openNavigation">
            <text class="action-icon">🧭</text>
            <text class="action-text">导航前往</text>
          </view>
        </view>
      </view>

      <scroll-view class="cabinet-scroll" scroll-y v-else>
        <view
          class="cabinet-item"
          v-for="cabinet in sortedCabinetList"
          :key="cabinet.id"
          @tap="selectCabinet(cabinet)"
        >
          <view class="item-icon">
            <text class="item-emoji">🏪</text>
          </view>
          <view class="item-info">
            <text class="item-name">{{ cabinet.location_name }}</text>
            <text class="item-code">{{ cabinet.cabinet_code }}</text>
          </view>
          <view class="item-distance" v-if="cabinet.distance">
            <text class="distance-value">{{ cabinet.distance }}</text>
            <text class="distance-unit">米</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCabinetList, getCabinetItems } from '../../utils/api.js'
import { openMapNavigation } from '../../utils/map.js'

const statusBarHeight = ref(0)
const markers = ref<any[]>([])
const cabinetList = ref<any[]>([])
const userLocation = ref<any>(null)
const selectedCabinet = ref<any>(null)
const selectedCabinetItems = ref<any[]>([])
const showCabinetDetail = ref(false)
const loading = ref(false)
const mapCenter = ref({
  latitude: 31.0456,
  longitude: 121.5244
})
const mockMarkers = ref<any[]>([])

const sortedCabinetList = computed(() => {
  return [...cabinetList.value].sort((a, b) => {
    if (a.distance && b.distance) {
      return a.distance - b.distance
    }
    return 0
  })
})

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    online: '在线',
    offline: '离线',
    maintenance: '维护中'
  }
  return statusMap[status] || status
}

const handleBack = () => {
  uni.navigateBack()
}

const onMarkerTap = (e: any) => {
  const markerId = e.detail.markerId
  const cabinet = cabinetList.value.find(c => c.id === markerId)
  if (cabinet) {
    selectCabinet(cabinet)
  }
}

const onMapTap = () => {
  showCabinetDetail.value = false
  selectedCabinet.value = null
}

const onMapContainerTap = () => {
  showCabinetDetail.value = false
  selectedCabinet.value = null
}

const selectCabinet = async (cabinet: any) => {
  selectedCabinet.value = cabinet
  showCabinetDetail.value = true

  try {
    const items = await getCabinetItems(cabinet.cabinet_code)
    selectedCabinetItems.value = items || []
  } catch (error) {
    console.error('获取物资列表失败:', error)
    selectedCabinetItems.value = []
  }
}

const getMarkerStyle = (cabinet: any) => {
  const baseX = 50
  const baseY = 50
  const offsetX = (cabinet.id ? (cabinet.id.charCodeAt(0) % 10 - 5) * 8 : 0)
  const offsetY = (cabinet.id ? (cabinet.id.charCodeAt(cabinet.id.length - 1) % 10 - 5) * 6 : 0)

  return {
    left: `${baseX + offsetX}%`,
    top: `${baseY + offsetY}%`
  }
}

const toggleList = () => {
  if (selectedCabinet.value) {
    showCabinetDetail.value = false
    selectedCabinet.value = null
  }
}

const getUserLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      userLocation.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }

      mapCenter.value = {
        latitude: res.latitude,
        longitude: res.longitude
      }

      calculateDistances()
    },
    fail: (err) => {
      console.error('获取位置失败:', err)
      uni.showToast({
        title: '请开启位置权限',
        icon: 'none'
      })
    }
  })
}

const calculateDistances = () => {
  if (!userLocation.value) return

  cabinetList.value.forEach(cabinet => {
    if (cabinet.location_lat && cabinet.location_lng) {
      const distance = calculateDistance(
        userLocation.value.latitude,
        userLocation.value.longitude,
        cabinet.location_lat,
        cabinet.location_lng
      )
      cabinet.distance = Math.round(distance)
    }
  })
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const openNavigation = () => {
  if (!selectedCabinet.value) return

  const { location_lat, location_lng, location_name } = selectedCabinet.value

  if (!location_lat || !location_lng) {
    uni.showToast({
      title: '该柜机暂无位置信息',
      icon: 'none'
    })
    return
  }

  openMapNavigation(location_lat, location_lng, location_name)
}

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0
    }
  })

  loadCabinetData()
  getUserLocation()
})

const loadCabinetData = async () => {
  loading.value = true
  try {
    const data = await getCabinetList()
    cabinetList.value = data || []

    if (data && data.length > 0) {
      const firstCabinet = data[0]
      if (firstCabinet.location_lat && firstCabinet.location_lng) {
        mapCenter.value = {
          latitude: firstCabinet.location_lat,
          longitude: firstCabinet.location_lng
        }
      }
    }
  } catch (error) {
    console.error('加载柜机数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8F8F8;
}

.status-bar {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
}

.nav-header {
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  padding: 20rpx 30rpx 50rpx;
  padding-top: 0;
  position: relative;
}

.nav-header::after {
  content: '';
  position: absolute;
  bottom: -24rpx;
  left: 0;
  right: 0;
  height: 48rpx;
  background: linear-gradient(135deg, #FF9955 0%, #FF824D 100%);
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  transform: scaleY(0.5);
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 44rpx;
  position: relative;
  z-index: 2;
}

.back-btn {
  position: absolute;
  left: 20rpx;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #FFFFFF;
  font-weight: bold;
}

.nav-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: 4rpx;
}

.map-wrapper {
  position: relative;
  flex: 1;
  min-height: 500rpx;
  background: linear-gradient(135deg, #E8F4F8 0%, #D1E8ED 50%, #B8DDE5 100%);
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.3;
}

.grid-line {
  position: absolute;
  background: #94C9D8;
}

.grid-line.horizontal {
  left: 0;
  right: 0;
  height: 2rpx;
}

.grid-line.horizontal:nth-child(1) { top: 12.5%; }
.grid-line.horizontal:nth-child(2) { top: 25%; }
.grid-line.horizontal:nth-child(3) { top: 37.5%; }
.grid-line.horizontal:nth-child(4) { top: 50%; }
.grid-line.horizontal:nth-child(5) { top: 62.5%; }
.grid-line.horizontal:nth-child(6) { top: 75%; }
.grid-line.horizontal:nth-child(7) { top: 87.5%; }

.grid-line.vertical {
  top: 0;
  bottom: 0;
  width: 2rpx;
}

.grid-line.vertical:nth-child(9) { left: 16.67%; }
.grid-line.vertical:nth-child(10) { left: 33.33%; }
.grid-line.vertical:nth-child(11) { left: 50%; }
.grid-line.vertical:nth-child(12) { left: 66.67%; }
.grid-line.vertical:nth-child(13) { left: 83.33%; }

.cabinet-marker {
  position: absolute;
  transform: translate(-50%, -100%);
  z-index: 10;
}

.marker-icon {
  width: 80rpx;
  height: 80rpx;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  border: 4rpx solid transparent;
}

.marker-icon.selected {
  background: #FF9955;
  border-color: #FFFFFF;
  transform: scale(1.15);
}

.marker-pulse {
  position: absolute;
  bottom: -10rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 40rpx;
  background: radial-gradient(ellipse at center, rgba(255, 153, 85, 0.4) 0%, transparent 70%);
  animation: pulse-ring 1.5s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: translateX(-50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1.5);
    opacity: 0;
  }
}

.user-location-marker {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.user-dot {
  width: 24rpx;
  height: 24rpx;
  background: #3B82F6;
  border-radius: 50%;
  border: 4rpx solid #FFFFFF;
  box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.5);
}

.user-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80rpx;
  height: 80rpx;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  animation: user-pulse 2s ease-out infinite;
}

@keyframes user-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.location-btn {
  position: absolute;
  right: 30rpx;
  bottom: 250rpx;
  width: 96rpx;
  height: 96rpx;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.15);
}

.location-icon {
  font-size: 48rpx;
}

.cabinet-list {
  background: #FFFFFF;
  border-radius: 32rpx 32rpx 0 0;
  box-shadow: 0 -8rpx 32rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-height: 400rpx;
}

.cabinet-list.expanded {
  max-height: 600rpx;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.list-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.list-toggle {
  font-size: 24rpx;
  color: #999999;
}

.cabinet-scroll {
  max-height: 350rpx;
}

.cabinet-item {
  display: flex;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #F8F8F8;
  transition: background 0.15s ease;
}

.cabinet-item:active {
  background: #FFF7ED;
}

.item-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.item-emoji {
  font-size: 40rpx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 6rpx;
}

.item-code {
  font-size: 24rpx;
  color: #999999;
}

.item-distance {
  display: flex;
  align-items: baseline;
}

.distance-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #F97316;
}

.distance-unit {
  font-size: 22rpx;
  color: #999999;
  margin-left: 4rpx;
}

.cabinet-detail {
  padding: 30rpx;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.detail-icon {
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.detail-emoji {
  font-size: 52rpx;
}

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.detail-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #333333;
  margin-bottom: 6rpx;
}

.detail-code {
  font-size: 26rpx;
  color: #999999;
}

.detail-status {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}

.detail-status.online {
  background: #ECFDF5;
  color: #059669;
}

.detail-status.offline {
  background: #FEF2F2;
  color: #DC2626;
}

.detail-status.maintenance {
  background: #FEF3C7;
  color: #D97706;
}

.detail-items {
  margin-bottom: 20rpx;
}

.items-label {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 12rpx;
}

.items-label.no-items {
  color: #999999;
}

.items-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.item-tag {
  padding: 8rpx 16rpx;
  background: #FFF7ED;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #F97316;
}

.detail-distance {
  margin-bottom: 24rpx;
}

.distance-text {
  font-size: 28rpx;
  color: #666666;
}

.detail-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 44rpx;
  transition: transform 0.15s ease;
}

.action-btn:active {
  transform: scale(0.96);
}

.navigate-btn {
  background: linear-gradient(135deg, #FF9A56 0%, #FF6B35 100%);
}

.action-icon {
  font-size: 36rpx;
  margin-right: 8rpx;
}

.action-text {
  font-size: 30rpx;
  font-weight: 600;
  color: #FFFFFF;
}
</style>
