const { ObjectId } = require("mongodb");

class Log {
    constructor(ip_source, ip_destination, type) {
        this.ip_source = ip_source;
        this.ip_destination = ip_destination;
        this.type = type;
        this.createdAt = new Date();
    }
}

module.exports = Log;
