import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// Generate JWT
export async function generateJWT(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret);
}

// Verify JWT
export async function verifyJWT(token) {
  const { payload } = await jwtVerify(token, secret);
  console.log('payload :',payload)
  return payload;
}
