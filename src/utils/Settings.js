import AsyncStorage from "@react-native-async-storage/async-storage";
export const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
  COMPANY: "COMPANY",
};

export default class Settings {
  static async getItem(key) {
    const value = await AsyncStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  static async setItem(key, value) {
    if (value == null) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  }


  static async sessionKey() {
    let sessionKey = await this.getItem('sessionKey');
    return sessionKey;
  }

  static setSessionKey(value) {
    this.setItem('sessionKey', value);
  }

  static async role() {
    let role = await this.getItem('role');
    return role;
  }

  static setRole(value) {
    this.setItem('role', value);
  }

  static isAdmin() {
    return Settings.role() === Roles.ADMIN;
  }

  static profile() {
    return this.getItem('profile');
  }

  static setProfile(value) {
    this.setItem('profile', value);
  }

  static profile() {
    return this.getItem('profile');
  }

  static setProfile(value) {
    this.setItem('profile', value);
  }

  static fingerprint() {
    return this.getItem('fingerprint');
  }

  static setFingerprint(value) {
    this.setItem('fingerprint', value);
  }
}
