import Settings from "./Settings";
import WebService from "./WebService";
const moment = require('moment');
export default class APIService {
  static urlServerAddress = "http://app.luxas.com.vn:8080";

  static baseAPI = () => `${APIService.urlServerAddress}/api/`;

  static apiDashboard = () => `${APIService.baseAPI()}dashboard`;

  static apiSignIn = () => `${APIService.baseAPI()}user/login`;

  static apiVerifyToken = () => `${APIService.baseAPI()}user/verify-token`;

  static apiUsers = () => `${APIService.baseAPI()}user`;

  static apiAddUser = () => `${APIService.baseAPI()}user/add`;

  static apiUpdateUser = () => `${APIService.baseAPI()}user/update`;

  static apiUserLock = () => `${APIService.baseAPI()}user/lock`;

  static apiChangePassword = () => `${APIService.baseAPI()}user/password`;

  static apiDeviceById = (deviceId) => `${APIService.baseAPI()}device/${deviceId}`;

  static apiDeviceAssign = () => `${APIService.baseAPI()}device/assign`;

  static apiDeviceSettings = () => `${APIService.baseAPI()}device/settings`;

  static apiDeviceAlarm = () => `${APIService.baseAPI()}device/alarm`;

  static apiStatsByDevice = (deviceId) => `${APIService.baseAPI()}stats/${deviceId}`;

  static apiStatsById = (id) => `${APIService.baseAPI()}stats/id/${id}`;

  static apiStatsFilter = () => `${APIService.baseAPI()}stats/filter`;

  static apiRunStopStats = (deviceId) => `${APIService.baseAPI()}stats/runStopStats/${deviceId}`;

  static apiGetStatsFilters = () => `${APIService.baseAPI()}stats/autocomplete`;

  static apiDevices = () => `${APIService.baseAPI()}device`;

  static apiProfile = (userId) => `${APIService.baseAPI()}profile/${userId}`;

  static apiUploadImage = () => `${APIService.baseAPI()}image`;

  static apiGroup = () => `${APIService.baseAPI()}group`;

  static apiGroupDevice = () => `${APIService.baseAPI()}group/assign`;

  static signIn(email, password, callback) {
    WebService.sendJsonPOST(
      this.apiSignIn(),
      {
        email,
        password,
      },
      callback
    );
  }

  static verifyUserToken(sessionKey, callback) {
    WebService.sendJsonPOST(
      this.apiVerifyToken(),
      {
        token: sessionKey,
        jwt: sessionKey,
      },
      callback
    );
  }

  static getDashboard(callback) {
    WebService.sendJsonGET(
      this.apiDashboard(),
      {
        jwt: this.sessionKey,
      },
      callback
    );
  }

  static async changePassword(oldPassword, newPassword, callback) {
    WebService.sendJsonPUT(
      this.apiChangePassword(),
      {
        jwt: await Settings.sessionKey(),
        oldPassword,
        newPassword,
      },
      callback
    );
  }

  static async getDeviceById(deviceId, callback) {
    WebService.sendJsonGET(
      this.apiDeviceById(deviceId),
      {
         jwt: await Settings.sessionKey(),
      },
      callback
    );
  }

  static async getDevices(callback) {
    WebService.sendJsonGET(
      this.apiDevices(),
      {
        jwt: await Settings.sessionKey(),
      },
      callback
    );
  }

  static assignOwner(deviceId, companyId, callback) {
    WebService.sendJsonPOST(
      this.apiDeviceAssign(),
      {
        deviceId,
        companyId,
      },
      callback
    );
  }

  static async deviceSettings(data, callback) {
    WebService.sendJsonPOST(
      this.apiDeviceSettings(),
      {
        jwt: await Settings.sessionKey(),
        deviceId: data?.deviceId,
        deviceName: data?.deviceName,
        settingId: data?.settingId,
        name: data?.name,
        productModel: data?.productModel,
        productName: data?.productName,
        productUnit: data?.productUnit,
        boardId: data?.boardId,
        machineId: data?.machineId,
        machineName: data?.machineName,
        model: data?.model,
        process: data?.process,
        workshop: data?.workshop,
      },
      callback
    );
  }

  static setAlarm(data, callback) {
    WebService.sendJsonPOST(
      this.apiDeviceAlarm(),
      {
        jwt: Settings.sessionKey(),
        deviceId: data?.deviceId,
        counterMode: data?.counterMode,
        counterValue: data?.counterValue,
        counterScale: data?.counterScale,
        relayOn: data?.relayOn,
        before: data?.before,
        relayType: data?.relayType,
        buzzer: data?.buzzer,
      },
      callback
    );
  }

  static deleteDevices(ids, callback) {
    WebService.sendJsonDELETE(this.apiDevices(), { ids }, callback);
  }

  static async getDeviceStats(deviceId, callback) {
    WebService.sendJsonGET(
      this.apiStatsByDevice(deviceId),
      {
        jwt: await Settings.sessionKey(),
      },
      callback
    );
  }

  static async getStatsById(id, callback) {
    WebService.sendJsonGET(
      this.apiStatsById(id),
      {
        jwt: await Settings.sessionKey(),
      },
      callback
    );
  }

  static async getRunStopStatsByDeviceId(id,time, callback) {
    WebService.sendJsonGET(
      this.apiRunStopStats(id),
      {
        jwt: await Settings.sessionKey(),
        time: time||  moment(new Date()).startOf('day').toISOString()
      },
      callback
    );
  }

  static async filterStats(options, callback) {
    WebService.sendJsonPOST(
      this.apiStatsFilter(),
      {
        jwt: await Settings.sessionKey(),
        ...options,
      },
      callback
    );
  }

  static async getStatsFilters(callback) {
    WebService.sendJsonGET(
      this.apiGetStatsFilters(),
      {
        jwt: await Settings.sessionKey()
      },
      callback
    );
  }

  static uploadAvatar(jwt, uri, type, callback) {
    const uriParams = uri.split("/");
    const fileName = uriParams[uriParams.length - 1];
    const fileData = fileName.split(".");
    const fileType = fileData[fileData.length - 1];

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: `${fileName}`,
      type: type || `image/${fileType}`,
    });

    WebService.sendJsonPOST(
      this.apiUploadImage(),
      {
        jwt,
        formData,
      },
      callback
    );
  }

  static async getUsers(callback) {
    WebService.sendJsonGET(
      this.apiUsers(),
      {
        jwt: await Settings.sessionKey()
      },
      callback
    );
  }

  static async addUser(name, email, callback) {
    WebService.sendJsonPOST(
      this.apiAddUser(),
      {
        name,
        email,
        jwt: await Settings.sessionKey()
      },
      callback
    );
  }

  static deleteUsers(ids, callback) {
    WebService.sendJsonDELETE(this.apiUsers(), { ids }, callback);
  }

  static async getProfile(userId, callback) {
    WebService.sendJsonGET(
      this.apiProfile(userId),
      {
        jwt: await Settings.sessionKey()
      },
      callback
    );
  }

  static async updateProfile(values, callback) {
    WebService.sendJsonPUT(
      this.apiUpdateUser(),
      {
        userId: values.userId,
        name: values.name,
        jwt: await Settings.sessionKey()
      },
      callback
    );
  }

  static async activateUser(userId, locked, callback) {
    WebService.sendJsonPOST(
      this.apiUserLock(),
      {
        jwt: await Settings.sessionKey(),
        userId,
        locked
      },
      callback
    );
  }

  static addGroup(name, color, model, productModel, callback) {
    WebService.sendJsonPOST(
      this.apiGroup(),
      {
        name,
        color,
        model,
        productModel,
      },
      callback
    );
  }

  static editGroup(id, name, color, model, productModel, callback) {
    WebService.sendJsonPUT(
      this.apiGroup(),
      {
        id,
        name,
        color,
        model,
        productModel,
      },
      callback
    );
  }

  static deleteGroup(id, callback) {
    WebService.sendJsonDELETE(
      this.apiGroup(),
      {
        ids: [id],
      },
      callback
    );
  }

  static async getGroups(callback) {
    WebService.sendJsonGET(
      this.apiGroup(),
      {
        jwt: await Settings.sessionKey()
      },
      callback
    );
  }

  static assignGroup(groupId, deviceIds, callback) {
    WebService.sendJsonPOST(
      this.apiGroupDevice(),
      {
        groupId,
        deviceIds,
      },
      callback
    );
  }

  static unasignDeviceFromGroup(groupId, deviceId, callback) {
    WebService.sendJsonDELETE(
      this.apiGroupDevice(),
      {
        groupId,
        deviceId,
      },
      callback
    );
  }
}
