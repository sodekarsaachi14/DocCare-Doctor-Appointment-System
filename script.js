
console.log("Welcome to DocCare+");

// Show doctor fields during registration

const registerRole = document.getElementById("registerRole");

if (registerRole) {
    registerRole.addEventListener("change", function () {

        const doctorFields = document.getElementById("doctorFields");

        if (this.value === "doctor") {
            doctorFields.style.display = "block";
        } else {
            doctorFields.style.display = "none";
        }

    });
}

// Search doctors by specialization and location

function searchDoctors() {

    const location = document
        .getElementById("searchLocation")
        .value.toLowerCase().trim();

    const specialization = document
        .getElementById("searchSpecialization")
        .value.toLowerCase();

    const doctors = document.querySelectorAll(".doctor-card");

    let found = 0;

    doctors.forEach(function(doctor) {

        const doctorLocation =
            doctor.dataset.location.toLowerCase();

        const doctorSpecialization =
            doctor.dataset.specialization.toLowerCase();

        const locationMatch =
            !location || doctorLocation.includes(location);

        const specializationMatch =
            !specialization ||
            doctorSpecialization === specialization;

        if (locationMatch && specializationMatch) {
            doctor.style.display = "block";
            found++;
        } else {
            doctor.style.display = "none";
        }

    });

    document.getElementById("noResults").style.display =
        found === 0 ? "block" : "none";
}



// Load selected doctor into booking form

const doctorInput = document.getElementById("doctorName");

if (doctorInput) {

    const params = new URLSearchParams(window.location.search);

    doctorInput.value = params.get("doctor") || "";

    // Prevent selecting past dates
    const dateInput = document.getElementById("appointmentDate");

    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateInput.min = localToday;
}
function bookAppointment(doctorName) {
    window.location.href =
        "booking.html?doctor=" + encodeURIComponent(doctorName);
}

// Submit appointment request

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const appointment = {

            id: Date.now(),
            doctor: document.getElementById("doctorName").value,
            patient: document.getElementById("patientName").value,
            email: document.getElementById("patientEmail").value,
            phone: document.getElementById("patientPhone").value,
            problem: document.getElementById("problem").value,
            date: document.getElementById("appointmentDate").value,
            time: document.getElementById("appointmentTime").value,
            status: "Pending"

        };

        const appointments =
            JSON.parse(localStorage.getItem("appointments")) || [];

        appointments.push(appointment);

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );

        alert("Appointment request submitted successfully!");

        bookingForm.reset();

        window.location.href = "status.html";

    });

}


// DOCTOR DASHBOARD

const doctorAppointments =
    document.getElementById("doctorAppointments");

if (doctorAppointments) {

    function displayDoctorAppointments() {

        const appointments =
            JSON.parse(localStorage.getItem("appointments")) || [];

        document.getElementById("totalAppointments").textContent =
            appointments.length;

        document.getElementById("pendingAppointments").textContent =
            appointments.filter(a => a.status === "Pending").length;

        document.getElementById("confirmedAppointments").textContent =
            appointments.filter(a => a.status === "Confirmed").length;

        doctorAppointments.innerHTML = "";

        if (appointments.length === 0) {
            doctorAppointments.innerHTML =
                "<p>No appointment requests available.</p>";
            return;
        }

        appointments.forEach(function(appointment) {

            const card = document.createElement("div");
            card.className = "appointment-card";

            card.innerHTML = `
                <h2>${appointment.patient}</h2>
                <p><strong>Doctor:</strong> ${appointment.doctor}</p>
                <p><strong>Email:</strong> ${appointment.email}</p>
                <p><strong>Phone:</strong> ${appointment.phone}</p>
                <p><strong>Problem:</strong> ${appointment.problem}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time}</p>
                <p><strong>Status:</strong> ${appointment.status}</p>

                <button class="accept-btn"
                    onclick="updateAppointment(${appointment.id}, 'Confirmed')">
                    Accept
                </button>

                <button class="reject-btn"
                    onclick="updateAppointment(${appointment.id}, 'Rejected')">
                    Reject
                </button>
            `;

            doctorAppointments.appendChild(card);

        });

    }

    displayDoctorAppointments();

}


// ACCEPT OR REJECT APPOINTMENT

function updateAppointment(id, newStatus) {

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const appointment = appointments.find(a => a.id === id);

    if (appointment) {

        appointment.status = newStatus;

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );

        alert("Appointment " + newStatus + " successfully!");

        location.reload();

    }

}

// ADMIN DASHBOARD

const adminAppointments =
    document.getElementById("adminAppointments");

if (adminAppointments) {

    function displayAdminAppointments() {

        const appointments =
            JSON.parse(localStorage.getItem("appointments")) || [];

        document.getElementById("adminTotal").textContent =
            appointments.length;

        document.getElementById("adminPending").textContent =
            appointments.filter(a => a.status === "Pending").length;

        document.getElementById("adminConfirmed").textContent =
            appointments.filter(a => a.status === "Confirmed").length;

        adminAppointments.innerHTML = "";

        if (appointments.length === 0) {
            adminAppointments.textContent = "No bookings available.";
            return;
        }

        appointments.forEach(function(a) {

            const card = document.createElement("div");
            card.className = "appointment-card";

            const heading = document.createElement("h2");
            heading.textContent = a.patient;

            const details = document.createElement("p");
            details.textContent =
                "Doctor: " + a.doctor +
                " | Date: " + a.date +
                " | Time: " + a.time +
                " | Status: " + a.status;

            card.append(heading, details);
            adminAppointments.appendChild(card);

        });
    }

    displayAdminAppointments();
}

// PATIENT FEEDBACK

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {

    feedbackForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const feedback = {
            name: document.getElementById("feedbackName").value,
            doctor: document.getElementById("feedbackDoctor").value,
            rating: document.getElementById("rating").value,
            message: document.getElementById("feedbackMessage").value
        };

        const feedbacks =
            JSON.parse(localStorage.getItem("feedbacks")) || [];

        feedbacks.push(feedback);

        localStorage.setItem(
            "feedbacks",
            JSON.stringify(feedbacks)
        );

        document.getElementById("feedbackMessageStatus").textContent =
            "Thank you! Your feedback has been submitted.";

        feedbackForm.reset();
    });
}
