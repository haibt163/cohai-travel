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
