import axios from 'axios';

export const getTogetherAIResponse = async (prompt) => {
  try {
    const response = await axios.post(
      process.env.TOGETHER_AI_API_URL,
      {
        model: 'togethercomputer/llama-2-70b-chat',
        max_tokens: 3000,
        prompt: prompt,
        request_type: 'language-model-inference',
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ['[/INST]', '</s>'],
        negative_prompt: '',
        sessionKey: process.env.SESSION_KEY, // Using session key from environment variables
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_AI_API_KEY}`,
        },
      }
    );

    return response.data.output.choices[0].text;
  } catch (error) {
    console.error('Error getting Together AI response:', error);
    throw new Error('Failed to get response from Together AI');
  }
};
