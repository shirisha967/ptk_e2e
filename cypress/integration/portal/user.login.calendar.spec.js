/// <reference types="Cypress" />

describe("Calendar usage", () => {
    const portalUrl = Cypress.env("portalUrl");

    it("Log into portal", () => {
        // Setup and log into portal
        cy.beforePortal();

        // Wait for page to load

        // TODO: The below test does not work because of hardcoded calendar dates, so fix/rewrite
        // the who thing at some point

        // Go to calendar
        cy.get(":nth-child(3) > #Calendar").click();

        cy.log("Creation");

        const desk_start_date_cont = "#desk-screen #start_date_cont";
        const desk_end_date_cont = "#desk-screen #end_date_cont";

        //Click on the startdate
        cy.get(`${desk_start_date_cont} > #start_date`, { timeout: 10000 }).should("be.visible");
        cy.get(`${desk_start_date_cont} > #start_date`, {
            timeout: 1000,
        }).click({ force: true });
        cy.get(desk_start_date_cont).prevAll(".datepicker-modal.open").find("button.month-next").click();
        cy.get(desk_start_date_cont)
            .prevAll(".datepicker-modal.open")
            .find('[data-day="15"][aria-selected="false"] > .datepicker-day-button', {
                timeout: 1000,
            })
            .trigger("click");

        //Click on the enddate
        cy.get(`${desk_end_date_cont} > #end_date`, {
            timeout: 1000,
        }).click();
        cy.get(desk_end_date_cont).prevAll(".datepicker-modal.open").find("button.month-next").click();
        cy.get(desk_end_date_cont)
            .prevAll(".datepicker-modal.open")
            .find('[data-day="22"][aria-selected="false"] > .datepicker-day-button', {
                timeout: 1000,
            })
            .trigger("click");

        //Click on the Blocked
        cy.xpath("(//span[text()='Myself / friend / relative staying in the property'])[2]")
            .contains("Myself / friend / relative staying in the property")
            .click();

        //Text for reason
        //cy.get(
        //  "#desk-screen > .cal-form > #edit_cal > .top > #availability-form > .row.mb-0 > #notes > .materialize-textarea"
        //).type("Hello, World!{enter}");

        //Click on No
        //cy.xpath('(//span[text()="No"])[2]').contains("No").click();

        //Click Save Changes
        //cy.get("#desk-screen > .cal-form > #edit_cal > .bottom > .col > .flex-end > #save-btn").click();

        //cy.log("Clean");

        //Click on the startdate
        //cy.get(`${desk_start_date_cont} > #start_date`, {
        //    timeout: 1000,
        //}).click();
        //cy.get(":nth-child(3) > .is-selected > .datepicker-day-button", { timeout: 1000 }).trigger("click");

        //Click on the enddate
        //cy.get(`${desk_end_date_cont} > #end_date`, {
        //   timeout: 1000,
        //}).click();
        //cy.focused();
        //cy.get(
        //   '.open > .modal-content > .datepicker-calendar-container > .datepicker-calendar > .datepicker-table-wrapper > .datepicker-table > tbody > :nth-child(4)> [data-day="22"]',
        //   { timeout: 20000 }
        //).click();

        //Click on the available
        //cy.get(
        //   "#desk-screen > .cal-form > #edit_cal > .top > #availability-form > :nth-child(1) > :nth-child(1) > label > span"
        //)
        //  .contains("Available")
        //.click();

        //Click on scheduling clean
        cy.xpath("(//span[text()='Yes'])[2]").contains("Yes").click();

        //Click Save Changes
        cy.get("#desk-screen > .cal-form > #edit_cal > .bottom > .col > .flex-end > #save-btn").click();

        // Log out
        cy.logoutOfPortal();
    });
});
