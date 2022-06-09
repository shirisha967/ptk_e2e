import booking from "../../selectors/portal/bookings";

export class Booking {
    clickOnBookingsTab() {
        cy.get(booking.bookingsTab).click({ force: true });
        cy.url().should("contain", "/bookings");
    }

    verifyBookingDetails(checkInDate, checkOutdate, name) {
        cy.get("table > tbody > tr > td:nth-child(2)").should("contain", checkInDate);
        cy.get("table > tbody > tr > td:nth-child(2)").should("contain", checkOutdate);
        cy.get("table > tbody > tr > td:nth-child(3)").should("contain", name);
    }
}
