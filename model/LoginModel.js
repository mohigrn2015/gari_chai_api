class LoginModel {
    constructor({ username, password, deviceid }) {
        this.username = username;
        this.password = password;
        this.deviceid = deviceid;
    }

    // Simple validation method
    validate() {
        if (!this.username || !this.password || !this.deviceid) {
            throw new Error("Username, password, and device ID are required!");
        }
    }
}

export default LoginModel;
