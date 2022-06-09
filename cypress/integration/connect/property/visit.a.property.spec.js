/// <reference types="Cypress" />

describe("Visit a property on Connect", () => {
    let propertyId = 1478;

    before("Log into Connect", () => {
        // Log out of Connect
        cy.beforeConnect();
    });

    after("Log out", () => {
        // Log out of Connect
        cy.logoutOfConnect();
    });

    it("Visit a property", () => {
        // visit and old property - Bridge Wharf
        cy.visit("https://ptkdev.com/properties/" + propertyId);
        cy.url().should("include", "properties/" + propertyId);

        // visit some tabs from the left menu

        // visit FAQ tab
        cy.get(".side-menu > .nav > :nth-child(2) > a").contains("FAQ").click();
        cy.get(".col-sm-10 > :nth-child(1) > :nth-child(4) > :nth-child(1) > :nth-child(1)").should(
            "contain",
            "Key Safe Type"
        );

        // Visit the calendar tab
        cy.get(".side-menu > .nav > :nth-child(5) > a").contains("Calendar").click();
        cy.get(".fc-row > table > thead > tr > .fc-sun").contains("Sun").should("be.visible");

        // Visit Airbnb tab
        cy.get(".side-menu > .nav >").contains("Airbnb").click();

        cy.get("#airbnb-1 > .col-sm-12 > :nth-child(1) > tbody > :nth-child(1) > .td-label-col > b").should(
            "contain",
            "Name"
        );
        cy.get("#airbnb-1 > .col-sm-12 > :nth-child(1) > tbody > :nth-child(1) > .td-label-col > b").should(
            "contain",
            "Name"
        );
        cy.get("#airbnb-1 > .col-sm-12 > :nth-child(1) > tbody > :nth-child(4) > .td-label-col > b").should(
            "contain",
            "Status"
        );
        cy.get("#airbnb-1 > .col-sm-12 > :nth-child(4) > tbody > :nth-child(6) > .td-label-col > b").should(
            "contain",
            "Login Status"
        );
    });
});
