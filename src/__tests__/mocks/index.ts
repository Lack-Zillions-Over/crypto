export const texts = {
  string: 'John Doe',
  number: Number(123).toString(),
  boolean: String(true),
  object: JSON.stringify({ name: 'John Doe' }),
  buffer: Buffer.from('John Doe').toString(),
};
