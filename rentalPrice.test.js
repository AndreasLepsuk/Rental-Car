const {price, getClazz, get_days, getSeason, getWeekendDays} = require('./rentalPrice');

describe('getClazz()' , () => {

    test('returns correct vehicle classes', () => {
        expect(getClazz('Compact')).toBe('Compact');
        expect(getClazz('Electric')).toBe('Electric');
        expect(getClazz('Cabrio')).toBe('Cabrio');
        expect(getClazz('Racer')).toBe('Racer');
    });

    test('reutrns Unknown for invalid type', () => {
        expect(getClazz('Pickup')).toBe('Unknown');
    });
});

describe('get_days()', () => {

    test('calculates same day rental correctly', () => {
        expect(get_days('2026-01-01', '2026-01-01')).toBe(1)
    });

    test('calculates multiple day rental correctly', () => {
        expect(get_days('2026-01-01', '2026-01-03')).toBe(3)
    });
});

describe('getSeason()', () => {

    test('returns high when pickup is in high season', () => {
        expect(getSeason('2026-06-01', '2026-06-05')).toBe('High')
    });

    test('returns high when dropoff is in high season', () => {
        expect(getSeason('2026-01-01', '2026-05-01')).toBe('High')
    });

    test('returns high when rental lasts across high season', () => {
        expect(getSeason('2026-03-01', '2026-11-01')).toBe('High')
    });

    test('returns low when fully outside high season', () => {
        expect(getSeason('2026-01-01', '2026-02-01')).toBe('Low')
    });
});

describe('price()', () => {

    test('rejects driver under 18', () => {
        const result = price('Tallinn', 'Tallinn', '2024-01-01', '2024-01-02', 'Compact', 17, 5);
        expect(result).toMatch(/Driver too young - cannot quote the price/i);
    });

    test('rejects driver with license under 1 year', () => {
        const result = price('Tallinn', 'Tallinn', '2024-01-01', '2024-01-02', 'Compact', 25, 0.5);
        expect(result).toMatch(/Driver must hold the license for at least 1 year/i);
    });

    test('rejects under 21 year old renting a non-compact car', () => {
        const result = price('Tallinn', 'Tallinn', '2024-01-01', '2024-01-02', 'Racer', 20, 3);
        expect(result).toMatch(/Drivers 21 y.o or less can only rent Compact vehicles/i);
    });

    test('applies Racer high-season multiplier', () => {
        const result = price('Tallinn', 'Tallinn', '2026-06-01', '2026-06-02', 'Racer', 24, 5);
        expect(result).toBe('$72')
    });

    test('applies high-season multiplier', () => {
        const result = price('Tallinn', 'Tallinn', '2026-06-01', '2026-06-02', 'Racer', 30, 5);
        expect(result).toBe('$69')
    });
    

    test('applies low-season discount for rentals longer than 10 days', () => {
        const result = price('Tallinn', 'Tallinn', '2026-01-01', '2026-01-15', 'Compact', 25, 5);
        expect(result).toBe('$342')
        // formula: ((25 * 11) + (25 * 4 * 1.05)) * 0.9 =
    });

    test('applies 30% increase if license is under 2 years', () => {
        const result = price('Tallinn', 'Tallinn', '2026-01-01', '2026-01-02', 'Compact', 30, 1.5);
        expect(result).toBe('$108')
    });

    test('adds 15 units per day when license is under 3 years', () => {
        const result = price('Tallinn', 'Tallinn', '2026-01-01', '2026-01-03', 'Compact', 30, 2.5);
        expect(result).toBe('$136.5')
    });

    test('weekday only rental has no weekend surcharge', () => {
        //mon jan 5 2026 -> wed jan 7 2026
        const result = price('Tallinn', 'Tallinn', '2026-01-05', '2026-01-07', 'Compact', 50, 5);
        expect(result).toBe('$150')
    })

    test('weekday only rental has no weekend surcharge', () => {
        //thu jan 8 2026 -> sat jan 10 2026
        const result = price('Tallinn', 'Tallinn', '2026-01-08', '2026-01-10', 'Compact', 50, 5);
        expect(result).toBe('$152.5')
    })

});
