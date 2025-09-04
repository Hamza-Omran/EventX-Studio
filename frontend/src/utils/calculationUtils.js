

export const calculateDashboardStats = (events, ticketStats) => {
    const numEvents = events.length;
    const numBookings = events.reduce((sum, e) => sum + (e.seatAmount - e.availableSeats), 0);
    const revenue = events.reduce((sum, e) => sum + ((e.seatAmount - e.availableSeats) * e.ticketPrice), 0);
    const engagementArr = Object.entries(ticketStats.ticketsByEvent || {}).map(([event, count]) => ({ event, count }));
    const revenueByDay = {};
    events.forEach(e => {
        const day = new Date(e.date).toISOString().split("T")[0];
        const rev = (e.seatAmount - e.availableSeats) * e.ticketPrice;
        if (!revenueByDay[day]) revenueByDay[day] = 0;
        revenueByDay[day] += rev;
    });
    const revenueDayArr = Object.entries(revenueByDay).map(([day, revenue]) => ({ day, revenue }));

    return {
        numEvents,
        numBookings,
        revenue,
        engagementArr,
        totalTickets: ticketStats.totalTickets || 0,
        revenueDayArr
    };
};

export const calculateAnalyticsStats = (rawData) => {
    const { events, users, tickets } = rawData;
    const getAgeGroup = (age) => {
        if (age >= 18 && age <= 25) return "18-25";
        if (age >= 26 && age <= 35) return "26-35";
        if (age >= 36 && age <= 50) return "36-50";
        return "Other";
    };
    const mostCommon = (obj) => {
        let maxKey = "N/A", maxVal = 0;
        for (const key in obj) {
            if (obj[key] > maxVal) {
                maxKey = key;
                maxVal = obj[key];
            }
        }
        return maxKey;
    };
    let ageGroups = {};
    let genderCounts = {};
    let locationCounts = {};
    let interestCounts = {};

    users.forEach(user => {
        if (user.age) {
            const group = getAgeGroup(user.age);
            ageGroups[group] = (ageGroups[group] || 0) + 1;
        }
        if (user.gender) {
            genderCounts[user.gender] = (genderCounts[user.gender] || 0) + 1;
        }
        if (user.location) {
            locationCounts[user.location] = (locationCounts[user.location] || 0) + 1;
        }
        if (user.interests && Array.isArray(user.interests)) {
            user.interests.forEach(interest => {
                interestCounts[interest] = (interestCounts[interest] || 0) + 1;
            });
        }
    });
    let totalRevenue = 0;
    tickets.forEach(ticket => {
        if (ticket.event && ticket.event.ticketPrice) {
            totalRevenue += ticket.event.ticketPrice;
        }
    });

    return {
        totalEvents: events.length,
        totalTickets: tickets.length,
        totalRevenue,
        attendeeCount: users.length,
        attendeeAge: mostCommon(ageGroups),
        attendeeGender: mostCommon(genderCounts),
        attendeeLocation: mostCommon(locationCounts),
        attendeeInterest: mostCommon(interestCounts),
        attendeeLocations: locationCounts,
        ageGroups,
        interests: interestCounts
    };
};

export const calculateEventInsights = (rawData) => {
    const { event, tickets, attendees } = rawData;
    let attendeeLocations = {};
    let ageGroups = {};
    let interests = {};

    attendees.forEach(user => {
        if (!user) return;
        if (user.location) {
            attendeeLocations[user.location] = (attendeeLocations[user.location] || 0) + 1;
        }
        if (user.age) {
            const group = user.age >= 26 && user.age <= 35 ? "26-35" :
                         user.age >= 18 && user.age <= 25 ? "18-25" :
                         user.age >= 36 && user.age <= 50 ? "36-50" : "Other";
            ageGroups[group] = (ageGroups[group] || 0) + 1;
        }
        if (user.interests && Array.isArray(user.interests)) {
            user.interests.forEach(interest => {
                interests[interest] = (interests[interest] || 0) + 1;
            });
        }
    });
    const revenue = tickets.length * (event.ticketPrice || 0);

    return {
        totalAttendees: attendees.length,
        revenue,
        attendeeLocations,
        ageGroups,
        interests,
        event
    };
};
