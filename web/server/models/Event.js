const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const eventSchema = new Schema({

    type: {
        type: String,
        required: true,
    },
    scannedNumber: {
        type: Number,
        required: true,
    },
    locationID: {
        type: String,
    },
    orderID: {
        type: String,
    },
    exception: {
        type: String,
    },
    userID: {
        type: String,
    },
    image: {
        type: String,
    },
    latlong: {
        type: String,
    },
    bookingDate: {
        type: Date,
    },
    serviceDate: {
        type: Date,
    },
    displayName: String,
});

class EventClass {
    static async list() {
        const events = await this.find({})
            .sort({ createdAt: -1 });
        return { events };
    }
    static async add({ type,scannedNumber,locationID,orderID,exception,userID,image,latlong,bookingDate,serviceDate }) {
        console.log(orderID);
        if (orderID != "" && orderID != null) {
            const newEvent = await this.create({
                bookingDate: new Date(), 
                serviceDate: new Date(),
                exception: "",
                type,
                scannedNumber,
                locationID,
                orderID,
                userID,
                image,
                latlong
            });
        } else {
            const newEvent = await this.create({
                bookingDate: new Date(), 
                serviceDate: new Date(),
                exception: "new vehicle entry",
                type,
                scannedNumber,
                locationID,
                orderID,
                userID,
                image,
                latlong
        })
    };
  }
}
eventSchema.loadClass(EventClass);
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

