const { z } = require('zod');

const schema = z.object({
  name: z.string().describe('Tên').min(1),
  age: z.number().min(1).describe('Tuổi')
});

console.log('name description:', schema.shape.name.description);
console.log('age description:', schema.shape.age.description);
