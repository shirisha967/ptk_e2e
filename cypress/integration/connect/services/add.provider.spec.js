/// <reference types="Cypress" />

describe("Provider Rate Card", () => {
    before("Set Up", () => {
        //Log in to Connect
        cy.beforeConnect();
        // Just in case there was a fault somehow - or the test was stopped half way for some reason
        cy.cleanUpTestProvider();
        //Ensure test provider exists for use in test
        cy.loadTestProviderForTest();
    });

    after("Clean up", () => {
        cy.cleanUpTestProvider();
    });

    it("Check Rate Card functionality", () => {
        //Check for "Add Rate Card" Button & Click it
        cy.waitFor('[data-test="view-rate-card-addRateCard-button"]');
        cy.get('[data-test="view-rate-card-addRateCard-button"]').should("be.visible").click();

        //Check for "Confirm" Button to know that the edit rate card has been successfully entered
        cy.get('[data-test="edit-rate-card-confirm-button"]').should("be.visible");

        //Populate the rate card
        cy.get('[colspan="2"] > .d-flex > .select-container > .form-control')
            .select("Cleaning")
            .select("Storage")
            .select("Spot Checking")
            .select("Consumables");

        //Populate the services table
        const $numOfServices = 4;
        //s == service, f == table field (aka "Pay/job", "Fee/job", etc...)
        for (var s = 2; s < $numOfServices + 2; s++) {
            for (var f = 3; f < 8; f++) {
                if (f != 5) {
                    cy.get(
                        ":nth-child(" + s + ") > :nth-child(" + f + ") > .inner-container > .form-group > .form-control"
                    ).type("10");
                }
            }
        }

        //Set valid from date
        cy.get('[data-test="edit-rate-card-validFrom-input"]').click().type("2021-05-09");

        //Confirm rate card
        cy.get('[data-test="edit-rate-card-confirm-button"]').should("be.visible").click();

        //Check "Edit Rates" exists (means rate card added successfully)
        cy.waitFor('[data-test="view-rate-card-editRateCard-button"]');
        cy.get('[data-test="view-rate-card-editRateCard-button"]').should("be.visible");
        //Check rate card added successfully (via date matching)
        cy.get(".rate-card-select").should("have.text", "2021-05-09 - Onwards");
    });
});
