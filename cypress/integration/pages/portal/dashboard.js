import dashboard from "../../selectors/portal/dashboard";

export class Dashboard {
    clickOnDashboardTab() {
        cy.get(dashboard.dashboardTab).click({ force: true });
    }

    verifyBookingDatesOnDashboard(checkInDateDay, checkInDatemonth, checkOutDateDay, checkOutDateMonth) {
        cy.get(dashboard.checkInDateDay).should("contain", checkInDateDay);
        cy.get(dashboard.checkInDatemonth).should("contain", checkInDatemonth);
        cy.get(dashboard.checkOutDateDay).should("contain", checkOutDateDay);
        cy.get(dashboard.checkOutDateMonth).should("contain", checkOutDateMonth);
    }
}
