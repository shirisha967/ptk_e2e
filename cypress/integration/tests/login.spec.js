import { Login } from "../pages/login";

const faker = require("faker");
const login = new Login();

describe("Pass the keys login test cases", () => {
    it("Login as staff user with valid credentials", () => {
        login.navigateToUrl();
        login.loginToConnect();
    });

    it("Login with invalid credentials", () => {
        login.navigateToUrl();
        login.loginToConnect("ash@gmail.com", "shaik");
        login.verifyLoginErrorMessage("Your username and password didn't match. Please try again.");
    });
});
