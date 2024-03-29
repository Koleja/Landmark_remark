/**** user.js ****/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const saltRounds = 10;

// user base's data structure 
const UserSchema = new Schema(
  {
    userName: { 
      type: String,
      require: true,
      unique: true
    },
    userPass: {
      type: String,
      required: true
    }
  },
  { timestamps: true },
  { collection: 'users' }
)

UserSchema.pre('save', function(next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('userPass')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.userPass, saltRounds,
      function(err, hashedPassword) {
      if (err) {
        next(err);
      }
      else {
        document.userPass = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

// verify user password when logining ing
UserSchema.methods.isCorrectPassword = function(userPass, callback){
  bcrypt.compare(userPass, this.userPass, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

module.exports = mongoose.model("User", UserSchema);