/**
 * @param {{
 *   livePreview: boolean,
 *   hasBearer: boolean,
 *   requestSignOut: () => Promise<void>,
 *   clearToken: () => void,
 * }} options
 */
export async function runPreSignInSignOut({
  livePreview,
  hasBearer,
  requestSignOut,
  clearToken,
}) {
  if (!hasBearer && !livePreview) return;
  try {
    await requestSignOut();
  } finally {
    clearToken();
  }
}

/**
 * @param {{
 *   livePreview: boolean,
 *   hasBearer: boolean,
 *   requestSignOut: () => Promise<void>,
 *   clearToken: () => void,
 *   redirect: () => void,
 * }} options
 */
export async function runSignOut({
  livePreview,
  hasBearer,
  requestSignOut,
  clearToken,
  redirect,
}) {
  if (livePreview || hasBearer) {
    await requestSignOut();
  }
  clearToken();
  redirect();
}
