import portfolio from "../selectors/portfolio";
const connectUrl = Cypress.env("connectUrl");
export class Portfolio {
    navigateToPortfolioTab() {
        cy.get(portfolio.portfolioTab).click();
        cy.url().should("contain", "/portfolio");
    }

    clickOnAvailabilityDropdown() {
        cy.xpath(portfolio.availabilityDropdown).click({ force: true });
    }

    selectOptionFromDropdown(option) {
        cy.xpath(portfolio.option.replace("option", option)).click({ force: true });
        //wait 1 sec to load the results
        cy.wait(1000);
    }

    verifyResults(option) {
        cy.url().then((url) => {
            this.getResultsCount().then((count) => {
                if (count > 0) {
                    for (var i = 1; i <= count; i++) {
                        cy.xpath('(//p[@class="prop-cont"]//a)[count]'.replace("count", i))
                            .invoke("attr", "href")
                            .then((property) => {
                                cy.visit(connectUrl + property);
                                this.verifyAvailabiltyStatusOfTheProperty(option);
                                cy.visit(url);
                            });
                    }
                }
            });
        });
    }

    clickOnAvailabilityWindowDropdown() {
        cy.xpath(portfolio.availabilityWindowDropdown).click({ force: true });
    }

    clickOnAccountManagerDropdown() {
        cy.xpath(portfolio.accountManagerDropdown).click({ force: true });
    }

    clickOnPriceSourceDropdown() {
        cy.xpath(portfolio.priceSourceDropdown).click({ force: true });
    }

    verifyResultsWhenFilterByAvailabilityWindow(option) {
        cy.url().then((url) => {
            this.getResultsCount().then((count) => {
                if (count > 0) {
                    for (var i = 1; i <= count; i++) {
                        cy.xpath('(//p[@class="prop-cont"]//a)[count]'.replace("count", i))
                            .invoke("attr", "href")
                            .then((property) => {
                                cy.visit(connectUrl + property);
                                this.verifyAVailabilityWindowOfTheProperty(option);
                                cy.visit(url);
                            });
                    }
                }
            });
        });
    }

    verifyResultsWhenFilterByAccountManager(option) {
        cy.url().then((url) => {
            this.getResultsCount().then((count) => {
                if (count > 0) {
                    for (var i = 1; i <= count; i++) {
                        cy.xpath('(//p[@class="prop-cont"]//a)[count]'.replace("count", i))
                            .invoke("attr", "href")
                            .then((property) => {
                                cy.visit(connectUrl + property);
                                this.verifyAccountManagerOfTheproperty(option);
                                cy.visit(url);
                            });
                    }
                }
            });
        });
    }

    verifyResultsWhenFilterByPriceSource(option) {
        cy.url().then((url) => {
            this.getResultsCount().then((count) => {
                if (count > 0) {
                    for (var i = 1; i <= count; i++) {
                        cy.xpath('(//p[@class="prop-cont"]//a)[count]'.replace("count", i))
                            .invoke("attr", "href")
                            .then((property) => {
                                cy.visit(connectUrl + property);
                                this.verifyPriceSourceOfTheProperty(option);
                                cy.visit(url);
                            });
                    }
                }
            });
        });
    }

    verifyAvailabiltyStatusOfTheProperty(option) {
        cy.xpath('//*[text()="Availability Status"]/../following-sibling::td').should("have.text", option);
    }

    verifyAVailabilityWindowOfTheProperty(option) {
        cy.xpath('//*[text()="Availability Window"]/../following-sibling::td').should("have.text", option);
    }

    verifyAccountManagerOfTheproperty(option) {
        cy.xpath('//*[text()="Manager"]/../following-sibling::td').should("contain", option);
    }

    verifyPriceSourceOfTheProperty(option) {
        cy.xpath('//*[text()="Connect Pricing Enabled"]/../following-sibling::td').should("contain", option);
    }

    getResultsCount() {
        return cy.get('[class="prop-cont"]').its("length");
    }

    verifyBookingShownOnCalendar(bookingName) {
        cy.xpath('//span[text()[normalize-space()="bookingName"]]'.replace("bookingName", bookingName)).should(
            "be.visible"
        );
    }

    openBookingOnCalender(bookingName) {
        cy.xpath(
            '//span[text()[normalize-space()="bookingName"]]//parent::div//parent::app-calendar-notes//parent::a'.replace(
                "bookingName",
                bookingName
            )
        )
            .invoke("attr", "href")
            .then((bookingId) => {
                cy.visit(connectUrl + bookingId);
                cy.url().should("contain", bookingId);
            });
    }
}
