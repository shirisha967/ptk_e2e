/// <reference types="Cypress" />

describe("Customise location check-in/out times and verify change on Connect", () => {
    const testPropertyName = Cypress.env("e2e_test_property_name");

    before("Log into Connect", () => {
        // Log out of Connect
        cy.beforeConnect();
    });

    after("Log out", () => {
        // Log out of Connect
        cy.logoutOfConnect();
    });

    it("Change default times & verify", () => {
        // Navigate to property
        cy.visit(Cypress.env("connectUrl") + "/properties/" + Cypress.env("testPropertyId"));
        // Set custom property check-in/out times
        cy.get('[data-test="property-edit-property"]').click();
        cy.get('[data-test="custom-check-in-time"]').select("17:00", { force: true });
        cy.get('[data-test="custom-check-out-time"]').select("10:00", { force: true });
        cy.get('[id="submit-save"]').click();
        // Verify change
        cy.get('[data-test="custom-check-in-time"]').should("contain", "17:00 (location default is 15:00)");
        cy.get('[data-test="custom-check-out-time"]').should("contain", "10:00 (location default is 11:00)");
        // Reset property to default
        cy.get('[data-test="property-edit-property"]').click();
        cy.get('[data-test="custom-check-in-time"]').select("15:00", { force: true });
        cy.get('[data-test="custom-check-out-time"]').select("11:00", { force: true });
        cy.get('[id="submit-save"]').click();
        // Verify
        cy.get('[data-test="custom-check-in-time"]').should("contain", "15:00");
        cy.get('[data-test="custom-check-out-time"]').should("contain", "11:00");
    });
});
