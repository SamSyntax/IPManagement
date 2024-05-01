/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication (in that case it's just an auth page)
 * @type {string[]}
 */

export const publicRoutes: string[] = [];

/**
 * An array of routes that are NOT accessible to the public
 * These routes will redirect logged in users to the root page
 * @type {string[]}
 */

export const authRoutes: string[] = ["/auth/login"];

/**
 * A prefix for API auth route
 * Routes with this prefix are used for API auth purposes
 * @type {string}
 */

export const authApiPrefix: string = "/api/auth";

/**
 * The default redirect path after successful authentication
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT: string = "/";
