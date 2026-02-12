/**
 * Quick Task Creation via API
 *
 * Simple curl-based task creation
 * Works without dotenv module issues
 */

const API_URL = 'http://localhost:3000';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxbHRiZ3F0eHZ4cWZsbnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NDkzMDMsImV4cCI6MjA1NTEyNTMwM30.JJz4OaZlD1a6B7vZG4iBhWl7pO6hB1Cnq5Wk8JpZ8';

console.log('\n' + '='.repeat(60));
console.log('  Creating BTNE Prompt Engineering Research Task');
console.log('='.repeat(60) + '\n');

const taskData = {
  title: 'Comprehensive Prompt Engineering Research for BTNE Community',
  description: `Research and create an A-Z guide on Prompt Engineering for The Black Tech Community (BTNE).

This is a high-demand topic from the BTNE community, and there's currently no comprehensive resource available.

**Research Requirements:**

1. **Prompt Engineering Fundamentals**
   - What is prompt engineering?
   - Why it matters in 2025/2026
   - Key concepts and terminology
   - Real-world examples and case studies

2. **BTNE Community Context**
   - Current skill levels and experience
   - Common challenges BTNE members face
   - Technical backgrounds (vs non-technical roles)
   - Learning goals and career paths

3. **Best Practices & Patterns**
   - Structure of effective prompts
   - Do's and Don'ts of prompting
   - Common pitfalls to avoid
   - Advanced techniques (few-shot, chain-of-thought, etc.)

4. **Tools & Platforms**
   - AI tools that work best with prompt engineering
   - Platform-specific optimizations (ChatGPT, Claude, etc.)
   - Custom prompts vs. system prompts

5. **Practical Applications for BTNE**
   - Coding and technical tasks
   - Resume and career advancement
   - Learning new technologies
   - Day-to-day productivity boosters
   - Problem-solving workflows

6. **A-Z Guide Structure**
   - Organized from beginner to advanced
   - Code examples and templates
   - Step-by-step tutorials
   - Real-world scenarios BTNE members relate to

**Deliverables:**

- Comprehensive A-Z guide (10,000+ words)
- Code snippets and examples
- Templates for common scenarios
- Case studies from BTNE community
- Quick-reference cheat sheet
- Recommended AI tools for BTNE professionals

**Success Criteria:**

- Covers fundamentals to advanced topics
- BTNE-relevant examples throughout
- Practical, actionable advice
- Clear structure (A-Z or categorized)
- Includes 10+ code examples
- Cites sources and references`,
  status: 'todo',
  assigned_agent: 'researcher',
  priority: 'urgent',
  requires_approval: true,
  tags: ['btne', 'prompt-engineering', 'research', 'a-z-guide'],
};

console.log('\nTask Details:');
console.log('  Title:', taskData.title);
console.log('  Description length:', taskData.description.split('\n').length, 'lines');
console.log('  Agent: Researcher 🧪');
console.log('  Priority: URGENT');
console.log('  Estimated: 8 hours');
console.log('');

const payload = JSON.stringify(taskData);


console.log('Sending to API via fetch...');

(async () => {
  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': API_KEY
      },
      body: payload
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Task created successfully! 🚀');
    console.log('Response:', JSON.stringify(data, null, 2));

    console.log('\nIf successful, task will appear in "To Do" column.');
    console.log('Auto-complete runner will pick it up in ~2 minutes.');
    console.log('Researcher will start working automatically.');

  } catch (error) {
    console.error('❌ Error creating task:', error);
  }
})();

