## Gửi dữ liệu từ ESP status device

http://app.luxas.com.vn:8080/api/stats/{deviceId}

```json
{
"uuid": "GMT",
"status":"RUN"||"STOP"||"ONLINE"||"OFFLINE"||"WAITTING",
"productQty":"",
"numOfCycles":"",
}
```
M/c có 4 trạng thái tương ứng với:
- "on:enable": status "RUN",
- "on:disable":status "WAITTING"
- " off:enable" và "off:disable": status "ONLINE" 

