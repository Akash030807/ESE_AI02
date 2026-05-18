const axios = require('axios');
const Employee = require('../models/Employee');

const getAIRecommendation = async (req, res) => {
  try {
    // Optionally pass employeeId or analyze all
    const { employeeId } = req.body;
    let promptText = "";

    if (employeeId) {
      const emp = await Employee.findById(employeeId);
      if (!emp) return res.status(404).json({ message: 'Employee not found' });
      promptText = `Analyze this employee and provide promotion recommendation, improvement feedback, and skill enhancement suggestions:
      Name: ${emp.name}
      Department: ${emp.department}
      Skills: ${emp.skills.join(', ')}
      Performance Score: ${emp.performanceScore} / 100
      Experience: ${emp.experience} years.
      Keep it professional, concise and structured in bullet points.`;
    } else {
      const employees = await Employee.find({});
      if(employees.length === 0) return res.status(400).json({ message: 'No employees found' });
      promptText = `Here is a list of employees. Please provide a ranked recommendation for promotions and training suggestions based on performance score and skills:
      ${employees.map(e => `- ${e.name} (${e.department}): Score ${e.performanceScore}, Exp: ${e.experience} yrs, Skills: ${e.skills.join(', ')}`).join('\n')}
      Keep it professional, concise and structured.`;
    }

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'openai/gpt-3.5-turbo', // You can change the model if needed, openrouter fallback works
      messages: [
        { role: 'system', content: 'You are an expert HR AI Assistant.' },
        { role: 'user', content: promptText }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const aiOutput = response.data.choices[0].message.content;
    res.json({ recommendation: aiOutput });
  } catch (error) {
    console.error('AI API Error:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Error generating AI recommendation', error: error.message });
  }
};

module.exports = { getAIRecommendation };
