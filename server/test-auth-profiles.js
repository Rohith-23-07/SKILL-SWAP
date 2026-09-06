// Comprehensive test suite for Authentication, Protected Skill CRUD, and User Profiles
const testAuthAndProfiles = async () => {
  const baseUrl = 'http://localhost:5000';
  console.log(`\n=== Running Skill Swap Auth & Profile Test Suite against ${baseUrl} ===\n`);

  let testsPassed = 0;
  let testsFailed = 0;

  const assert = (condition, testName, extraInfo = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${extraInfo}`);
      testsFailed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const health = await healthRes.json();
    assert(healthRes.status === 200, 'Server health check returns 200');

    // 2. Register a new student
    const testEmail = `student_${Date.now()}@university.edu`;
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Miller',
        email: testEmail,
        password: 'password123',
        university: 'Stanford University',
        bio: 'Machine Learning researcher and mobile dev enthusiast.',
        skillsOffered: ['PyTorch', 'TensorFlow'],
        skillsWanted: ['SwiftUI', 'Design Systems']
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.token && !regData.user.password, 'Register new student returns 201 with JWT (password not exposed)');
    const student1Token = regData.token;
    const student1Id = regData.user.id || regData.user._id;

    // 3. Duplicate email registration
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Imposter',
        email: testEmail,
        password: 'password123'
      })
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 400 && dupData.success === false, 'Duplicate email registration rejected with 400');

    // 4. Correct login
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.token && !loginData.user.password, 'Correct login returns 200 with JWT (password not exposed)');

    // 5. Wrong login (incorrect password)
    const wrongLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongpassword'
      })
    });
    assert(wrongLoginRes.status === 401, 'Login with incorrect password rejected with 401');

    // 6. GET /api/auth/me with valid JWT
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${student1Token}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user.email === testEmail && !meData.user.password, 'GET /api/auth/me returns 200 with authenticated user (no password)');

    // 7. GET /api/auth/me with missing JWT
    const meNoTokenRes = await fetch(`${baseUrl}/api/auth/me`);
    assert(meNoTokenRes.status === 401, 'GET /api/auth/me without token rejected with 401');

    // 8. GET /api/auth/me with invalid/tampered JWT
    const meBadTokenRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': 'Bearer invalid.jwt.token' }
    });
    assert(meBadTokenRes.status === 401, 'GET /api/auth/me with tampered token rejected with 401');

    // 9. PUT /api/auth/me (Edit Profile)
    const updateMeRes = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${student1Token}`
      },
      body: JSON.stringify({
        bio: 'Updated Bio: Building distributed systems and exploring AI.',
        university: 'Stanford AI Lab',
        skillsOffered: ['PyTorch', 'FastAPI', 'Distributed ML'],
        skillsWanted: ['React Native', 'UI Design']
      })
    });
    const updateMeData = await updateMeRes.json();
    assert(
      updateMeRes.status === 200 &&
      updateMeData.user.university === 'Stanford AI Lab' &&
      updateMeData.user.skillsOffered.includes('Distributed ML'),
      'PUT /api/auth/me successfully updates profile fields'
    );

    // 10. Create second student to test skill ownership and permissions
    const student2Email = `student2_${Date.now()}@university.edu`;
    const reg2Res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Connor',
        email: student2Email,
        password: 'password123',
        university: 'MIT'
      })
    });
    const reg2Data = await reg2Res.json();
    const student2Token = reg2Data.token;

    // 11. Create skill while logged out -> must fail with 401
    const unauthSkillRes = await fetch(`${baseUrl}/api/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthorized Skill Listing',
        category: 'Programming',
        description: 'Should be blocked because no auth token is provided.'
      })
    });
    assert(unauthSkillRes.status === 401, 'Creating skill while logged out rejected with 401');

    // 12. Create skill while logged in (student 1) -> must succeed with 201 & owner matched to student 1
    const createSkillRes = await fetch(`${baseUrl}/api/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${student1Token}`
      },
      body: JSON.stringify({
        title: 'Deep Learning with PyTorch & Neural Networks',
        category: 'AI & Data Science',
        level: 'Advanced',
        description: 'Comprehensive 1-on-1 tutoring on PyTorch tensors, autograd, and transformer architectures.',
        swapPreferences: 'Looking for React Native or Flutter mentorship.',
        tags: ['PyTorch', 'AI', 'Deep Learning']
      })
    });
    const createSkillData = await createSkillRes.json();
    const createdSkill = createSkillData.data;
    const skillId = createdSkill._id || createdSkill.id;
    assert(
      createSkillRes.status === 201 &&
      createdSkill.user.id.toString() === student1Id.toString() &&
      createdSkill.user.name === 'Jordan Miller',
      'Creating skill while logged in assigns ownership from JWT user'
    );

    // 13. Student 2 attempts to UPDATE Student 1's skill -> must fail with 403 Forbidden
    const illegalUpdateRes = await fetch(`${baseUrl}/api/skills/${skillId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${student2Token}`
      },
      body: JSON.stringify({
        title: 'Hacked Skill Title'
      })
    });
    assert(illegalUpdateRes.status === 403, 'Attempt by another user to update skill rejected with 403 Forbidden');

    // 14. Student 2 attempts to DELETE Student 1's skill -> must fail with 403 Forbidden
    const illegalDeleteRes = await fetch(`${baseUrl}/api/skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${student2Token}`
      }
    });
    assert(illegalDeleteRes.status === 403, 'Attempt by another user to delete skill rejected with 403 Forbidden');

    // 15. Student 1 (Owner) updates their own skill -> must succeed with 200
    const legalUpdateRes = await fetch(`${baseUrl}/api/skills/${skillId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${student1Token}`
      },
      body: JSON.stringify({
        title: 'Deep Learning & Transformers in PyTorch (Updated)',
        level: 'Advanced'
      })
    });
    const legalUpdateData = await legalUpdateRes.json();
    assert(
      legalUpdateRes.status === 200 &&
      legalUpdateData.data.title.includes('(Updated)'),
      'Owner can successfully update their own skill'
    );

    // 16. GET /api/users/:id (Public Student Profile)
    const publicProfileRes = await fetch(`${baseUrl}/api/users/${student1Id}`);
    const publicProfileData = await publicProfileRes.json();
    assert(
      publicProfileRes.status === 200 &&
      publicProfileData.user.name === 'Jordan Miller' &&
      !publicProfileData.user.password &&
      Array.isArray(publicProfileData.skills),
      'GET /api/users/:id returns public student profile & their skills without password'
    );

    // 17. Student 1 (Owner) deletes their own skill -> must succeed with 200
    const legalDeleteRes = await fetch(`${baseUrl}/api/skills/${skillId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${student1Token}`
      }
    });
    assert(legalDeleteRes.status === 200, 'Owner can successfully delete their own skill');

    // 18. Public skills search and category filter still work
    const searchRes = await fetch(`${baseUrl}/api/skills?category=Programming`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200 && Array.isArray(searchData.data), 'Public skills search & category filtering still works');

    console.log(`\n=== Test Results: ${testsPassed} Passed, ${testsFailed} Failed ===\n`);
    process.exit(testsFailed === 0 ? 0 : 1);
  } catch (error) {
    console.error('Test Suite Error:', error);
    process.exit(1);
  }
};

testAuthAndProfiles();
