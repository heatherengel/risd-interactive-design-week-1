(function () {
  // Wolfie's actual birth time from our notes: May 4, 2025 at 4:48 AM America/New_York
  // Using a fixed offset for NYC (EDT) during May: UTC-04:00
  const birthISO = "2025-05-04T04:48:00-04:00";
  const birth = new Date(birthISO);
  const now = new Date();

  // --- Weeks old (floor to whole weeks) ---
  // 7 days in a week * 24 hours in a day * 60 minutes in an hour * 60 seconds in a minute * 1000 milliseconds in a minute
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
  const weeksFloat = (now - birth) / MS_PER_WEEK;
  const weeks = Math.max(0, Math.floor(weeksFloat));

  // --- “About X months” ---
  // Use year-month-day diff for better month accuracy than dividing days by ~30.
  function diffInMonthsApprox(a, b) {
    // a = birth, b = now
    let years = b.getFullYear() - a.getFullYear();
    let months = b.getMonth() - a.getMonth();
    let total = years * 12 + months;

    // Adjust by day-of-month for fractional portion
    const aMonthStart = new Date(b.getFullYear(), b.getMonth(), 1);
    const nextMonthStart = new Date(b.getFullYear(), b.getMonth() + 1, 1);
    const daysInThisMonth = (nextMonthStart - aMonthStart) / (24 * 60 * 60 * 1000);

    // Fraction between current month day and birth day alignment
    let fraction = (b.getDate() - a.getDate()) / daysInThisMonth;

    // If birth day hasn’t occurred yet this month, fraction will be negative; that’s OK
    const approx = total + fraction;

    // Never negative
    return Math.max(0, approx);
  }

  const monthsApprox = diffInMonthsApprox(birth, now);

  // Round to the nearest half month (e.g., 4 months, 4.5 months, etc.)
  const monthsRounded = Math.round(monthsApprox * 2) / 2;

  // If the result is a whole number (e.g., 5.0), display without ".0"
  const monthsDisplay =
    monthsRounded % 1 === 0 ? monthsRounded.toFixed(0) : monthsRounded.toFixed(1);

  // Inject into DOM if targets exist
  const weeksEl = document.getElementById("age-weeks");
  const monthsEl = document.getElementById("age-months");
  if (weeksEl) weeksEl.textContent = weeks.toString();
  if (monthsEl) monthsEl.textContent = monthsDisplay;

  // // (Optional) pluralization for “week” vs “weeks”
  // const weeksHeading = weeksEl?.closest("h2");
  // if (weeksHeading) {
  //  weeksHeading.innerHTML = weeksHeading.innerHTML.replace(
  //    /(week)s?\b/i,
  //    weeks === 1 ? "week" : "weeks"
  //  );
  //}

})();