const { z } = require('zod');

const schema = z.object({
  name: z.string().describe('Tên'),
  age: z.number().describe('Tuổi')
});

console.log('name description:', schema.shape.name.description);
console.log('name _def.description:', schema.shape.name._def.description);
