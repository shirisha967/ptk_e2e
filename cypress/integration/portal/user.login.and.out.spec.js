/// <reference types="Cypress" />

describe("Visit portal page", () => {
    const portalUrl = Cypress.env("portalUrl");

    it("Log into portal", () => {
        // Setup and log into portal
        cy.beforePortal();

        cy.logoutOfPortal();
    });
});
