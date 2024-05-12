export default class WebService {
  static queryParamsURLEncodedString(params) {
    return Object.keys(params)
      .map((k) => (Array.isArray(params[k])
        ? params[k].map((v) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
        : `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`))
      .join('&');
  }

  static sendJsonGET(url, data, callback) {
    const combinedData = { isMobile: true, ...(data || {}) };
    const route = url + (url.indexOf('?') > 0 ? '&' : '?') + WebService.queryParamsURLEncodedString(combinedData);
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (data && data.jwt) {
      headers.Authorization = `Bearer ${data.jwt}`;
    }
    fetch(route, {
      method: 'GET',
      headers,
    })
      .then((raw) => raw.text())
      .then((responseJson) => {
        const json = JSON.parse(responseJson.trim());
        if (callback) callback(WebService.validate(json), json);
      })
      .catch((error) => callback && callback(0, WebService.parseErrorCatch(error)));
  }

  static sendJsonPOST(url, data, callback) {
    const combinedData = { isMobile: true, ...(data || {}) };
    const headers = {
      Accept: 'application/json',
    };
    if (data && data.jwt) {
      headers.Authorization = `Bearer ${data.jwt}`;
    }
    if (data && !data.formData) {
      headers['Content-Type'] = 'application/json';
    }
    fetch(url, {
      method: 'POST',
      headers,
      body: data && data.formData ? data.formData : JSON.stringify(combinedData)
    })
      .then((raw) => raw.text())
      .then((responseJson) => {
        const json = JSON.parse(responseJson.trim());
        if (callback) callback(WebService.validate(json), json);
      })
      .catch((error) => callback && callback(0, WebService.parseErrorCatch(error)));
  }

  static sendJsonPUT(url, data, callback) {
    const combinedData = { isMobile: true, ...(data || {}) };
    const headers = {
      Accept: 'application/json',
    };
    if (data && data.jwt) {
      headers.Authorization = `Bearer ${data.jwt}`;
    }
    if (data && !data.formData) {
      headers['Content-Type'] = 'application/json';
    }
    fetch(url, {
      method: 'PUT',
      headers,
      body: data && data.formData ? data.formData : JSON.stringify(combinedData)
    })
      .then((raw) => raw.text())
      .then((responseJson) => {
        const json = JSON.parse(responseJson.trim());
        if (callback) callback(WebService.validate(json), json);
      })
      .catch((error) => callback && callback(0, WebService.parseErrorCatch(error)));
  }

  static sendJsonDELETE(url, data, callback) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (data && data.jwt) {
      headers.Authorization = `Bearer ${data.jwt}`;
    }
    fetch(url, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(data)
    })
      .then((raw) => raw.text())
      .then((responseJson) => {
        const json = JSON.parse(responseJson.trim());
        if (callback) callback(WebService.validate(json), json);
      })
      .catch((error) => callback && callback(0, WebService.parseErrorCatch(error)));
  }

  static sendGET(url, data, callback) {
    const combinedData = { isMobile: true, ...(data || {}) };
    const route = url + (url.indexOf('?') > 0 ? '&' : '?') + WebService.queryParamsURLEncodedString(combinedData);
    fetch(route, {
      method: 'GET',
      headers: {
        Accept: 'text/html',
      },
    })
      .then((response) => response.text())
      .then((text) => callback && callback(1, text))
      .catch((error) => callback && callback(0, WebService.parseErrorCatch(error)));
  }

  static validate(json) {
    return json && !json.error && json.result && !json.result.error;
  }

  static parseErrorCatch(error) {
    return {
      error: 'Connection error',
      errorMessage: error && !error.sourceURL ? error : 'Network connection problem',
      errorCode: 404,
      route: '/error',
    };
  }
}
