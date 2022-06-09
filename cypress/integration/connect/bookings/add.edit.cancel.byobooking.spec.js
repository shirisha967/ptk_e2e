/// <reference types="Cypress" />
import { Property } from "../../pages/property";
import { Bookings } from "../../pages/bookings";
import addMonths from "date-fns/addMonths";
import format from "date-fns/format";

const property = new Property();
const booking = new Bookings();
let propertyId = " ";
describe("Add, Edit and Cancel BringYourOwn Booking", () => {
    before(() => {
        cy.loginToAdmin();
        cy.ensureTestProperty().then((testPropertyId) => {
            cy.log(testPropertyId);
            propertyId = testPropertyId;
        });
    });

    beforeEach(() => {
        cy.loginToConnectAsGuestUser();
        property.navigateToThePropertyDetailsPage(propertyId);
        property.clickOnPropertyCalendarTab();
    });

    it("Add, Edit and Cancel BringYourOwn Booking", () => {
        //Add BYO Booking
        property.clickAddByoBookingButton();
        let guestName = "Test";
        let numberOfGuest = 4;
        let guestEmail = "Test@gmail.com";
        let guestPhoneNumber = "7864567898";
        let checkInDate = addMonths(new Date(), 1);
        let checkOutDate = addMonths(new Date(), 2);
        let checkInTime = "10:20";
        let checkOutTime = "12:20";
        let netPayment = "1";
        let cleaningFee = "9";
        let managemantFee = "2";
        let notes = "Test Booking";
        const checkInDateFormat = format(checkInDate, "d MMM yyyy");
        const checkOutDateFormat = format(checkOutDate, "d MMM yyyy");
        booking.enterByoBookingDetails(
            guestName,
            guestEmail,
            guestPhoneNumber,
            numberOfGuest,
            checkInDate,
            checkOutDate,
            checkInTime,
            checkOutTime,
            netPayment,
            cleaningFee,
            managemantFee,
            notes
        );
        booking.clickSaveButton();
        //Verify booking details
        booking.verifyByoBookingDetails(
            guestName,
            guestEmail,
            guestPhoneNumber,
            checkInDateFormat,
            checkOutDateFormat,
            managemantFee,
            cleaningFee
        );
        //Edit Booking
        booking.clickOnEditBookingDetailsButton();
        guestName = "Test Guest";
        numberOfGuest = 2;
        guestEmail = "Testguest@gmail.com";
        guestPhoneNumber = "1234567898";
        checkInDate = addMonths(new Date(), 1);
        checkOutDate = addMonths(new Date(), 2);
        checkInTime = "08:20";
        checkOutTime = "10:20";
        netPayment = "1.00";
        cleaningFee = "3.00";
        managemantFee = "2.00";
        notes = "Test Booking";
        booking.enterByoBookingDetails(
            guestName,
            guestEmail,
            guestPhoneNumber,
            numberOfGuest,
            checkInDate,
            checkOutDate,
            checkInTime,
            checkOutTime,
            netPayment,
            cleaningFee,
            managemantFee,
            notes
        );
        booking.clickSaveButton();
        //Cancel Booking
        const paymentAmount = "100%";
        const cancellationDate = addMonths(new Date(), 1);
        const cancellationTime = "11:20";
        booking.clickOnCancelbookingButton();
        booking.enterDetailsToCancelBooking(paymentAmount, cancellationDate, cancellationTime);
        booking.clickSaveButton();
        booking.verifyBookingCancelled();
    });
});
