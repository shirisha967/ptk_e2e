/// <reference types="Cypress" />

describe("Use Unified Calendar", () => {
    before("Log into Connect", () => {
        // Log out of Connect
        cy.beforeConnect();
    });

    it("Check all menus work", () => {
        // We've logged in, so click portfolio
        cy.get('[data-test="base-portfolio"]').click();
        cy.wait(750);

        // Open locations
        cy.get(".location-filter > .dropdown-toggle").click();

        // Choose London
        cy.get(".list-unstyled > :nth-child(10)").click();

        // Click Apply
        cy.get("#submit").click();

        // wait for page to reload
        cy.wait(2000);

        // // Click to proceed to next month and then back to current month
        cy.get('[calendarnextview="month"]').click();
        cy.wait(1000);
        cy.get('[calendarprevview="month"]').click();
        cy.wait(1000);

        // Log out of Connect
        cy.get(".user-profile > .dropdown-toggle").click();
        cy.get(".user-profile > .dropdown-menu > :nth-child(3) > a").click();
    });
});
