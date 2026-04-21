/**
 * Database lab — queries.js
 * ---------------------
 * Standalone script: connect to the same DB, run example aggregate SELECTs.
 * Run after you have submitted at least one CV via the web form:
 *   node queries.js
 *   npm run queries
 */

const { connectDb, getPool } = require('./db');

async function runQueries() {
  await connectDb();
  const pool = getPool();
  /* 
    // —— QUERY 1: COUNT — how many courses per person (LEFT JOIN keeps people with 0 courses)
    console.log('\n── QUERY 1: Number of courses per person ──');
  
    const [courseCounts] = await pool.query(`
      SELECT p.fName, p.lName, COUNT(c.idcourse) AS courseCount
      FROM person p
      LEFT JOIN course c ON c.person_idperson = p.idperson
      GROUP BY p.idperson
      ORDER BY courseCount DESC
    `);
  
    courseCounts.forEach(row =>
      console.log(`  ${row.fName} ${row.lName} → ${row.courseCount} course(s)`)
    );
  
    // —— QUERY 2: only persons with more than 1 project
    console.log('\n── QUERY 2: Persons with more than 1 project ──');
  
    const [topPerson] = await pool.query(`
      SELECT p.fName, p.lName, COUNT(pr.idproject) AS projectCount
      FROM person p
      INNER JOIN project pr ON pr.person_idperson = p.idperson
      GROUP BY p.idperson
      HAVING projectCount > 1
      ORDER BY projectCount DESC
    `);
  
    if (topPerson.length > 0) {
      topPerson.forEach(t =>
        console.log(`  ${t.fName} ${t.lName} — ${t.projectCount} project(s)`)
      );
    } else {
      console.log('  No data yet.');
    }
  
    // —— QUERY 3: DISTINCT — list unique countries in person table
    console.log('\n── QUERY 3: Unique countries ──');
  
    const [distinctCountries] = await pool.query(`
      SELECT DISTINCT country
      FROM person
      ORDER BY country ASC
    `);
  
    distinctCountries.forEach(row =>
      console.log(`  ${row.country || 'N/A'}`)
    );
  
    // —— QUERY 4: DELETE — remove persons with no city set
    // console.log('\n── QUERY 4: Delete persons with no city ──');
  
    // const [deleteResult] = await pool.query(`
    //   DELETE FROM person
    //   WHERE city IS NULL OR city = ''
    // `);
  
    // console.log(`  Deleted ${deleteResult.affectedRows} person(s) with no city.`);
  
  // —— QUERY 5: UPDATE — update email for person with id = 1
  console.log('\n── QUERY 5: Update email for person with id = 1 ──');
  
  const [updateResult] = await pool.query(`
    UPDATE person p SET p.email = 'test@updated.com' where p.idperson = 1 ;
  `);
  console.log(`  Updated ${updateResult.affectedRows} person(s) email(s).`);
  
  */
  // ======================================== TASK =============================================================
  // 1- Show persons who are enrolled in more than 2 courses, display their full name and course count

  // 2- list each distinct country and the number of persons in it, only show countries with more than 2 persons

  // 3- Update the email of all persons who have at least one project, set it to their firstName + lastName + '@company.com

  // 4- Delete all courses that belong to persons from a specific country

  // 5- Show each country and the average number of languages spoken by persons from that country, only show countries where the average is more than 1

  // ======================================== TASK SOLUTIONS =============================================================

  // 1- Show persons who are enrolled in more than 2 courses, display their full name and course count
  console.log('\n── TASK 1: Persons with more than 2 courses ──');
  const [task1] = await pool.query(`
    SELECT p.fName, p.lName, COUNT(c.idcourse) AS courseCount
    FROM person p
    JOIN course c ON c.person_idperson = p.idperson
    GROUP BY p.idperson
    HAVING courseCount > 2
  `);
  task1.forEach(r => console.log(`  ${r.fName} ${r.lName} | Courses: ${r.courseCount}`));

  // 2- list each distinct country and the number of persons in it, only show countries with more than 2 persons
  console.log('\n── TASK 2: Countries with more than 2 persons ──');
  const [task2] = await pool.query(`
    SELECT country, COUNT(idperson) AS personCount
    FROM person
    GROUP BY country
    HAVING personCount > 2
  `);
  task2.forEach(r => console.log(`  Country: ${r.country} | Count: ${r.personCount}`));

  // 3- Update the email of all persons who have at least one project, set it to their firstName + lastName + '@company.com
  console.log('\n── TASK 3: Updating emails for people with projects ──');
  const [task3] = await pool.query(`
    UPDATE person 
    SET Email = CONCAT(fName, lName, '@company.com')
    WHERE idperson IN (SELECT DISTINCT person_idperson FROM project)
  `);
  console.log(`  Updated ${task3.affectedRows} emails.`);

  // 4- Delete all courses that belong to persons from a specific country (e.g., 'Egypt')
  console.log('\n── TASK 4: Deleting courses for a specific country ──');
  const targetCountry = 'Egypt'; // Change this to the desired country
  const [task4] = await pool.query(`
    DELETE FROM course 
    WHERE person_idperson IN (SELECT idperson FROM person WHERE country = ?)
  `, [targetCountry]);
  console.log(`  Deleted ${task4.affectedRows} courses.`);

  // 5- Show each country and the average number of languages spoken by persons from that country
  // Only show countries where the average is more than 1
  console.log('\n── TASK 5: Average languages per country (> 1) ──');
  const [task5] = await pool.query(`
    SELECT p.country, AVG(lang_counts.num_langs) AS avgLangs
    FROM person p
    JOIN (
      SELECT person_idperson, COUNT(*) AS num_langs
      FROM language
      GROUP BY person_idperson
    ) AS lang_counts ON p.idperson = lang_counts.person_idperson
    GROUP BY p.country
    HAVING avgLangs > 1
  `);
  task5.forEach(r => console.log(`  Country: ${r.country} | Avg Languages: ${r.avgLangs}`));

  await pool.end();
}

runQueries().catch(err => console.error('Error:', err.message));