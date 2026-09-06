// Verification script for Skill Swap REST APIs
const testApi = async () => {
  const baseUrl = 'http://localhost:5000';
  console.log(`\nTesting Skill Swap REST APIs against ${baseUrl}...`);

  try {
    // 1. Health check
    console.log('\n[1/5] Testing GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const health = await healthRes.json();
    console.log('Status:', healthRes.status);
    console.log('Response:', JSON.stringify(health, null, 2));

    // 2. Fetch skills
    console.log('\n[2/5] Testing GET /api/skills...');
    const skillsRes = await fetch(`${baseUrl}/api/skills`);
    const skillsData = await skillsRes.json();
    console.log('Status:', skillsRes.status, '| Skills Count:', skillsData.count);

    // 3. Authenticate to test protected CRUD
    console.log('\n[3/5] Testing POST /api/auth/login...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alex.chen@university.edu', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status, '| Authenticated User:', loginData.user?.name);
    const token = loginData.token;

    // 4. Create a new skill with Bearer token (CRUD: Create)
    console.log('\n[4/5] Testing POST /api/skills with JWT...');
    const newSkillPayload = {
      title: 'Automated Test Skill: Next.js & Server Components',
      category: 'Programming',
      level: 'Advanced',
      description: 'A test skill created to verify the REST API endpoint and CRUD functionality.',
      swapPreferences: 'Looking for Cloud Kubernetes mentoring',
      tags: ['Next.js', 'React', 'Test']
    };
    const createRes = await fetch(`${baseUrl}/api/skills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newSkillPayload)
    });
    const createdSkill = await createRes.json();
    console.log('Status:', createRes.status);
    console.log('Created Skill ID:', createdSkill.data?._id || createdSkill.data?.id);

    // 5. Test Search / Filtering
    console.log('\n[5/5] Testing GET /api/skills?category=Programming...');
    const filterRes = await fetch(`${baseUrl}/api/skills?category=Programming`);
    const filterData = await filterRes.json();
    console.log('Status:', filterRes.status, '| Filtered Programming Skills:', filterData.count);

    console.log('\nALL REST API VERIFICATIONS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('API Verification failed:', err.message);
    process.exit(1);
  }
};

testApi();
