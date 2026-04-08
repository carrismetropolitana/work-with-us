/* * */
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined');
}

if (!process.env.PORT) {
  throw new Error('PORT is not defined');
}