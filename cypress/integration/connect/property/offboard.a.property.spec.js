/// <reference types="Cypress" />

import setDate from "date-fns/setDate";
import format from "date-fns/format";
import addMonths from "date-fns/addMonths";

describe("Offboard a property on Connect", () => {
    before("Log into Connect", () => {
        // Log out of Connect
        cy.beforeConnect();
    });

    after("Log out", () => {
        // Log out of Connect
        cy.logoutOfConnect();
    });

    it("Visit a property", () => {
        const date = addMonths(new Date(), 2);
        const inTwoMonthsDate = setDate(date, 28);

        // visit and old property - Bridge Wharf
        cy.visit(Cypress.env("connectUrl") + "/properties/" + Cypress.env("testPropertyId"));
        cy.url().should("include", "properties/" + Cypress.env("testPropertyId"));

        // Follow offboarding flow
        cy.get('[data-test="property-schedule-offboarding"]').click();

        // Click calendar next button to go forward 2 months
        cy.get(".next > span").click();
        cy.get(".next > span").click();

        // Choose 28 of month
        cy.get("[role='gridcell'] > :not(.is-other-month)").contains("28").click();

        // Click Continue
        cy.get('[data-test="offboarding-wizard-setOffboardDate-button"]').click();

        // Choose a reason - not making enough money
        cy.waitFor("#reason");
        cy.get("#reason").select("1").should("have.value", "1");

        // Add some notes
        cy.get("#notes").type("Owner not making enough money so wants to leave");

        // Click Continue
        cy.get('[data-test="offboarding-wizard-proceedWithOffboarding-button"]').click();

        // Click complete onboarding
        cy.get('[steptitle="Verify Cancellations"] > .flex-container > .flex-item > .float-right > .btn').click();

        // Check date on completion page
        cy.get('[steptitle="Complete"] > .flex-container > .flex-item > :nth-child(1) > p').should(
            "contain",
            format(inTwoMonthsDate, "dd MMMM yyyy")
        );

        // Back to property page
        cy.get('[steptitle="Complete"] > .flex-container > .flex-item > .row > .btn').click();

        // Check values on property page
        cy.get('[data-test="offboard-date"]').should("contain", format(inTwoMonthsDate, "dd MMM yyyy"));
        cy.get('[data-test="offboard-reason"]').should("contain", "Not making enough money");
        cy.get('[data-test="offboard-notes"]').should("contain", "Owner not making enough money so wants to leave");
    });
});
