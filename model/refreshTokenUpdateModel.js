class refreshTokenUpdateModel {
    constructor({ deviceid,username }) {
        this.deviceid = deviceid;
        this.username = username;
    }

    // Simple validation method
    validate() {
        if (!this.deviceid) {
            throw new Error("Device ID is required!");
        }
    }
}

export default refreshTokenUpdateModel;