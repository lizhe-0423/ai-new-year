import app from '../server.js';

export default async function handler(req, res) {
  // Ensure the app is ready to handle requests
  return app(req, res);
}