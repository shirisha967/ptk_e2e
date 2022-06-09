import calendar from "../../selectors/portal/calendar";

export class Calendar {
    clickOnCalendarTab() {
        cy.get(calendar.calendarTab).click({ force: true });
        cy.url().should("contain", "/calendar");
    }

    verifyBookingShowingOnCalendar(bookingName) {
        cy.xpath('//span[text()="bookingName"]'.replace("bookingName", bookingName)).should("be.visible");
    }
}
