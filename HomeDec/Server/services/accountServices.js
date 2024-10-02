const Address = require("../models/addressModel");
const User = require("../models/userModel");
const { handleError } = require("../Utils/handleError");

module.exports = {
  listAddresses: async (addressId) => {
    try {
      const addressList = await Address.findOne(
        { _id: addressId },
        { userId: 0, updatedAt: 0, createdAt: 0 }
      );
      console.log(addressList);

      if (!addressList) {
        throw { status: 400, message: "Address list not exist" };
      }
      return addressList;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  AddNewAddress: async (addressId, addressDetails) => {
    try {
      const address = await Address.findOne({ _id: addressId });
      if (
        address.addresses.some((addr) => addr.label === addressDetails.label)
      ) {
        throw { status: 400, message: "Address label must be unique" };
      }

      const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId },
        { $push: { addresses: addressDetails } },
        { new: true, upsert: true }
      );
      return updatedAddress;
    } catch (error) {
      if (error.status) throw error;
      else throw { status: 500, message: "Server error" };
    }
  },

  deleteAddress: async (addressId, itemId) => {
    try {
      const updatedAddress = await Address.findOneAndUpdate(
        { _id: addressId },
        { $pull: { addresses: { _id: itemId } } },
        { new: true }
      );

      if (!updatedAddress) {
        throw { status: 404, message: "Address list not found" };
      }

      return itemId;
    } catch (error) {
      console.log(error);

      if (error.status) throw error;
      else throw handleError(error);
    }
  },
};
