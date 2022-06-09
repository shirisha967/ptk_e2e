/// <reference types="Cypress" />

describe("Create a new airbnb listing on a property with a new airbnb account", () => {
    const airbnbAccountEmail = "e2e-test-client@passthekeys.co.uk";
    const platform = "Airbnb";

    before("Has prerequisites", function () {
        cy.loginToAdmin()
            .ensureTestProperty()
            .as("propertyId")
            .then(() => {
                cy.ensureNoListings(this.propertyId, platform);
            })
            .ensureNoAlias(airbnbAccountEmail)
            .ensureNoChannelAccount(airbnbAccountEmail)
            .logoutFromAdmin();
    });

    it("should create new channel account", () => {
        const connectUrl = Cypress.env("connectUrl");

        cy.beforeConnect();

        cy.get("@propertyId")
            .then((propertyId) => {
                return cy.visit(`${connectUrl}/properties/${propertyId}/#airbnb-0`);
            })
            .get("#airbnb-0 > div.text-center > .btn")
            .click();

        cy.get("[for='suggested']").click();

        cy.get("button.btn-primary").click();

        cy.get("[placeholder='ExamplePassword']").type("TestPassword");

        cy.get("button.btn-primary").click();

        cy.get("ul > li.current > a > div.label").should("to.contain", "Verify Account");
    });
});
