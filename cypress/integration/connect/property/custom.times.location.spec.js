/// <reference types="Cypress" />

describe("Customise location check-in/out times and verify change on Connect", () => {
    before("Log into Connect", () => {
        // Log out of Connect
        cy.beforeConnect(true);
    });

    after("Log out", () => {
        // Log out of Connect
        cy.logoutOfConnect();
    });

    // We know the property location will always be Edinburgh because in `commands.js > createTestProperty` it's directly set as such & thus in `cypress.json` too
    const testPropertyLocation = Cypress.env("e2e_test_property_location");
    const testPropertyID = Cypress.env("testPropertyId");

    it("Change default times & verify", () => {
        // Navigate to location
        cy.visit(Cypress.env("connectUrl") + "/locations/" + Cypress.env("e2e_test_property_location"));
        // Change location default check-in/out times
        cy.get('[data-test="location-edit-button"]').click();
        cy.get('[data-test="default-check-in-time"]').select("17:00", { force: true });
        cy.get('[data-test="default-check-out-time"]').select("10:00", { force: true });
        cy.get('[id="submit-save"]').click();
        // Verify change on location itself
        cy.get('[data-test="default-check-in-time"]').should("contain", "17:00");
        cy.get('[data-test="default-check-out-time"]').should("contain", "10:00");
        // Verify change on a property
        cy.visit(Cypress.env("connectUrl") + "/properties/" + Cypress.env("testPropertyId"));
        cy.get('[data-test="custom-check-in-time"]').should("contain", "17:00");
        cy.get('[data-test="custom-check-out-time"]').should("contain", "10:00");
        // Reset location to default
        cy.visit(Cypress.env("connectUrl") + "/locations/" + Cypress.env("e2e_test_property_location"));
        cy.get('[data-test="location-edit-button"]').click();
        cy.get('[data-test="default-check-in-time"]').select("15:00", { force: true });
        cy.get('[data-test="default-check-out-time"]').select("11:00", { force: true });
        cy.get('[id="submit-save"]').click();
        // Verify
        cy.get('[data-test="default-check-in-time"]').should("contain", "15:00");
        cy.get('[data-test="default-check-out-time"]').should("contain", "11:00");
    });
});
