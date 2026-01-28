const { matchJobToCandidates } = require('../utils/atsMatcher');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const testATS = async () => {
    console.log('--- TESTING ATS MATCHING WITH LLM ---');

    const job = {
        title: "Junior AI Engineer",
        description: "We are looking for a Junior AI Engineer with experience in Python, TensorFlow, and React.js to build AI-powered applications.",
        required_skills: ["Python", "TensorFlow", "React.js", "Machine Learning", "Node.js"]
    };

    const candidate = {
        id: "alice_test",
        degree: "B.Tech Computer Science",
        cgpa: 9.2,
        skills: ["Python", "TensorFlow", "React", "Keras", "Node.js", "MongoDB"]
    };

    // Candidate 2: Bad Match
    const candidate2 = {
        id: "bob_test",
        degree: "B.A. History",
        cgpa: 7.5,
        skills: ["Microsoft Word", "Communication", "Leadership"]
    };

    console.log('Sending profiles to Gemini...');
    const results = await matchJobToCandidates(job, [candidate, candidate2]);

    console.log('\n--- MATCH RESULTS ---');
    console.log(JSON.stringify(results, null, 2));

    if (results[0].match_score >= 60 && results[1].match_score < 40) {
        console.log('\n✅ TEST PASSED: High score for good match, low score for bad match.');
    } else {
        console.log('\n❌ TEST FAILED: Scores do not match expectations.');
        console.log(`Alice Score: ${results[0].match_score} (Expected >= 80)`);
        console.log(`Bob Score: ${results[1].match_score} (Expected < 40)`);
    }
};

testATS();
