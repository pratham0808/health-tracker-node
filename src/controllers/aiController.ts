import { Request, Response } from 'express';
import axios from 'axios';

interface AISuggestionRequest {
  userInput: string;
  existingGroups?: {
    categories: Array<{
      categoryName: string;
        exercises: Array<{ exerciseName: string; description: string }>;
    }>;
  };
}

interface ExerciseSuggestion {
  exerciseName: string;
  description: string;
}

interface CategorySuggestion {
  categoryName: string;
  exercises: ExerciseSuggestion[];
}

interface AISuggestionResponse {
  summary: string;
  categories: CategorySuggestion[];
}

export const getAISuggestions = async (req: Request, res: Response) => {
  try {
    const { userInput, existingGroups }: AISuggestionRequest = req.body;

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({
        error: 'User input is required'
      });
    }

    // Call Claude API with existing groups context
    const claudeResponse = await callClaudeAPI(userInput, existingGroups);

    if (!claudeResponse) {
      return res.status(500).json({
        error: 'Failed to get AI suggestions'
      });
    }

    res.json(claudeResponse);
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

async function callClaudeAPI(userInput: string,
  existingGroups?: AISuggestionRequest['existingGroups'])
  : Promise<AISuggestionResponse | null> {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      console.error('Claude API key not found in environment variables');
      return null;
    }

    // Build context about existing groups
    let existingContext = '';
    if (existingGroups && existingGroups.categories && existingGroups.categories.length > 0) {
      existingContext = `\n\nEXISTING EXERCISE GROUPS:\n`;
      existingGroups.categories.forEach(category => {
        existingContext += `- ${category.categoryName}: ${category.exercises.map(ex => ex.exerciseName + (ex.description ? ` (${ex.description})` : '')).join(', ')}\n`;
      });
      existingContext += `\nPlease consider these existing groups when making suggestions. You can:\n`;
      existingContext += `- Add new exercises to existing categories if they fit\n`;
      existingContext += `- Create new categories that complement the existing ones\n`;
      existingContext += `- Suggest improvements or variations to existing exercises\n`;
    }

    const prompt = `You are a fitness expert. Based on the user's input, provide the COMPLETE exercise structure they want in JSON format.

User Input: "${userInput}"${existingContext}

IMPORTANT: Return the COMPLETE desired exercise structure, not just additions. If the user wants to remove something, don't include it. If they want to modify something, return the modified version.

Please respond with a JSON object in this exact format (description field is MANDATORY for every exercise):
{
  "summary": "Brief 2-3 line summary of what you've designed for the user",
  "categories": [
    {
      "categoryName": "Group Name",
      "exercises": [
        {
          "exerciseName": "Exercise 1",
          "description": "Brief description of how to perform this exercise (max 2 lines) - REQUIRED FIELD"
        },
        {
          "exerciseName": "Exercise 2", 
          "description": "Brief description of how to perform this exercise (max 2 lines) - REQUIRED FIELD"
        }
      ]
    }
  ]
}

Guidelines:
- Return the COMPLETE exercise structure the user wants
- If user says "remove [exercise/group]", return structure WITHOUT that exercise/group
- If user says "add [exercise]", return structure WITH that exercise added
- If user says "replace [exercise] with [new exercise]", return structure with the replacement
- If user says "reorganize" or "restructure", return the new organization
- Create 2-4 relevant exercise groups based on the user's input
- Each group should have 3-6 exercises
- Use common, well-known exercise names
- Focus on the user's specific request
- If they mention specific exercises, include those and add related ones
- Make sure all exercise names are clear and specific
- CRITICAL: Every exercise MUST have a description field - this is mandatory and required
- Descriptions must be practical, helpful, and include key form tips (max 2 lines)
- Descriptions should explain proper technique, body positioning, and movement patterns
- Never return an exercise without a description - this will cause errors
- Include a "summary" field with a brief 2-3 line explanation of what you've designed
- The summary should highlight the key benefits and focus areas of the workout
- Return only the JSON, no additional text`;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    });

    const content = (response.data as any).content[0].text;

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Claude response');
      return null;
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    return parsedResponse as AISuggestionResponse;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return null;
  }
}
