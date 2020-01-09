const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;
const locationRegSchema = new Schema({
    createdAt: {
        type: Date,
        required: true,
    },
    location_name: {
        type: String,
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
    security: [{
        type: Schema.ObjectId, ref: 'User'
    }]
});

class LocationRegistrationClass {
    // User's public fields
    static publicFields() {
        return ['id', 'name', 'security', 'createdAt'];
    }
    static async list() {
        const populateSecurity = [{ path: "security", select: ['name', 'mobile'] }];
        const locationRegistrations = await this.find({})
            .populate(populateSecurity)
            .sort({ createdAt: -1 });
        return locationRegistrations;
    }

    static async listBySecurity() {
        const adminUsers = await this.find({ "security": true })
            .sort({ createdAt: -1 });
        return adminUsers;
    }

    static async update({ locationId }, req) {
        const updLocationRegistration = await this.findByIdAndUpdate(locationId, { $set: req }, { new: true });
        console.log(updLocationRegistration);
        return updLocationRegistration;
    }

    static async add({ location_name, location_id, latitude, longitude, security }) {
        const newLocationReg = await this.create({
            createdAt: new Date(),
            location_name,
            location_id,
            latitude,
            longitude,
            security
        });
        return newLocationReg;
    };
}
locationRegSchema.loadClass(LocationRegistrationClass);
const LocationRegistration = mongoose.model('LocationRegistration', locationRegSchema);
module.exports = LocationRegistration;