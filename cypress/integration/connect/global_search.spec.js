import { Login } from "../pages/login";
import { Header } from "../pages/header";
const login = new Login();
const header = new Header();
describe("Global search test cases", () => {
    beforeEach(() => {
        cy.beforeConnect();
    });

    it.skip("Global Search with client email id", () => {
        var clientName = "E2E Test Client";
        var clientEmail = "e2e-test-client+1628153745734@example.com";
        var clientPhoneNumber = "+44 20 7946 0623";
        header.clickOnSearchBx();
        header.searchWith(clientEmail);

        header.verifyClientDetailsInSearchResults(clientName, clientEmail, clientPhoneNumber);
    });

    it("Global Search with client name", () => {
        var clientName = "E2E Test Client";
        var clientEmail = "e2e-test-client+1628153745734@example.com";
        var clientPhoneNumber = "+44 20 7946 0623";
        header.clickOnSearchBx();
        header.searchWith(clientName);

        header.verifyClientDetailsInSearchResults(clientName, clientEmail, clientPhoneNumber);
    });

    it("Global Search with random word", () => {
        var searchText = "ian";
        header.clickOnSearchBx();
        header.searchWith(searchText);

        header.verifySearchResults(searchText);
    });

    it("Global Search with property name", () => {
        var propertyName = Cypress.env("e2e_test_property_name");
        var propertyAddress = "St Andrews House, 2 Regent Rd, Edinburgh, EH1 3DG";

        header.clickOnSearchBx();
        header.searchWith(propertyName);

        header.verifyPropertyDetailsInSearchResults(propertyName, propertyAddress);
    });

    it("Global Search with property Address", () => {
        var propertyName = Cypress.env("e2e_test_property_name");
        var propertyAddress = "St Andrews House, 2 Regent Rd, Edinburgh, EH1 3DG";

        header.clickOnSearchBx();
        header.searchWith(propertyAddress);

        header.verifyPropertyDetailsInSearchResults(propertyName, propertyAddress);
    });
});
