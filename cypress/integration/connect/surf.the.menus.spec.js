/// <reference types="Cypress" />

describe("Surf the menus", () => {
    before("Log into Connect", () => {
        // Log out of Connect
        cy.beforeConnect();
    });

    after("Log out", () => {
        // Log out of Connect
        cy.logoutOfConnect();
    });

    it("Check all menus work", () => {
        const connectUrl = Cypress.env("connectUrl");
        // Go home by clicking the logo or home text in the top right

        // logo click
        cy.log("Click PTK Image");
        cy.get(".brand-image").click();

        // home text click
        cy.log("Click home text");
        cy.get("#navbar-collapse-1 > :nth-child(1) > .active > a").click();

        // Visit tickets page - same as home
        cy.log("Click Tickets icon on menu bar");
        cy.get('[data-test="base-tickets"]');

        // Visit open tickets
        cy.log("Click open tickets on the left of the page");
        cy.get('[data-test="home-openTickets-tab"]').click();
        cy.url().should("include", "status=OPEN");

        // visit pending tickets
        cy.log("Visit pending tickets");
        cy.get('[data-test="home-pendingTickets-tab"]').click();
        cy.url().should("include", "status=PENDING");

        // visit resolved tickets
        cy.log("Visit resolved tickets");
        cy.get('[data-test="home-resolvedTickets-tab"]').click();
        cy.url().should("include", "status=RESOLVED");
    });
});
