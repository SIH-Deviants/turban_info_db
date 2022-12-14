var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var vendorSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    address: {
      type: String,
      require: true,
    },
    shopName: {
      type: String,
      require: true,
    },
    phone: {
      type: Number,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    products: [{ name: String, description: String, price: Number }],

    resetLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

vendorSchema.pre("save", function (next) {
  var vendor = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(vendor.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        vendor.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

vendorSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("vendor", vendorSchema);
