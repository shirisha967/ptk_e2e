/// <reference types="Cypress" />
import { Bookings } from "../../pages/bookings";
import { Portfolio } from "../../pages/portfolio";
import addMonths from "date-fns/addMonths";
import addDays from "date-fns/addDays";

const booking = new Bookings();
const portfolio = new Portfolio();
const bookingInfo = new Map();

const checkInDate = addMonths(new Date(), 0);
const checkOutDate = addDays(new Date(), 1);

bookingInfo.set("Property", Cypress.env("e2e_test_property_name"));
bookingInfo.set("Listing", "Test Listing");
bookingInfo.set("Guest", "Test Guest");
bookingInfo.set("Email", "testguest@example.com");
bookingInfo.set("Phone", "9867895673");
bookingInfo.set("Number Of Guests", "2");
bookingInfo.set("Net Payment", 2);
bookingInfo.set("Confirmation Code", "TEST");
bookingInfo.set("Check-In Time", "10:20");
bookingInfo.set("Check-Out Time", "12:20");
bookingInfo.set("notes", "Test Booking");

describe("Portfolio calendar", () => {
    beforeEach(() => {
        cy.loginToConnectAsGuestUser();
    });

    it("Verify booking appears on portfolio calendar", () => {
        //Add Booking
        booking.naviagateToBookingsTab();
        booking.clickAddBookingsButton();
        booking.enterBookingDetails(bookingInfo, checkInDate, checkOutDate);
        booking.clickSaveButton();
        //Go to portgolio page
        portfolio.navigateToPortfolioTab();
        //verify booking showing on portfolio calendar
        portfolio.verifyBookingShownOnCalendar(bookingInfo.get("Guest"));
        //Open the booking
        portfolio.openBookingOnCalender(bookingInfo.get("Guest"));
        //cancel Booking
        const paymentAmount = "100%";
        const cancellationDate = addMonths(new Date(), 0);
        const cancellationTime = "11:20";
        booking.clickOnCancelbookingButton();
        booking.enterDetailsToCancelBooking(paymentAmount, cancellationDate, cancellationTime);
        booking.clickSaveButton();
    });
});
