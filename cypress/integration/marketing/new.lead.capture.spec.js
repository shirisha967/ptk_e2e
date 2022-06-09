/// <reference types="Cypress" />

// Setup global variables to be used in all tests
const email = `regflowtst++${Date.now()}@example.com`;
const firstName = "Fred";
const lastName = "Bloggs";
const phoneNumber = "01234567890";
const marketingUrl = Cypress.env("marketingUrl");

/*
The time between creating a hubspot contact and then moving on to the next command.
Note: It can often take some time between the creation of a contact on Hubspot and it then
being ready for use, so the bigger the wait the better.
 */
const waitTimeForHubspot = 10000;

context("New lead Capture", () => {
    beforeEach(() => {
        // TODO: enable this when we have the template/snippet changes on staging
        cy.beforeMarketing();
        cy.visit(`${marketingUrl}/south-east-england/portsmouth/`);
    });

    it("Address is out of area", () => {
        const address = "X1 1XX";
        const email = `outofareatst++${Date.now()}@example.com`;
        const reqURL = `${Cypress.env("marketingUrl")}/api/contact_info_for_e2e/?email=${encodeURIComponent(email)}`;

        // Fill in the details form
        // Enter a partial address and click google suggestion
        cy.get('[data-test="property-address-initial-forecast"]').click().type(address);
        // TODO: Because postcodes aren't currently showing on staging we shouldn't be clicking the google dropdown
        // cy.waitFor(".pac-item");
        // cy.get(".pac-item").click();
        // cy.get('[data-test="property-address-initial-forecast"]').should("have.value", addressOne);

        // Add a bedroom
        cy.get('[data-test="plus-bedroom-initial-forecast"]').click();

        // Add email address
        cy.get('[data-test="email-initial-forecast"]').click().type(email);

        // Click I agree
        cy.get("[data-test=in-page-initial-forecast-privacy]").click();

        // Click calculate income button
        cy.get("[data-test=in-page-initial-forecast-calculate-income]").click();

        // Availability form

        // Click 6 months +
        cy.waitFor('[data-test="full-time"]');
        cy.get('[data-test="full-time"]').click();

        // click whole property
        cy.get('[data-test="whole-property"]').click();

        // Click ASAP
        cy.get('[data-test="asap"]').click();

        // Click confirm availability
        cy.get('[data-test="confirm-availability-initial-forecast"]').click();

        // Contact details form
        // Enter name
        cy.waitFor('[data-test="full-name"]');
        cy.get('[data-test="full-name"]')
            .click()
            .type(firstName + " " + lastName);

        // Enter phone number
        cy.get('[data-test="phone-number"]').click().type(phoneNumber);

        // Click opt in 'yes'
        cy.get('[data-test="opt-in"]').click();

        // click calculate income
        cy.get('[data-test="confirm-contact-details-initial-forecast"]').click();

        // Check message on disqualified screen
        cy.get("#forecast-unsuccessful > .lead_capture_journey__prompt > p").contains(
            "We’re sorry but we cannot service your property"
        );

        // Give Hubspot a second or two.
        cy.wait(waitTimeForHubspot);

        // Get details of the contact we have just created on Hubspot
        cy.request("GET", reqURL).then((resp) => {
            const body = resp.body;
            // for (const [key, value] of Object.entries(body)) {
            //     cy.log(`${key}: ${value}`);
            // }
            cy.wrap(body).its("firstname").should("eq", firstName);
            cy.wrap(body).its("lastname").should("eq", lastName);
            cy.wrap(body).its("email").should("eq", email);
            cy.wrap(body).its("lead_status").should("eq", "OUT_OF_AREA");
            cy.wrap(body).its("lifecycle_stage").should("eq", "lead");
        });
    });

    it("Address City is disabled and is therefore out of area", () => {
        const address = "b1 2lf";
        const email = `outofareatst++${Date.now()}@example.com`;
        const reqURL = `${marketingUrl}/api/contact_info_for_e2e/?email=${encodeURIComponent(email)}`;

        // Fill in the details form
        // Enter a partial address and click google suggestion
        cy.get('[data-test="property-address-initial-forecast"]').click().type(address);
        // TODO: Because postcodes aren't currently showing on staging we shouldn't be clicking the google dropdown
        // cy.waitFor(".pac-item");
        // cy.get(".pac-item").click();
        // cy.get('[data-test="property-address-initial-forecast"]').should("have.value", addressOne);

        // Add a bedroom
        cy.get('[data-test="plus-bedroom-initial-forecast"]').click();

        // Add email address
        cy.get('[data-test="email-initial-forecast"]').click().type(email);

        // Click I agree
        cy.get("[data-test=in-page-initial-forecast-privacy]").click();

        // Click calculate income button
        cy.get("[data-test=in-page-initial-forecast-calculate-income]").click();

        // Availability form

        // Click 6 months +
        cy.waitFor('[data-test="full-time"]');
        cy.get('[data-test="full-time"]').click();

        // click whole property
        cy.get('[data-test="whole-property"]').click();

        // Click ASAP
        cy.get('[data-test="asap"]').click();

        // Click confirm availability
        cy.get('[data-test="confirm-availability-initial-forecast"]').click();

        // Contact details form
        // Enter name
        cy.waitFor('[data-test="full-name"]');
        cy.get('[data-test="full-name"]')
            .click()
            .type(firstName + " " + lastName);

        // Enter phone number
        cy.get('[data-test="phone-number"]').click().type(phoneNumber);

        // Click opt in 'yes'
        cy.get('[data-test="opt-in"]').click();

        // click calculate income
        cy.get('[data-test="confirm-contact-details-initial-forecast"]').click();

        // Check message on disqualified screen
        cy.get("#forecast-unsuccessful > .lead_capture_journey__prompt > p").contains(
            "We’re sorry but we cannot service your property"
        );

        // Give Hubspot a second or two.
        cy.wait(waitTimeForHubspot);

        // Get details of the contact we have just created on Hubspot
        cy.request("GET", reqURL).then((resp) => {
            const body = resp.body;
            // for (const [key, value] of Object.entries(body)) {
            //     cy.log(`${key}: ${value}`);
            // }
            cy.wrap(body).its("firstname").should("eq", firstName);
            cy.wrap(body).its("lastname").should("eq", lastName);
            cy.wrap(body).its("email").should("eq", email);
            cy.wrap(body).its("lead_status").should("eq", "OUT_OF_AREA");
            cy.wrap(body).its("lifecycle_stage").should("eq", "lead");
        });
    });

    it("Test book-a-call and forecast flow", () => {
        const address = "SW1W 9SR";
        const email = `bookacallforecastflowtst++${Date.now()}@example.com`;
        const reqURL = `${marketingUrl}/api/contact_info_for_e2e/?email=${encodeURIComponent(email)}`;

        // Fill in the details form
        // Enter a partial address and click google suggestion
        cy.get('[data-test="property-address-initial-forecast"]').click().type(address);
        // TODO: Because postcodes aren't currently showing on staging we shouldn't be clicking the google dropdown
        // cy.waitFor(".pac-item");
        // cy.get(".pac-item").click();
        // cy.get('[data-test="property-address-initial-forecast"]').should("have.value", addressOne);

        // Add a bedroom
        cy.get('[data-test="plus-bedroom-initial-forecast"]').click();

        // Add email address
        cy.get('[data-test="email-initial-forecast"]').click().type(email);

        // Click I agree
        cy.get("[data-test=in-page-initial-forecast-privacy]").click();

        // Click calculate income button
        cy.get("[data-test=in-page-initial-forecast-calculate-income]").click();

        // Availability form

        // Click 6 months +
        cy.waitFor('[data-test="full-time"]');
        cy.get('[data-test="full-time"]').click();

        // click whole property
        cy.get('[data-test="whole-property"]').click();

        // Click ASAP
        cy.get('[data-test="asap"]').click();

        // Click confirm availability
        cy.get('[data-test="confirm-availability-initial-forecast"]').click();

        // Contact details form
        // Enter name
        cy.waitFor('[data-test="full-name"]');
        cy.get('[data-test="full-name"]')
            .click()
            .type(firstName + " " + lastName);

        // Enter phone number
        cy.get('[data-test="phone-number"]').click().type(phoneNumber);

        // Click opt in 'yes'
        cy.get('[data-test="opt-in"]').click();

        // click calculate income
        cy.get('[data-test="confirm-contact-details-initial-forecast"]').click();

        // Forecast screen
        // Congratulations is shown.
        cy.waitFor('[data-test="snippet-heading"]');
        cy.get('[data-test="snippet-heading"]').contains("Congratulations!");

        // Click book a call button
        cy.get('[data-test="book-a-call-initial-forecast"]').click();

        // Give Hubspot some time
        cy.wait(waitTimeForHubspot);

        // Interact with the calendly iframe
        cy.enter("[data-js='calendly-widget-container'] iframe").then((getBody) => {
            // close cookie popup if it appears
            getBody().then(($body) => {
                const closeCookiePopupButtonSelector = "#onetrust-accept-btn-handler";
                if ($body.find(closeCookiePopupButtonSelector).length > 0) {
                    getBody().find(closeCookiePopupButtonSelector).click();
                }
            });

            getBody().find("button[aria-label='Go to next month']").click();
            cy.wait(1000);

            // Select first available date
            getBody().find("tr:has(button:enabled):first>td:has(button:enabled):first>button:enabled").click();
            cy.wait(1000);

            // Select first available time
            getBody().find("div[data-component='spot-list']>div:first button[data-container='time-button']").click();
            cy.wait(1000);

            // Confirm
            getBody().find("div[data-component='spot-list']>div:first button[data-container='confirm-button']").click();
            cy.wait(1000);

            // submit details form
            getBody().find('button[type="submit"]').click();
        });
        // Close modal
        cy.waitFor("[data-js='with-details']");
        cy.get("button[data-js='cta-finish']").click();

        // Get details of the contact we have just created on Hubspot
        cy.request("GET", reqURL).then((resp) => {
            const body = resp.body;
            // for (const [key, value] of Object.entries(body)) {
            //     cy.log(`${key}: ${value}`);
            // }
            cy.wrap(body).its("firstname").should("eq", firstName);
            cy.wrap(body).its("lastname").should("eq", lastName);
            cy.wrap(body).its("email").should("eq", email);
            cy.wrap(body).its("lead_status").should("eq", "CALL_BOOKED");
            cy.wrap(body).its("lifecycle_stage").should("eq", "salesqualifiedlead");
        });
    });

    it("Test book-a-viewing and forecast flow", () => {
        const address = "SW1W 9SR";
        const email = `bookaviewingforecastflowtst++${Date.now()}@example.com`;
        const reqURL = `${marketingUrl}/api/contact_info_for_e2e/?email=${encodeURIComponent(email)}`;

        // Fill in the details form
        // Enter a partial address and click google suggestion
        cy.get('[data-test="property-address-initial-forecast"]').click().type(address);
        // TODO: Because postcodes aren't currently showing on staging we shouldn't be clicking the google dropdown
        // cy.waitFor(".pac-item");
        // cy.get(".pac-item").click();
        // cy.get('[data-test="property-address-initial-forecast"]').should("have.value", addressOne);

        // Add a bedroom
        cy.get('[data-test="plus-bedroom-initial-forecast"]').click();

        // Add email address
        cy.get('[data-test="email-initial-forecast"]').click().type(email);

        // Click I agree
        cy.get("[data-test=in-page-initial-forecast-privacy]").click();

        // Click calculate income button
        cy.get("[data-test=in-page-initial-forecast-calculate-income]").click();

        // Availability form

        // Click 6 months +
        cy.waitFor('[data-test="full-time"]');
        cy.get('[data-test="full-time"]').click();

        // click whole property
        cy.get('[data-test="whole-property"]').click();

        // Click ASAP
        cy.get('[data-test="asap"]').click();

        // Click confirm availability
        cy.get('[data-test="confirm-availability-initial-forecast"]').click();

        // Contact details form
        // Enter name
        cy.waitFor('[data-test="full-name"]');
        cy.get('[data-test="full-name"]')
            .click()
            .type(firstName + " " + lastName);

        // Enter phone number
        cy.get('[data-test="phone-number"]').click().type(phoneNumber);

        // Click opt in 'yes'
        cy.get('[data-test="opt-in"]').click();

        // click calculate income
        cy.get('[data-test="confirm-contact-details-initial-forecast"]').click();

        // Forecast screen
        // Congratulations is shown.
        cy.waitFor('[data-test="snippet-heading"]');
        cy.get('[data-test="snippet-heading"]').contains("Congratulations!");

        // // Click book a call button
        cy.get('[data-test="book-a-visit-initial-forecast"]').click();

        // Give Hubspot some time
        cy.wait(waitTimeForHubspot);

        // Thanks for requesting a viewing message is shown
        cy.get('[style=""] > .lead_capture_journey__prompt > p').contains("Thanks for requesting a viewing");

        // Get details of the contact we have just created on Hubspot
        cy.request("GET", reqURL).then((resp) => {
            const body = resp.body;
            // for (const [key, value] of Object.entries(body)) {
            //     cy.log(`${key}: ${value}`);
            // }
            cy.wrap(body).its("firstname").should("eq", firstName);
            cy.wrap(body).its("lastname").should("eq", lastName);
            cy.wrap(body).its("email").should("eq", email);
            cy.wrap(body).its("lead_status").should("eq", "VIEWING_REQUESTED");
            cy.wrap(body).its("lifecycle_stage").should("eq", "salesqualifiedlead");
        });
    });

    it("Incompatible Availability test", () => {
        const address = "Sw1w 9sR";
        const email = `imcompatibleavailabilitytst++${Date.now()}@example.com`;
        const reqURL = `${Cypress.env("marketingUrl")}/api/contact_info_for_e2e/?email=${encodeURIComponent(email)}`;

        // Fill in the details form
        // Enter a partial address and click google suggestion
        cy.get('[data-test="property-address-initial-forecast"]').click().type(address);
        // TODO: Because postcodes aren't currently showing on staging we shouldn't be clicking the google dropdown
        // cy.waitFor(".pac-item");
        // cy.get(".pac-item").click();
        // cy.get('[data-test="property-address-initial-forecast"]').should("have.value", addressOne);

        // Add a bedroom
        cy.get('[data-test="plus-bedroom-initial-forecast"]').click();

        // Add email address
        cy.get('[data-test="email-initial-forecast"]').click().type(email);

        // Click I agree
        cy.get("[data-test=in-page-initial-forecast-privacy]").click();

        // Click calculate income button
        cy.get("[data-test=in-page-initial-forecast-calculate-income]").click();

        // Availability form

        // Click click less than a month
        cy.waitFor('[data-test="short-term"]');
        cy.get('[data-test="short-term"]').click();

        // click private room
        cy.get('[data-test="private-room"]').click();

        // Click ASAP
        cy.get('[data-test="asap"]').click();

        // Click confirm availability
        cy.get('[data-test="confirm-availability-initial-forecast"]').click();

        // We should see a message saying that we cannot manage the property
        cy.get(".lead_capture_journey__form--default-direct-p > .lead_capture_journey__prompt > p").contains(
            "Sorry, we can't manage your property"
        );

        // Give Hubspot a second or two.
        cy.wait(waitTimeForHubspot);

        // Get details of the contact we have just created on Hubspot
        cy.request("GET", reqURL).then((resp) => {
            const body = resp.body;
            // for (const [key, value] of Object.entries(body)) {
            //     cy.log(`${key}: ${value}`);
            // }
            cy.wrap(body).its("email").should("eq", email);
            cy.wrap(body).its("lead_status").should("eq", "UNQUALIFIED");
            cy.wrap(body).its("lifecycle_stage").should("eq", "lead");
            cy.wrap(body).its("availability_type").should("eq", "0-4 Weeks");
            cy.wrap(body).its("property_type").should("eq", "Private Room");
        });
    });
});
