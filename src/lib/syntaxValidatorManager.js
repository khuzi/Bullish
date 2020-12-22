const validate = require("validate.js");

module.exports.SyntaxValidationManager = class SyntaxValidationManager {

    /**
     * @description Evaluates an email address
     * @param {string} email The email to validate
     * @returns {boolean} A boolean checking if the email provided is syntactically valid
     */
    static validEmail(email){
        return validate.single(email, {presence: true, email: true}) ? false: true;
    }
}