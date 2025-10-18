// Load booking data from sessionStorage
document.addEventListener("DOMContentLoaded", () => {
  loadBookingData()
})

function loadBookingData() {
  // Get data from sessionStorage (set from previous steps)
  const bookingData = {
    reference: sessionStorage.getItem("bookingReference") || "ELN-2025-1006",
    guestName: sessionStorage.getItem("guestName") || "Pearl Roxas",
    guestEmail: sessionStorage.getItem("guestEmail") || "pearl.roxas@email.com",
    guestPhone: sessionStorage.getItem("guestPhone") || "+63 912 345 6789",
    checkinDate: sessionStorage.getItem("checkinDate") || "October 26, 2025",
    checkoutDate: sessionStorage.getItem("checkoutDate") || "October 27, 2025",
    duration: sessionStorage.getItem("duration") || "Day Tour (8:00 AM - 6:00 PM)",
    numGuests: sessionStorage.getItem("numGuests") || "35",
    packageName: sessionStorage.getItem("packageName") || "Lower Pool (40 PAX)",
    totalAmount: sessionStorage.getItem("totalAmount") || "₱6,000",
  }

  // Populate the confirmation page
  document.getElementById("booking-ref-display").textContent = bookingData.reference
  document.getElementById("guest-name").textContent = bookingData.guestName
  document.getElementById("guest-email").textContent = bookingData.guestEmail
  document.getElementById("guest-phone").textContent = bookingData.guestPhone
  document.getElementById("checkin-date").textContent = bookingData.checkinDate
  document.getElementById("checkout-date").textContent = bookingData.checkoutDate
  document.getElementById("duration").textContent = bookingData.duration
  document.getElementById("num-guests").textContent = bookingData.numGuests
  document.getElementById("package-name").textContent = bookingData.packageName
  document.getElementById("total-amount").textContent = bookingData.totalAmount
}
