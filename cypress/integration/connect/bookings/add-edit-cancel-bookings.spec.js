import { Bookings } from "../../pages/bookings";
import addDays from "date-fns/addDays";
import format from "date-fns/format";

const booking = new Bookings();
const bookingInfo = new Map();

const checkInDate = addDays(new Date(), 1);
const checkOutDate = addDays(new Date(), 3);
const checkInDateFormat = format(checkInDate, "d MMM yyyy");
const checkOutDateFormat = format(checkOutDate, "d MMM yyyy");
const date = addDays(new Date(), 0);
const todayDate = format(date, "d MMM yyyy");
const notes = "Test Booking";

bookingInfo.set("Property", Cypress.env("e2e_test_property_name"));
bookingInfo.set("Platform", "Bookingcom");
bookingInfo.set("Listing", "Test Listing");
bookingInfo.set("Guest", "Test Guest");
bookingInfo.set("Email", "testguest@example.com");
bookingInfo.set("Phone", "9867895673");
bookingInfo.set("Number Of Guests", "2");
bookingInfo.set("Check-In Date", checkInDateFormat);
bookingInfo.set("Check-Out Date", checkOutDateFormat);
bookingInfo.set("Nightly Price", 8);
bookingInfo.set("Net Payment", 20);
bookingInfo.set("Mgmt Charge", 20);
bookingInfo.set("Confirmation Code", "TEST");
bookingInfo.set("Booking Taken", todayDate);
bookingInfo.set("Check-In Time", "10:20");
bookingInfo.set("Check-Out Time", "12:20");
bookingInfo.set("notes", notes);

describe("Add Bookings, verify booking information", () => {
    beforeEach(() => {
        cy.loginToConnectAsGuestUser();
    });

    it("Add Booking, verify booking information, Cancel Booking, Delete Booking", () => {
        //Add Booking
        booking.naviagateToBookingsTab();
        booking.clickAddBookingsButton();
        booking.enterBookingDetails(bookingInfo, checkInDate, checkOutDate);
        booking.clickSaveButton();
        //verify booking information
        booking.verifyBookingDetails(bookingInfo);
        booking.verifyCheckInAndCheckOutTiming();
        //verify Jobs
        booking.clickOnJobs();
        booking.verifyJobs();
        //verify Processes
        booking.clickOnProcessesTab();
        booking.verifyProcess();
        //verify payments
        booking.clickOnPaymentsTab();
        booking.verifyPayments(checkOutDateFormat, bookingInfo);
        //click messages
        booking.clickOnMessages();
        //Edit Booking details and verify changes are saved
        const guestNameEdit = "Test";
        const numberofguestEdit = 4;
        const guestEmailEdit = "Test@gmail.com";
        const guestPhoneNumberEdit = "7864567898";
        const checkInDateEdit = addDays(new Date(), 1);
        const checkOutDateEdit = addDays(new Date(), 2);
        const checkInTimeEdit = "07:20";
        const checkOutTimeEdit = "11:20";
        const netPaymentEdit = "565";
        const confirmationCode = "Booking";

        booking.clickOnEditBookingDetailsButton();
        booking.editBookingDetails(
            guestNameEdit,
            guestEmailEdit,
            guestPhoneNumberEdit,
            numberofguestEdit,
            checkInDateEdit,
            checkOutDateEdit,
            checkInTimeEdit,
            checkOutTimeEdit,
            netPaymentEdit,
            confirmationCode,
            notes
        );
        booking.clickSaveButton();
        //Cancel Booking
        const paymentAmount = "100%";
        const cancellationDate = addDays(new Date(), 1);
        const cancellationTime = "11:20";
        booking.clickOnCancelbookingButton();
        booking.enterDetailsToCancelBooking(paymentAmount, cancellationDate, cancellationTime);
        booking.clickSaveButton();
        booking.verifyBookingCancelled();
    });
});
