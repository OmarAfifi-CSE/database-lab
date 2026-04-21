const { connectDb, getPool } = require('./db');

async function seedDatabase() {
    await connectDb(); // التأكد من إنشاء القاعدة والجداول [cite: 31, 32]
    const pool = getPool();

    const users = [
        { fName: 'Ali', lName: 'Hassan', country: 'Egypt', email: 'ali1@mail.com', courses: ['C1', 'C2', 'C3'], projects: ['P1'], langs: ['Arabic', 'English'] },
        { fName: 'Ahmed', lName: 'Amr', country: 'Egypt', email: 'ahmed@mail.com', courses: ['C1'], projects: ['P1'], langs: ['Arabic'] },
        { fName: 'Mona', lName: 'Zaki', country: 'Egypt', email: 'mona@mail.com', courses: [], projects: [], langs: ['Arabic'] },
        { fName: 'John', lName: 'Doe', country: 'USA', email: 'john@mail.com', courses: ['C1', 'C2', 'C3'], projects: ['P1'], langs: ['English', 'Spanish'] },
        { fName: 'Sarah', lName: 'Smith', country: 'USA', email: 'sarah@mail.com', courses: ['C1'], projects: ['P1'], langs: ['English', 'French'] },
        { fName: 'Mike', lName: 'Ross', country: 'USA', email: 'mike@mail.com', courses: ['C1'], projects: ['P1'], langs: ['English'] },
        { fName: 'Omar', lName: 'Khalil', country: 'Palestine', email: 'omar@mail.com', courses: ['C1', 'C2'], projects: ['P1'], langs: ['Arabic'] },
        { fName: 'Layla', lName: 'Noor', country: 'Palestine', email: 'layla@mail.com', courses: ['C1'], projects: ['P1'], langs: ['Arabic'] },
        { fName: 'Rami', lName: 'Adel', country: 'Palestine', email: 'rami@mail.com', courses: [], projects: ['P1'], langs: ['Arabic'] },
        { fName: 'Fatima', lName: 'Ali', country: 'UAE', email: 'fatima@mail.com', courses: ['C1'], projects: ['P1'], langs: ['Arabic', 'English'] }
    ];

    console.log('Starting Seeding...');

    for (const u of users) {
        try {
            // 1. إضافة الشخص [cite: 40]
            const [res] = await pool.query(
                'INSERT INTO person (fName, lName, country, Email) VALUES (?, ?, ?, ?)',
                [u.fName, u.lName, u.country, u.email]
            );
            const personId = res.insertId;

            // 2. إضافة الكورسات
            for (const c of u.courses) {
                await pool.query('INSERT INTO course (name, person_idperson) VALUES (?, ?)', [c, personId]);
            }

            // 3. إضافة المشاريع
            for (const p of u.projects) {
                await pool.query('INSERT INTO project (name, person_idperson) VALUES (?, ?)', [p, personId]);
            }

            // 4. إضافة اللغات
            for (const l of u.langs) {
                await pool.query('INSERT INTO language (name, person_idperson) VALUES (?, ?)', [l, personId]);
            }
            
            console.log(`Added: ${u.fName}`);
        } catch (err) {
            console.log(`Skipped ${u.fName}: ${err.message}`);
        }
    }

    console.log('Seeding Completed!');
    await pool.end();
}

seedDatabase();