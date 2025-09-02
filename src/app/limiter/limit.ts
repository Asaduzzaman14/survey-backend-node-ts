// import rateLimit from 'express-rate-limit';

// // Example: General user limiter
// const userLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000,  
//     max: 10,
//     message: 'Too many requests, please try again later.',
// });

// // Admin login limiter
// const adminLoginLimiter = rateLimit({
//     windowMs: 5 * 60 * 1000, 
//     max: 3,
//     message: 'Too many login attempts. Try again after 5 minutes.',
// });

// // Password reset limiter
// const passwordResetLimiter = rateLimit({
//     windowMs: 10 * 60 * 1000, 
//     max: 2,
//     message: 'Too many reset attempts. Please try again later.',
// });


// // export const limiters = {
// //     userLimiter,  // General user limiter
// //     adminLoginLimiter, // Admin login limiter
// //     passwordResetLimiter, // Password reset limiter
// // };
