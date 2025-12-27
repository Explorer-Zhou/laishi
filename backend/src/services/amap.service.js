const axios = require('axios');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

class AmapService {
  constructor() {
    this.apiKey = process.env.AMAP_KEY;
    this.baseUrl = 'https://restapi.amap.com/v3';
  }

  // 根据食物名称搜索附近提供该食物的店铺
  async searchNearbyFoodShops(foodName, location, radius = 5000, page = 1, offset = 10) {
    try {
      const url = `${this.baseUrl}/place/text`;
      
      const params = {
        key: this.apiKey,
        keywords: `${foodName} 餐馆`,
        location: location, // 格式：经度,纬度
        radius: radius,
        page: page,
        offset: offset,
        output: 'JSON',
        city: '',
        citylimit: false,
        extensions: 'base'
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status === '1') {
        return this._formatShopResults(response.data.pois);
      } else {
        console.error('高德地图API错误:', response.data.info);
        throw new Error('搜索附近店铺失败');
      }
    } catch (error) {
      console.error('高德地图服务错误:', error);
      throw new Error('获取附近店铺信息失败');
    }
  }

  // 格式化店铺搜索结果
  _formatShopResults(pois) {
    return pois.map(poi => ({
      id: poi.id,
      name: poi.name,
      address: poi.address,
      location: {
        longitude: poi.location.split(',')[0],
        latitude: poi.location.split(',')[1]
      },
      phone: poi.tel || '',
      rating: poi.rating || 0,
      distance: poi.distance || 0,
      type: poi.type,
      businessArea: poi.business_area || ''
    }));
  }

  // 根据地址获取经纬度
  async getGeoCode(address, city = '') {
    try {
      const url = `${this.baseUrl}/geocode/geo`;
      
      const params = {
        key: this.apiKey,
        address: address,
        city: city,
        output: 'JSON'
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status === '1' && response.data.geocodes.length > 0) {
        const geocode = response.data.geocodes[0];
        return {
          formattedAddress: geocode.formatted_address,
          location: geocode.location,
          province: geocode.province,
          city: geocode.city,
          district: geocode.district
        };
      } else {
        console.error('地址解析失败:', response.data.info);
        throw new Error('地址解析失败');
      }
    } catch (error) {
      console.error('地理编码服务错误:', error);
      throw new Error('获取地理位置信息失败');
    }
  }

  // 根据经纬度获取逆地理编码
  async getReverseGeoCode(location) {
    try {
      const url = `${this.baseUrl}/geocode/regeo`;
      
      const params = {
        key: this.apiKey,
        location: location,
        output: 'JSON',
        extensions: 'base'
      };

      const response = await axios.get(url, { params });
      
      if (response.data.status === '1') {
        const regeo = response.data.regeocode;
        return {
          formattedAddress: regeo.formatted_address,
          addressComponent: regeo.addressComponent,
          pois: regeo.pois || []
        };
      } else {
        console.error('逆地理编码失败:', response.data.info);
        throw new Error('获取地址信息失败');
      }
    } catch (error) {
      console.error('逆地理编码服务错误:', error);
      throw new Error('获取地址信息失败');
    }
  }
}

module.exports = new AmapService();
