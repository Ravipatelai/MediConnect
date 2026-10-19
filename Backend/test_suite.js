const http = require("http");

const BASE_URL = "http://localhost:5000";

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsed,
        });
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("==========================================");
  console.log("   MEDICONNECT FULL TEST SUITE EXECUTION   ");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = "") {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} - ${detail}`);
      failed++;
    }
  }

  try {
    // 1. Test Server Root
    const rootRes = await request("GET", "/");
    assert(rootRes.status === 200 && rootRes.data.success === true, "1. Server Health Check GET /");

    // 2. Test Doctor All (Handle Empty List Gracefully without 404)
    const emptyDocsRes = await request("GET", "/api/doctor/all");
    assert(
      emptyDocsRes.status === 200 && Array.isArray(emptyDocsRes.data),
      "2. GET /api/doctor/all returns 200 with an array (Fixes 404 issue)"
    );

    // 3. Prevent Public Admin Registration Escalation
    const adminEscalateRes = await request("POST", "/api/auth/register", {
      name: "Hacker",
      email: `hacker_${Date.now()}@test.com`,
      password: "password123",
      role: "admin",
    });
    assert(
      adminEscalateRes.status === 400 && adminEscalateRes.data.success === false,
      "3. Public registration rejects role 'admin' with HTTP 400"
    );

    // 4. Register Patient
    const unique = Date.now();
    const patientEmail = `patient_${unique}@test.com`;
    const patientPassword = "password123";
    const patientRegRes = await request("POST", "/api/auth/register", {
      name: "Test Patient",
      email: patientEmail,
      password: patientPassword,
      role: "patient",
    });
    assert(
      patientRegRes.status === 201 && patientRegRes.data.token && patientRegRes.data.user.role === "patient",
      "4. Patient Registration POST /api/auth/register"
    );
    const patientToken = patientRegRes.data.token;

    // 5. Register Doctor
    const doctorEmail = `doctor_${unique}@test.com`;
    const doctorPassword = "password123";
    const doctorRegRes = await request("POST", "/api/auth/register", {
      name: "Dr. Test Specialist",
      email: doctorEmail,
      password: doctorPassword,
      role: "doctor",
    });
    assert(
      doctorRegRes.status === 201 && doctorRegRes.data.token && doctorRegRes.data.user.role === "doctor",
      "5. Doctor Registration POST /api/auth/register"
    );
    const doctorToken = doctorRegRes.data.token;

    // 6. Login as Admin using fixed credentials from .env
    const adminLoginRes = await request("POST", "/api/auth/login", {
      email: "ad@12",
      password: "1234",
    });
    assert(
      adminLoginRes.status === 200 && adminLoginRes.data.user?.role === "admin",
      "6. Admin Login with configured credentials (ad@12 / 1234)"
    );
    const adminToken = adminLoginRes.data.token;

    // 7. Role Authorization: Patient blocked from Admin endpoints
    const patientAdminRes = await request("GET", "/api/admin/patients", null, {
      Authorization: `Bearer ${patientToken}`,
    });
    assert(patientAdminRes.status === 403, "7. Patient blocked from Admin endpoint (HTTP 403)");

    // 8. Role Authorization: Doctor blocked from Admin endpoints
    const doctorAdminRes = await request("GET", "/api/admin/pending-doctors", null, {
      Authorization: `Bearer ${doctorToken}`,
    });
    assert(doctorAdminRes.status === 403, "8. Doctor blocked from Admin endpoint (HTTP 403)");

    // 9. Doctor updates details/availability
    const docUpdateRes = await request(
      "POST",
      "/api/doctor/add-details",
      {
        experience: 7,
        specialization: "Cardiology",
        availableSlots: ["10:00 AM", "11:00 AM", "02:00 PM"],
        fee: 750,
      },
      {
        Authorization: `Bearer ${doctorToken}`,
      }
    );
    assert(
      docUpdateRes.status === 200 || docUpdateRes.status === 201,
      "9. Doctor adds/updates availability & fee without 400 error"
    );

    // 10. Doctor views own profile
    const docProfileRes = await request("GET", "/api/doctor/profile", null, {
      Authorization: `Bearer ${doctorToken}`,
    });
    assert(
      docProfileRes.status === 200 && docProfileRes.data.specialization === "Cardiology",
      "10. Doctor views profile GET /api/doctor/profile"
    );
    const doctorMongoId = docProfileRes.data._id;

    // 11. Admin verifies Doctor
    const pendingRes = await request("GET", "/api/admin/pending-doctors", null, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(pendingRes.status === 200 && Array.isArray(pendingRes.data.doctors), "11. Admin gets pending doctors list");

    const verifyRes = await request("PATCH", `/api/admin/verify-doctor/${doctorMongoId}`, {}, {
      Authorization: `Bearer ${adminToken}`,
    });
    assert(verifyRes.status === 200 && verifyRes.data.doctor?.isVerified === true, "12. Admin verifies doctor PATCH /api/admin/verify-doctor/:id");

    // 12. Verified doctor now shows in public /api/doctor/all
    const verifiedDocsRes = await request("GET", "/api/doctor/all");
    const foundDoc = verifiedDocsRes.data.find((d) => d._id === doctorMongoId);
    assert(Boolean(foundDoc), "13. Verified doctor appears in GET /api/doctor/all");

    // 13. Patient books appointment
    const bookingDate = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // Tomorrow
    const bookRes = await request(
      "POST",
      "/api/patient/book",
      {
        doctorId: doctorMongoId,
        date: bookingDate,
        slot: "10:00 AM",
        reason: "Regular Heart Checkup",
        paymentStatus: "paid",
      },
      {
        Authorization: `Bearer ${patientToken}`,
      }
    );
    assert(
      bookRes.status === 201 && bookRes.data.appointment?._id,
      "14. Patient books appointment with date, slot, and reason"
    );
    const appointmentId = bookRes.data.appointment._id;

    // 14. Prevent double booking same slot
    const doubleBookRes = await request(
      "POST",
      "/api/patient/book",
      {
        doctorId: doctorMongoId,
        date: bookingDate,
        slot: "10:00 AM",
        reason: "Another issue",
        paymentStatus: "paid",
      },
      {
        Authorization: `Bearer ${patientToken}`,
      }
    );
    assert(doubleBookRes.status === 400, "15. Double booking the same slot is prevented with HTTP 400");

    // 15. Patient views upcoming appointments
    const patientApptsRes = await request("GET", "/api/patient/appointments", null, {
      Authorization: `Bearer ${patientToken}`,
    });
    assert(
      patientApptsRes.status === 200 && patientApptsRes.data.length > 0,
      "16. Patient views upcoming appointments GET /api/patient/appointments"
    );

    // 16. Doctor views scheduled appointments
    const docScheduleRes = await request("GET", "/api/doctor/schedule", null, {
      Authorization: `Bearer ${doctorToken}`,
    });
    assert(
      docScheduleRes.status === 200 && docScheduleRes.data.some((a) => a._id === appointmentId),
      "17. Doctor views scheduled appointments GET /api/doctor/schedule"
    );

    // 17. Doctor confirms appointment & records earnings
    const confirmRes = await request(
      "PUT",
      "/api/doctor/update-status",
      {
        appointmentId,
        status: "confirmed",
        videoCallLink: `https://meet.jit.si/healthapp-${appointmentId}`,
      },
      {
        Authorization: `Bearer ${doctorToken}`,
      }
    );
    assert(confirmRes.status === 200 && confirmRes.data.appointment?.status === "confirmed", "18. Doctor confirms appointment");

    // 18. Doctor adds earning
    const earnRes = await request(
      "POST",
      "/api/doctor/earnings",
      {
        appointmentId,
        amount: 750,
      },
      {
        Authorization: `Bearer ${doctorToken}`,
      }
    );
    assert(earnRes.status === 200 || earnRes.status === 201, "19. Doctor records consultation earning");

    // 19. Doctor views earnings report
    const earnReportRes = await request("GET", "/api/doctor/earnings-report", null, {
      Authorization: `Bearer ${doctorToken}`,
    });
    assert(
      earnReportRes.status === 200 && earnReportRes.data.total >= 750,
      "20. Doctor views earnings report with accurate total"
    );

    // 20. Mark appointment as completed
    const completeRes = await request(
      "PUT",
      "/api/doctor/update-status",
      {
        appointmentId,
        status: "completed",
      },
      {
        Authorization: `Bearer ${doctorToken}`,
      }
    );
    assert(completeRes.status === 200 && completeRes.data.appointment?.status === "completed", "21. Appointment marked as completed");

    // 21. Patient submits review
    const reviewRes = await request(
      "POST",
      "/api/patient/review",
      {
        doctorId: doctorMongoId,
        appointmentId,
        rating: 5,
        comment: "Excellent and very thorough consultation!",
      },
      {
        Authorization: `Bearer ${patientToken}`,
      }
    );
    assert(reviewRes.status === 201, "22. Patient submits review for completed appointment");

    // 22. Duplicate review check
    const dupReviewRes = await request(
      "POST",
      "/api/patient/review",
      {
        doctorId: doctorMongoId,
        appointmentId,
        rating: 4,
        comment: "Duplicate review attempt",
      },
      {
        Authorization: `Bearer ${patientToken}`,
      }
    );
    assert(dupReviewRes.status === 400, "23. Duplicate review is rejected with HTTP 400");

    // 23. Doctor fetches reviews (verifying { avgRating, totalReviews, reviews })
    const getReviewsRes = await request("GET", "/api/doctor/reviews", null, {
      Authorization: `Bearer ${doctorToken}`,
    });
    assert(
      getReviewsRes.status === 200 &&
        getReviewsRes.data.totalReviews >= 1 &&
        Array.isArray(getReviewsRes.data.reviews),
      "24. Doctor fetches reviews object structure matching frontend format"
    );

    // 24. Patient views consultation history
    const historyRes = await request("GET", "/api/patient/history", null, {
      Authorization: `Bearer ${patientToken}`,
    });
    assert(
      historyRes.status === 200 && historyRes.data.length > 0,
      "25. Patient views completed consultation history"
    );

    // 25. Logout
    const logoutRes = await request("GET", "/api/auth/logout");
    assert(logoutRes.status === 200 && logoutRes.data.success === true, "26. User logout GET /api/auth/logout");

  } catch (error) {
    console.error("Test execution encountered an error:", error);
    failed++;
  }

  console.log("\n==========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================");

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
