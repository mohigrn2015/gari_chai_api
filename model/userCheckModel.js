class userCheckModel {
    constructor({ username }) {
        this.username = username;
    }

    // Simple validation method
    validate() {
        if (!this.username) {
            throw new Error("Username is required!");
        }
    }
}

export default userCheckModel;