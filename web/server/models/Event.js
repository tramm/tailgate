const mongoose = require('mongoose');
const odoo = require('../odoo_server');
const _ = require('lodash');
const base = require('./base');

const { Schema } = mongoose;

const vehicleSchema = new Schema({
    chassis_Number: {
        type: String
    },
    registration_Number: {
        type: String,
        default: ""
    }
});

const eventSchema = new Schema({

    event_type: {
        type: String,
        required: true
    },
    multiple: {
        type: Boolean,
        default: true
    },
    location_id: {
        type: Number,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    name: {
        type: String,
    },
    mobile: {
        type: String,
    },
    invoice_image: {
        type: String,
    },
    vehicle_image: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    vehicles: [vehicleSchema],
    eventMaster: {
        type: Schema.ObjectId,
        ref: 'EventMaster'
    },
    displayName: String,
});

class EventClass {
    static async list(user) {
        const events = await this.find({})
            .sort({ createdAt: -1 });
        return { events };
    }

    static async add(user, { eventMaster, event_type, multiple, location_id, latitude, longitude, name, mobile, invoice_image, vehicle_image, vehicles }) {
        console.log("adding new events");
        const newEvent = await this.create({
            createdAt: new Date(),
            eventMaster,
            event_type,
            multiple,
            location_id,
            latitude,
            longitude,
            name,
            mobile,
            invoice_image,
            vehicle_image,
            vehicles
        });
        return newEvent;
    };

}

eventSchema.loadClass(EventClass);
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

