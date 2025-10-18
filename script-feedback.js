let selectedRating = 0

document.addEventListener("DOMContentLoaded", () => {
  setupStarRating()
  setupFormValidation()
})

function setupStarRating() {
  const stars = document.querySelectorAll(".star-rating i")
  const ratingValue = document.getElementById("rating-value")
  const ratingText = document.getElementById("rating-text")

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"]

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      selectedRating = Number.parseInt(this.getAttribute("data-rating"))
      ratingValue.value = selectedRating

      // Update star display
      stars.forEach((s, index) => {
        if (index < selectedRating) {
          s.classList.add("active")
          s.classList.remove("bi-star")
          s.classList.add("bi-star-fill")
        } else {
          s.classList.remove("active")
          s.classList.remove("bi-star-fill")
          s.classList.add("bi-star")
        }
      })

      // Update rating text
      ratingText.textContent = ratingLabels[selectedRating - 1]
      ratingText.style.color = "#f0aa64"
      ratingText.style.fontWeight = "600"

      validateForm()
    })

    // Hover effect
    star.addEventListener("mouseenter", function () {
      const rating = Number.parseInt(this.getAttribute("data-rating"))
      stars.forEach((s, index) => {
        if (index < rating) {
          s.style.color = "#f0aa64"
        }
      })
    })

    star.addEventListener("mouseleave", () => {
      stars.forEach((s, index) => {
        if (index < selectedRating) {
          s.style.color = "#f0aa64"
        } else {
          s.style.color = "#e0dbd0"
        }
      })
    })
  })
}

function setupFormValidation() {
  const form = document.getElementById("feedback-form")
  const inputs = form.querySelectorAll("input[required], textarea[required]")

  inputs.forEach((input) => {
    input.addEventListener("input", validateForm)
  })
}

function validateForm() {
  const name = document.getElementById("guest-name").value.trim()
  const email = document.getElementById("guest-email").value.trim()
  const feedback = document.getElementById("feedback-text").value.trim()
  const submitBtn = document.getElementById("submit-btn")

  if (selectedRating > 0 && name && email && feedback) {
    submitBtn.disabled = false
  } else {
    submitBtn.disabled = true
  }
}

function submitFeedback(event) {
  event.preventDefault()

  // Get form data
  const formData = {
    rating: selectedRating,
    name: document.getElementById("guest-name").value,
    email: document.getElementById("guest-email").value,
    bookingRef: document.getElementById("booking-ref").value,
    categories: Array.from(document.querySelectorAll('input[name="category"]:checked')).map((cb) => cb.value),
    feedback: document.getElementById("feedback-text").value,
  }

  console.log("[v0] Feedback submitted:", formData)

  // Show success modal
  document.getElementById("success-modal").classList.add("show")
}

function closeSuccessModal() {
  document.getElementById("success-modal").classList.remove("show")
  // Reset form
  document.getElementById("feedback-form").reset()
  selectedRating = 0
  document.querySelectorAll(".star-rating i").forEach((star) => {
    star.classList.remove("active", "bi-star-fill")
    star.classList.add("bi-star")
    star.style.color = "#e0dbd0"
  })
  document.getElementById("rating-text").textContent = "Click on a star to rate"
  document.getElementById("rating-text").style.color = "#777"
  document.getElementById("rating-text").style.fontWeight = "normal"
}
