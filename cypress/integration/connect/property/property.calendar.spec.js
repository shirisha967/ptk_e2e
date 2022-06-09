/// <reference types="Cypress" />
import { Bookings } from "../../pages/bookings";
import { Property } from "../../pages/property";
import { Portfolio } from "../../pages/portfolio";
import addDays from "date-fns/addDays";

const booking = new Bookings();
const property = new Property();
const portfolio = new Portfolio();
const bookingInfo = new Map();
var propertyId = " ";

const checkInDate = addDays(new Date(), 0);
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

describe("Property calendar", () => {
    before(() => {
        cy.loginToAdmin();
        cy.ensureTestProperty().then((testPropertyId) => {
            cy.log(testPropertyId);
            propertyId = testPropertyId;
        });
        cy.logoutFromAdmin();
    });
    beforeEach(() => {
        cy.loginToConnectAsGuestUser();
    });

    it("Verify booking appears on property calendar", () => {
        //Naviagte to Bookings tab and create a booking
        booking.naviagateToBookingsTab();
        booking.clickAddBookingsButton();
        booking.enterBookingDetails(bookingInfo, checkInDate, checkOutDate);
        booking.clickSaveButton();
        //Go to Property details page
        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnPropertyCalendarTab();
        //Verify booking showing on Property calender
        portfolio.verifyBookingShownOnCalendar(bookingInfo.get("Guest"));
        //Open the booking
        property.openBookingOnPropertyCalendar(bookingInfo.get("Guest"));
        //Cancel the Booking
        const paymentAmount = "100%";
        const cancellationDate = addDays(new Date(), 0);
        const cancellationTime = "11:20";
        booking.clickOnCancelbookingButton();
        booking.enterDetailsToCancelBooking(paymentAmount, cancellationDate, cancellationTime);
        booking.clickSaveButton();
    });
});
