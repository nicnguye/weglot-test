import moment from 'moment';
import fs from 'fs';

const isTimeSlotAvailable = (start, end, unavailableSlots) => (
    !unavailableSlots.some((slot) => {
        const [startRange, endRange] = slot.split('-');
        const formattedStart = moment(startRange, 'HH:mm');
        const formattedEndRange = moment(endRange, 'HH:mm');

        return (moment(start, 'HH:mm').isBetween(formattedStart, formattedEndRange, undefined, '[]')
            || moment(end, 'HH:mm').isBetween(formattedStart, formattedEndRange, undefined, '[]'));
    })
);

const getTimeSlot = (unavailableSlots, day) => {
    for (let hour = 8; hour <= 17; hour++) {
        for (let minute = 0; minute <= 59; minute++) {
            const startSlot = moment(`${hour}:${minute}`, 'HH:mm');
            const endSlot = moment(startSlot).add(59, 'minutes');

            const formattedStart = startSlot.format('HH:mm');
            const formattedEnd = endSlot.format('HH:mm');

            if (startSlot.isSameOrAfter(moment('08:00', 'HH:mm'))
                && endSlot.isSameOrBefore(moment('17:00', 'HH:mm'))
                && isTimeSlotAvailable(formattedStart, formattedEnd, unavailableSlots)) {

                return `${day} ${formattedStart}-${formattedEnd}`;
            }
        }
    }
}

export const findAvailableSlot = (data) => {
    const timeSlots = data.trim().split('\n');

    // Group time slots per day
    const unavailableTimeSlots = {};
    timeSlots.forEach((slot) => {
        const [day, timeSlot] = slot.trim().split(' ');
        if (!unavailableTimeSlots[day]) {
            unavailableTimeSlots[day] = [];
        }
        unavailableTimeSlots[day].push(timeSlot);
    });

    // Find all slots available for each day
    const slotsFound = [];
    Object.keys(unavailableTimeSlots).forEach((day) => {
        const timeSlot = getTimeSlot(unavailableTimeSlots[day], day);
        if (timeSlot) {
            return slotsFound.push(timeSlot);
        }
    });

    // Return the first time slot found
    return slotsFound.length && slotsFound.shift();
};

// npm run start ./data/input1.txt
if (process.argv.length && process.argv[2]) {
    const input = fs.readFileSync(process.argv[2]).toString();
    console.log(findAvailableSlot(input))
}

